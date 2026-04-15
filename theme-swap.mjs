import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

// Zastępujemy wszystkie odwołania do kolorów w komponentach React (.tsx, .ts, .css)
const files = globSync('src/**/*.{tsx,ts,css}');
console.log(`Znaleziono ${files.length} plików do transformacji stylów.`);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let originalContent = content;
  
  // ===============================
  // 1. GŁÓWNE ZMIANY TŁA (Usuwanie czarnego)
  // ===============================
  content = content.replace(/\bbg-black\b/g, 'bg-white');
  content = content.replace(/\bbg-black\/[0-9]+\b/g, 'bg-white'); // np. bg-black/50, bg-black/40
  content = content.replace(/\btext-white\b/g, 'text-gray-800');
  content = content.replace(/\btext-white\/[0-9]+\b/g, 'text-gray-500'); // np text-white/70
  
  content = content.replace(/\bbg-gray-900\b/g, 'bg-white');
  content = content.replace(/\bbg-gray-800\b/g, 'bg-gray-50');
  content = content.replace(/\btext-gray-400\b/g, 'text-gray-600');
  content = content.replace(/\btext-gray-300\b/g, 'text-gray-700');
  
  // ===============================
  // 2. KRAWĘDZIE I LINIE (Z czarnych/białych na jasne/zielone)
  // ===============================
  content = content.replace(/\bborder-white\/[0-9]+\b/g, 'border-gray-200');
  content = content.replace(/\bborder-white\b/g, 'border-gray-300');
  
  // ===============================
  // 3. ZMIANA "ZŁOTA" (#D4AF37) NA NOWĄ ZIELEŃ (#2d6a4f)
  // ===============================
  content = content.replace(/#D4AF37/g, '#2d6a4f');
  content = content.replace(/rgba\(212, 175, 55/g, 'rgba(45, 106, 79');
  
  // ===============================
  // 4. SPECJALNE POPRAWKI (Przyciski / Kalendarze / Formularze)
  // ===============================
  // Jeżeli mamy przycisk z klasą bg-gold (czyli teraz ciemnozielony), to tekst musi być biały, a nie szary.
  // Podmieniamy hover:text-black na hover:text-white na przyciskach.
  content = content.replace(/\bhover:text-black\b/g, 'hover:text-white');
  // W kalendarzach (RoomDetails, itd.) 'color: black !important' zamieniamy na biały tekst
  content = content.replace(/color: black !important/g, 'color: white !important');
  // Zmiana hoverów dla menu
  content = content.replace(/hover:bg-white\/10/g, 'hover:bg-green-50');
  content = content.replace(/hover:bg-white\/5/g, 'hover:bg-gray-50');
  content = content.replace(/\bbg-white\/5\b/g, 'bg-white');
  
  // Jeśli przycisk ma tekst text-gray-800 ale tło bg-gold, podmieniamy na text-white
  // Używamy prostego tricku - w klasach z bg-gold dodajemy text-white obok
  content = content.replace(/bg-gold text-gray-800/g, 'bg-gold text-white');
  
  // Upewnijmy się, że inputy w jasnym motywie mają czarny tekst i jasne tło
  if (file.includes('Booking.tsx') || file.includes('StripePaymentForm.tsx')) {
     content = content.replace(/bg-white border border-gray-200 text-gray-800/g, 'bg-white border border-gray-300 text-gray-900');
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`[Zaktualizowano] ${file}`);
  }
});
console.log("Transformacja motywu zakończona!");