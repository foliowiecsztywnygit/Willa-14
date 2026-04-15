import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env.local') });
dotenv.config({ path: path.resolve('.env') });

const smoobuKey = process.env.SMOOBU_API_KEY || '';

async function fetchApartments() {
  console.log("=== Pobieranie apartamentów ze Smoobu ===");
  try {
    const res = await fetch('https://login.smoobu.com/api/apartments', {
      headers: { 'Api-Key': smoobuKey, 'Cache-Control': 'no-cache' }
    });
    
    if (!res.ok) {
      console.error("Błąd zapytania:", res.status, await res.text());
      return;
    }
    
    const data = await res.json();
    console.log("Znalezione apartamenty:");
    console.log(JSON.stringify(data.apartments || data, null, 2));
  } catch (err) {
    console.error("Błąd fetch:", err);
  }
}

fetchApartments();
