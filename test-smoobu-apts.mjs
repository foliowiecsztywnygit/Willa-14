import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env.local') });

const smoobuKey = process.env.SMOOBU_API_KEY || '';

async function testSmoobuApts() {
  const smoobuRes = await fetch(`https://login.smoobu.com/api/apartments`, {
    headers: {
      'Api-Key': smoobuKey,
      'Cache-Control': 'no-cache'
    }
  });

  const data = await smoobuRes.json();
  console.log(JSON.stringify(data, null, 2));
}

testSmoobuApts();