const apiKey = 'rqxbLMS0UqXTBIthOrT6lql9mxM4GGvO6OzmTRSWbb';

async function testSmoobu() {
  const smoobuPayload = {
    arrivalDate: '2026-05-10',
    departureDate: '2026-05-12',
    apartmentId: 3252267,
    firstName: 'Test',
    lastName: 'StringPrice',
    email: 'test@example.com',
    price: "1000.00",
    notice: 'Rezerwacja testowa string price'
  };

  const smoobuRes = await fetch('https://login.smoobu.com/api/reservations', {
    method: 'POST',
    headers: {
      'Api-Key': apiKey,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify(smoobuPayload)
  });

  if (!smoobuRes.ok) {
    const errText = await smoobuRes.text();
    console.error('Error:', smoobuRes.status, errText);
  } else {
    console.log('Success:', await smoobuRes.json());
  }
}

testSmoobu();