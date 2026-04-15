const apiKey = 'rqxbLMS0UqXTBIthOrT6lql9mxM4GGvO6OzmTRSWbb';

async function testSmoobuGet() {
  const smoobuRes = await fetch('https://login.smoobu.com/api/reservations?from=2026-05-01&apartmentId=3252267', {
    method: 'GET',
    headers: {
      'Api-Key': apiKey,
      'Cache-Control': 'no-cache'
    }
  });

  const data = await smoobuRes.json();
  const res = data.bookings.find(b => b.id === 134287442);
  console.log(res);
}

testSmoobuGet();