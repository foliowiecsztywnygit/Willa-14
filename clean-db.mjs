import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env.local') });
dotenv.config({ path: path.resolve('.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''; 
const supabase = createClient(supabaseUrl, supabaseKey);
const smoobuKey = process.env.SMOOBU_API_KEY || '';

async function forceClean() {
  console.log("=== 1. Czyszczenie bazy Supabase ===");
  // Pobierz ID przed usunięciem, by upewnić się, co robimy
  const { data: bookings } = await supabase.from('bookings').select('id, guest_name');
  
  if (bookings && bookings.length > 0) {
    console.log(`Znaleziono ${bookings.length} rezerwacji w Supabase. Usuwam...`);
    const ids = bookings.map(b => b.id);
    const { error } = await supabase.from('bookings').delete().in('id', ids);
    if (error) console.error("Błąd usuwania Supabase:", error);
    else console.log("Rezerwacje Supabase usunięte pomyślnie.");
  } else {
    console.log("Baza Supabase jest już pusta.");
  }

  console.log("\n=== 2. Czyszczenie (anulowanie) testowych rezerwacji w Smoobu ===");
  try {
    const res = await fetch('https://login.smoobu.com/api/reservations?apartmentId=3252267', {
      headers: { 'Api-Key': smoobuKey, 'Cache-Control': 'no-cache' }
    });
    const data = await res.json();
    const activeBookings = (data.bookings || []).filter(b => b.status !== 'cancelled' && b.status !== 'declined');
    
    console.log(`Znaleziono ${activeBookings.length} aktywnych rezerwacji w Smoobu.`);
    
    for (const b of activeBookings) {
      // Usuwamy lub anulujemy rezerwacje stworzone przez nas w testach (np. "Test Direct", "Test Stringprice" itp.)
      if (b['guest-name'] && b['guest-name'].includes('Test') || b['guest-name'].includes('Krzysztof')) {
        console.log(`Anulowanie rezerwacji w Smoobu ID: ${b.id} (${b['guest-name']})...`);
        
        // Uwaga: Smoobu pozwala usuwać tylko z określonym endpointem (POST /api/reservations/remove/ lub metoda DELETE /reservations/:id)
        // Zgodnie ze znalezioną wcześniej dokumentacją: DELETE /api/reservations/:id
        const delRes = await fetch(`https://login.smoobu.com/api/reservations/${b.id}`, {
          method: 'DELETE',
          headers: { 'Api-Key': smoobuKey }
        });
        
        if (delRes.ok) {
          console.log(`Pomyślnie usunięto rezerwację Smoobu: ${b.id}`);
        } else {
          console.error(`Błąd przy usuwaniu Smoobu ${b.id}:`, await delRes.text());
        }
      }
    }
  } catch (err) {
    console.error("Błąd podczas operacji Smoobu:", err);
  }
}

forceClean();