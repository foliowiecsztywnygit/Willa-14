import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env.local') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

async function testMailgun() {
  try {
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY || "YOUR_MAILGUN_API_KEY"
    });
    
    const domain = process.env.MAILGUN_DOMAIN || "YOUR_MAILGUN_DOMAIN";
    const fromEmail = `Willa Rysy <postmaster@${domain}>`;
    
    // Test email (we should test what's used in the app, usually test@example.com or user's email)
    const guestEmail = "krzysztozebrowsky@gmail.com"; 

    const messageData = {
      from: fromEmail,
      to: [guestEmail],
      subject: "Test Mailgun Sandbox",
      text: "Testing Mailgun sandbox logic",
    };

    console.log(`Próba wysłania na: ${guestEmail} z domeny: ${domain}...`);
    const mgRes = await mg.messages.create(domain, messageData);
    console.log(`[Success] Wysłano maila na adres: ${guestEmail}. ID:`, mgRes.id);
    
  } catch (mailErr) {
    console.error("[Error] Błąd wysyłania maila (Mailgun):");
    console.error("Status:", mailErr.status);
    console.error("Message:", mailErr.message);
    console.error("Details:", mailErr.details);
  }
}

testMailgun();