import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import https from 'https';
import http from 'http';

// Wczytywanie zmiennych z plików .env
dotenv.config({ path: path.resolve(__dirname, '.env.local') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Inicjalizacja Stripe z tajnym kluczem
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2023-10-16',
});

// Prosty plugin Vite, który działa jako lokalny backend dla testów Stripe i Emaili
function localStripeBackend() {
  return {
    name: 'local-stripe-backend',
    configureServer(server: { middlewares: { use: (handler: (req: import('http').IncomingMessage, res: import('http').ServerResponse, next: () => void) => void | Promise<void>) => void } }) {
      server.middlewares.use(async (req, res, next) => {
        
        // --- 1. INITIALIZATION ---
        // Generuje PaymentIntent jak tylko klient wejdzie na stronę rezerwacji
        if (req.url === '/api/init-payment' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
          req.on('end', async () => {
            try {
              const { room_id, from, to } = JSON.parse(body);

              const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
              const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''; 
              const supabase = createClient(supabaseUrl, supabaseKey);

              // Backend wylicza cenę
              const { data: room, error: roomError } = await supabase
                .from('rooms')
                .select('base_price, smoobu_id')
                .eq('id', room_id)
                .single();

              if (roomError || !room) throw new Error("Room not found");

              // 0. Sprawdzenie dostępności w Smoobu
              const smoobuId = room.smoobu_id;
              
              if (smoobuId) {
                const fromDateApi = new Date();
                fromDateApi.setDate(fromDateApi.getDate() - 30);
                
                const smoobuAvailRes = await fetch(`https://login.smoobu.com/api/reservations?from=${fromDateApi.toISOString().split('T')[0]}&apartmentId=${smoobuId}`, {
                  headers: {
                    'Api-Key': process.env.SMOOBU_API_KEY || '',
                    'Cache-Control': 'no-cache'
                  }
                });

                if (smoobuAvailRes.ok) {
                  const smoobuData = await smoobuAvailRes.json();
                  const reqStart = new Date(from);
                  const reqEnd = new Date(to);
                  
                  const hasOverlap = (smoobuData.bookings || [])
                    .filter((r: { type: string }) => r.type !== 'cancellation')
                    .some((r: { arrival: string, departure: string }) => {
                      const bStart = new Date(r.arrival);
                      const bEnd = new Date(r.departure);
                      return reqStart < bEnd && reqEnd > bStart;
                    });
                    
                  if (hasOverlap) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: "Termin jest już zarezerwowany w Smoobu." }));
                    return;
                  }
                }
              }

              const start = new Date(from);
              const end = new Date(to);
              const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
              const totalPrice = room.base_price * nights;
              const depositAmount = Math.round(totalPrice * 0.3);
              const amountInGrosze = depositAmount * 100;

              console.log(`[Local Backend] Inicjalizacja płatności na: ${amountInGrosze} groszy.`);

              // W zależności od uprawnień na koncie Stripe testowym/produkcyjnym
              // bezpieczniej dla PaymentElement jest zostawić "automatic",
              // aby Stripe sam wynegocjował z klientem jakie formy płatności udostępnić
              const paymentIntent = await stripe.paymentIntents.create({
                amount: amountInGrosze,
                currency: 'pln',
                payment_method_types: ['card', 'blik', 'p24'],
              });

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ 
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                depositAmount,
                totalPrice
              }));
            } catch (error) {
              console.error("[Local Backend Init Error]:", error);
              res.statusCode = 400;
              res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
            }
          });
          return;
        }

        // --- 1.5. LOGI Z FRONTENDU ---
        if (req.url === '/api/frontend-log' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              console.log(`[Frontend Trace] ${parsed.msg}`, parsed.data || '');
            } catch (e) {
              console.error("[Frontend Trace Error]:", e);
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true }));
          });
          return;
        }

        // --- 1.6. UTWÓRZ REZERWACJĘ NA BACKENDZIE ---
        if (req.url === '/api/create-booking' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
          req.on('end', async () => {
            try {
              const { paymentIntentId, bookingData } = JSON.parse(body);
              console.log(`[Local Backend] Tworzenie rezerwacji w bazie dla: ${bookingData.guestName}`);
              
              const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
              const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''; 
              const supabase = createClient(supabaseUrl, supabaseKey);

              const { data: booking, error: bookingError } = await supabase
                .from('bookings')
                .insert([{
                  room_id: bookingData.roomId,
                  check_in: bookingData.fromDate,
                  check_out: bookingData.toDate,
                  guest_name: bookingData.guestName,
                  guest_email: bookingData.guestEmail,
                  guest_phone: bookingData.guestPhone,
                  guests_count: bookingData.guestsCount,
                  total_amount: bookingData.totalAmount,
                  deposit_amount: bookingData.depositAmount,
                  status: 'pending'
                }])
                .select()
                .single();

              if (bookingError) throw bookingError;

              const { error: paymentError } = await supabase
                .from('payments')
                .insert([{
                  booking_id: booking.id,
                  amount: bookingData.depositAmount,
                  method: 'card', // Musi pasować do constraints bazy: 'blik', 'transfer', 'card'
                  transaction_id: paymentIntentId,
                  status: 'pending'
                }]);

              if (paymentError) throw paymentError;

              console.log(`[Local Backend] Rezerwacja utworzona pomyślnie. ID: ${booking.id}`);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, bookingId: booking.id }));
            } catch (error) {
              console.error("[Local Backend Create Booking Error]:", error);
              res.statusCode = 400;
              res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
            }
          });
          return;
        }

        // --- 2. VERIFY PAYMENT & SEND EMAIL ---
        // Wywoływane po przekierowaniu lub udanym requeście Stripe z UI
        if (req.url === '/api/verify-payment' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
          req.on('end', async () => {
            try {
              const { paymentIntentId, bookingId, guestEmail } = JSON.parse(body);
              
              // Weryfikacja ze Stripe czy zapłacono (lub tryb deweloperski pomijający weryfikację jeśli podano fake id)
              let piStatus = 'processing';
              if (paymentIntentId !== 'pi_dummy') {
                const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
                piStatus = pi.status;
              } else {
                console.log("[Dev Mode] Pomijam sprawdzanie Stripe dla id:", paymentIntentId);
                piStatus = 'succeeded';
              }
              
              if (piStatus === 'succeeded' || piStatus === 'processing') {
                const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
                const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''; 
                const supabase = createClient(supabaseUrl, supabaseKey);

                // Aktualizacja bazy
                const { error: pErr } = await supabase.from('payments').update({ status: 'completed' }).eq('booking_id', bookingId);
                const { error: bErr } = await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', bookingId);

                if (pErr) console.error("Payment update error:", pErr);
                if (bErr) console.error("Booking update error:", bErr);

                // --- INTEGRACJA ZE SMOOBU ---
                console.log("[Smoobu Sync] Rozpoczynanie synchronizacji dla rezerwacji:", bookingId);
                const { data: bookingData, error: bFetchErr } = await supabase
                  .from('bookings')
                  .select('*, rooms(smoobu_id)')
                  .eq('id', bookingId)
                  .single();

                if (!bFetchErr && bookingData && process.env.SMOOBU_API_KEY) {
                  const smoobuPayload = {
                    arrivalDate: bookingData.check_in,
                    departureDate: bookingData.check_out,
                    apartmentId: bookingData.rooms?.smoobu_id,
                    firstName: bookingData.guest_name.split(' ')[0] || 'Gość',
                    lastName: bookingData.guest_name.split(' ').slice(1).join(' ') || 'Direct',
                    email: bookingData.guest_email || 'brak@email.com',
                    price: bookingData.total_amount,
                    notice: `Rezerwacja bezpośrednia ze strony Willa 14 Zakopane. Gości: ${bookingData.guests_count}. Telefon: ${bookingData.guest_phone || 'Brak'}`
                  };

                  if (!smoobuPayload.apartmentId) {
                    throw new Error("Brak przypisanego smoobu_id dla tego pokoju. Rezerwacja w Smoobu nie zostanie utworzona.");
                  }

                  console.log("[Smoobu Sync] Wysyłanie payloadu:", smoobuPayload);

                  const smoobuRes = await fetch('https://login.smoobu.com/api/reservations', {
                    method: 'POST',
                    headers: {
                      'Api-Key': process.env.SMOOBU_API_KEY,
                      'Content-Type': 'application/json',
                      'Cache-Control': 'no-cache'
                    },
                    body: JSON.stringify(smoobuPayload)
                  });

                  console.log("[Smoobu Sync] Otrzymano odpowiedź, status:", smoobuRes.status);

                  if (!smoobuRes.ok) {
                    const errText = await smoobuRes.text();
                    console.error('[Smoobu Sync Error]:', errText);
                    
                    // Zapisz błąd do bazy danych
                    await supabase.from('sync_logs').insert([{
                      room_id: bookingData.room_id,
                      status: 'error',
                      message: `[Smoobu POST Error] ${errText}`
                    }]);
                  } else {
                    const resJson = await smoobuRes.json();
                    console.log(`[Smoobu Sync Success]: Rezerwacja ${bookingId} przesłana do Smoobu. ID ze Smoobu:`, resJson.id);
                  }
                } else {
                  console.warn("[Smoobu Sync Warning]: Nie udało się pobrać danych rezerwacji lub brakuje API KEY.", { error: bFetchErr, hasApiKey: !!process.env.SMOOBU_API_KEY });
                }
                // --- KONIEC INTEGRACJI SMOOBU ---

                // Wysłanie maila przez Mailgun
                try {
                  const mailgun = new Mailgun(FormData);
                  const mg = mailgun.client({
                    username: 'api',
                    key: process.env.MAILGUN_API_KEY || "YOUR_MAILGUN_API_KEY"
                    // USunięto opcję `url` z powodu domeny amerykańskiej Mailgun Sandbox
                  });
                  
                  const domain = process.env.MAILGUN_DOMAIN || "YOUR_MAILGUN_DOMAIN";
                  const fromEmail = `Willa 14 Zakopane <postmaster@${domain}>`;
                  
                  const messageData = {
                    from: fromEmail,
                    to: [guestEmail || "krzysztozebrowsky@gmail.com"], // Zmieniono fallback na zweryfikowany e-mail
                    subject: "Potwierdzenie opłacenia zadatku - Willa 14 Zakopane",
                    text: `Dziękujemy za rezerwację! Twój numer rezerwacji to: ${bookingId}. Zadatek został pomyślnie opłacony. Do zobaczenia w Zakopanem!`,
                    html: `
                      <div style="font-family: sans-serif; color: #333; line-height: 1.6;">
                        <h2 style="color: #D4AF37;">Dziękujemy za rezerwację!</h2>
                        <p>Twój numer rezerwacji to: <strong>${bookingId}</strong>.</p>
                        <p>Zadatek został pomyślnie opłacony. Oczekujemy na Twój przyjazd!</p>
                        <p>Pozdrawiamy,<br>Zespół Willa 14 Zakopane</p>
                      </div>
                    `
                  };

                  const mgRes = await mg.messages.create(domain, messageData);
                  console.log(`[Local Backend Email] Wysłano maila na adres: ${guestEmail}. ID:`, mgRes.id);
                  
                } catch (mailErr: unknown) {
                  const status = mailErr && typeof mailErr === 'object' && 'status' in mailErr ? (mailErr as {status?: number}).status : 'Unknown';
                  const message = mailErr instanceof Error ? mailErr.message : String(mailErr);
                  console.error("[Local Backend Email Error]: Błąd wysyłania maila (Mailgun):", status, message);
                  if (status === 403) {
                    console.error("FATAL: Używasz darmowej domeny testowej (Sandbox) w Mailgun, która pozwala na wysyłanie e-maili TYLKO na autoryzowane (zweryfikowane) adresy e-mail (np. Twoje własne konto). Próba wysłania maila do gościa, którego nie dodałeś do 'Authorized Recipients' w panelu Mailgun zakończy się błędem 403.");
                  }
                }

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } else {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, status: piStatus }));
              }
            } catch (error) {
              console.error("[Local Backend Verify Error]:", error);
              res.statusCode = 400;
              res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
            }
          });
          return;
        }

        // --- 3. SYNC ICAL FROM EXTERNAL SOURCE ---
        if (req.url === '/api/sync-ical' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
          req.on('end', async () => {
            try {
              const { roomId } = JSON.parse(body);
              if (!roomId) throw new Error("Missing roomId");

              const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
              const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''; 
              const supabase = createClient(supabaseUrl, supabaseKey);

              // Pobierz URL iCal z pokoju
              const { data: room, error: roomError } = await supabase
                .from('rooms')
                .select('ical_url')
                .eq('id', roomId)
                .single();

              if (roomError || !room) throw new Error("Room not found");
              if (!room.ical_url) throw new Error("Room has no ical_url configured");

              // Pobierz zawartość kalendarza
              const fetchIcal = () => new Promise<string>((resolve, reject) => {
                const client = room.ical_url.startsWith('https') ? https : http;
                client.get(room.ical_url, (res) => {
                  let data = '';
                  res.on('data', chunk => { data += chunk; });
                  res.on('end', () => resolve(data));
                }).on('error', reject);
              });

              const icalData = await fetchIcal();

              // Bardzo prosty parser ICS do VEVENT
              const events = [];
              const lines = icalData.split(/\r?\n/);
              let currentEvent: any = null;

              for (const line of lines) {
                if (line.startsWith('BEGIN:VEVENT')) {
                  currentEvent = {};
                } else if (line.startsWith('END:VEVENT')) {
                  if (currentEvent && currentEvent.dtstart && currentEvent.dtend) {
                    events.push(currentEvent);
                  }
                  currentEvent = null;
                } else if (currentEvent) {
                  if (line.startsWith('DTSTART')) {
                    const match = line.match(/:(.+)$/);
                    if (match) currentEvent.dtstart = match[1];
                  } else if (line.startsWith('DTEND')) {
                    const match = line.match(/:(.+)$/);
                    if (match) currentEvent.dtend = match[1];
                  } else if (line.startsWith('SUMMARY')) {
                    const match = line.match(/:(.+)$/);
                    if (match) currentEvent.summary = match[1];
                  } else if (line.startsWith('UID')) {
                    const match = line.match(/:(.+)$/);
                    if (match) currentEvent.uid = match[1];
                  }
                }
              }

              // Funkcja pomocnicza do parsowania daty z ICS (YYYYMMDD)
              const parseIcalDate = (dateStr: string) => {
                if (!dateStr) return null;
                const d = dateStr.replace(/T.*$/, ''); // ignoruj czas jeśli jest
                if (d.length !== 8) return null;
                return `${d.substring(0,4)}-${d.substring(4,6)}-${d.substring(6,8)}`;
              };

              let addedCount = 0;

              // Przejdź przez zdarzenia i dodaj do bazy jeśli ich nie ma
              for (const ev of events) {
                const checkIn = parseIcalDate(ev.dtstart);
                const checkOut = parseIcalDate(ev.dtend);
                
                if (!checkIn || !checkOut) continue;

                // Ignoruj nasze własne rezerwacje wyeksportowane (żeby nie było pętli)
                if (ev.uid && ev.uid.includes('@willa14.pl')) continue;

                // Sprawdź czy już istnieje rezerwacja na ten termin z zewnętrznego źródła
                const { data: existing } = await supabase
                  .from('bookings')
                  .select('id')
                  .eq('room_id', roomId)
                  .eq('guest_name', 'External Sync (Booking.com)')
                  .eq('check_in', checkIn)
                  .eq('check_out', checkOut);

                if (!existing || existing.length === 0) {
                  await supabase.from('bookings').insert([{
                    room_id: roomId,
                    check_in: checkIn,
                    check_out: checkOut,
                    guest_name: 'External Sync (Booking.com)',
                    guest_email: 'sync@willa14.pl',
                    guest_phone: '000000000',
                    guests_count: 1,
                    total_amount: 0,
                    deposit_amount: 0,
                    status: 'confirmed'
                  }]);
                  addedCount++;
                }
              }

              // Log sync
              await supabase.from('sync_logs').insert([{
                room_id: roomId,
                status: 'success',
                events_added: addedCount,
                message: `Pomyślnie zsynchronizowano ${events.length} zdarzeń z kalendarza.`
              }]);

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, addedCount }));
            } catch (error) {
              console.error("[Local Backend Sync Error]:", error);
              
              // Próba zapisu błędu do logów jeśli się da
              try {
                const { roomId } = JSON.parse(body);
                if (roomId) {
                  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
                  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''; 
                  const supabase = createClient(supabaseUrl, supabaseKey);
                  await supabase.from('sync_logs').insert([{
                    room_id: roomId,
                    status: 'error',
                    message: error instanceof Error ? error.message : String(error)
                  }]);
                }
              } catch(e) {
                console.error("Failed to log sync error", e);
              }

              res.statusCode = 400;
              res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
            }
          });
          return;
        }

        // --- 5. GET AVAILABILITY FROM SMOOBU ---
        if (req.url === '/api/smoobu-availability' && req.method === 'GET') {
          try {
            if (!process.env.SMOOBU_API_KEY) {
               throw new Error("Missing SMOOBU_API_KEY in environment variables");
            }
            
            // Pobierz wszystkie rezerwacje z ostatnich 30 dni w tył i do roku w przód
            const fromDate = new Date();
            fromDate.setDate(fromDate.getDate() - 30);
            
            const smoobuRes = await fetch(`https://login.smoobu.com/api/reservations?from=${fromDate.toISOString().split('T')[0]}`, {
              headers: {
                'Api-Key': process.env.SMOOBU_API_KEY,
                'Cache-Control': 'no-cache'
              }
            });

            if (!smoobuRes.ok) {
              throw new Error(`Smoobu API responded with ${smoobuRes.status}`);
            }

            const data = await smoobuRes.json();
            
            // Mapowanie rezerwacji do uproszczonego formatu dla frontendu
            const blockedDates = (data.bookings || [])
              .filter((r: { type: string }) => r.type !== 'cancellation')
              .map((r: { arrival: string, departure: string }) => ({
                check_in: r.arrival,
                check_out: r.departure,
                apartment_id: r.apartment?.id || r.apartmentId,
                channel: r.channel?.name || 'Direct'
              }));

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, bookings: blockedDates }));
          } catch (error) {
            console.error("[Local Backend Smoobu Avail Error]:", error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
          }
          return;
        }

        next();
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    // traeBadgePlugin({
    //   variant: 'dark',
    //   position: 'bottom-right',
    //   prodOnly: true,
    //   clickable: true,
    //   clickUrl: 'https://www.trae.ai/solo?showJoin=1',
    //   autoTheme: true,
    //   autoThemeTarget: '#root'
    // }), 
    tsconfigPaths(),
    localStripeBackend() // Podpinamy nasz lokalny backend
  ],
})
