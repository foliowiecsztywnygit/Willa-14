import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env.local') });
dotenv.config({ path: path.resolve('.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''; 
const supabase = createClient(supabaseUrl, supabaseKey);

async function createFakeBooking() {
  const { data: room } = await supabase.from('rooms').select('id').limit(1).single();
  
  if (!room) {
    console.error("Brak pokoi w bazie");
    return;
  }

  const { data: booking, error } = await supabase.from('bookings').insert([{
    room_id: room.id,
    check_in: '2026-10-01',
    check_out: '2026-10-05',
    guest_name: 'Test Testowy',
    guest_email: 'test@example.com',
    guest_phone: '123456789',
    guests_count: 2,
    total_amount: 1000,
    deposit_amount: 300,
    status: 'pending'
  }]).select().single();

  if (error) {
    console.error("Błąd tworzenia rezerwacji:", error);
    return;
  }
  
  console.log("Utworzono rezerwację:", booking.id);

  // Wywołaj endpoint testowy
  const payload = {
    paymentIntentId: "pi_dummy", 
    bookingId: booking.id,
    guestEmail: "test@example.com"
  };

  try {
    const res = await fetch('http://localhost:5173/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    console.log("Status odpowiedzi z verify-payment:", res.status);
    const data = await res.json();
    console.log("Odpowiedź verify-payment:", data);
  } catch (e) {
    console.error("Błąd podczas wywoływania endpointu:", e);
  }
}

createFakeBooking();