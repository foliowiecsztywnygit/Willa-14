import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env.local') });
dotenv.config({ path: path.resolve('.env') });

const smoobuKey = process.env.SMOOBU_API_KEY || '';

async function fetchApartment(id) {
  try {
    const res = await fetch(`https://login.smoobu.com/api/reservations?apartmentId=${id}`, {
      headers: { 'Api-Key': smoobuKey, 'Cache-Control': 'no-cache' }
    });
    
    if (!res.ok) {
      console.error(`Błąd zapytania dla ${id}:`, res.status, await res.text());
      return;
    }
    
    const data = await res.json();
    console.log(`Dla ${id} znaleziono rezerwacji:`, (data.bookings || []).length);
  } catch (err) {
    console.error("Błąd fetch:", err);
  }
}

fetchApartment(3252267);
fetchApartment(9999999);
