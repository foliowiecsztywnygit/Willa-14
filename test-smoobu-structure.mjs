// remove node-fetch as native fetch is available in Node 18+
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env.local') });

const smoobuKey = process.env.SMOOBU_API_KEY || '';

async function testSmoobuGet() {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 30);
  const fromStr = fromDate.toISOString().split('T')[0];

  console.log("Fetching from:", fromStr);
  const smoobuRes = await fetch(`https://login.smoobu.com/api/reservations?from=${fromStr}`, {
    headers: {
      'Api-Key': smoobuKey,
      'Cache-Control': 'no-cache'
    }
  });

  const data = await smoobuRes.json();
  const activeBookings = (data.bookings || []).filter(b => b.type !== 'cancellation');
  console.log(`Found ${activeBookings.length} active bookings in Smoobu (ignoring cancellations).`);
  
  if (activeBookings.length > 0) {
    console.log("Example booking structure:");
    console.log(JSON.stringify(activeBookings[0], null, 2));
  }
}

testSmoobuGet();