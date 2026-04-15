import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env.local') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''; 
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateRooms() {
  console.log('Aktualizuję pokoje w bazie Supabase...');

  await supabase.from('rooms').update({
    name: 'Pokój 2-osobowy z widokiem na góry',
    description: 'Zlokalizowany w Willi Rysy w Zakopanem. Wygodny i przestronny pokój dwuosobowy o powierzchni 26m2, oferujący niesamowity widok na Tatry. W pełni wyposażony, prywatna łazienka, szafa oraz darmowe WiFi. Zapewnia doskonałe warunki do wypoczynku po dniu na szlaku.',
    base_price: 280.00,
    capacity: 2,
    amenities: ["wifi", "tv", "balcony", "coffee"],
    smoobu_id: 3252267 // Pozostawiam ID 3252267 dla jedynego apartamentu, który już masz w Smoobu
  }).eq('id', '11111111-1111-1111-1111-111111111111');

  await supabase.from('rooms').update({
    name: 'Pokój 4-osobowy z balkonem',
    description: 'Rodzinny pokój o powierzchni 36m2 w Willi Rysy. Wyposażony w prywatny balkon, czajnik, lodówkę i darmowe WiFi. Czysty, zadbany, w spokojnej okolicy, zaledwie kilkaset metrów od Aqua Parku i Krupówek.',
    base_price: 450.00,
    capacity: 4,
    amenities: ["wifi", "tv", "balcony", "coffee", "kitchen"],
    smoobu_id: 1000002 // Do zmiany przez użytkownika
  }).eq('id', '22222222-2222-2222-2222-222222222222');

  await supabase.from('rooms').update({
    name: 'Apartament Rysy Premium',
    description: 'Nowoczesny apartament z aneksem kuchennym i częścią wypoczynkową, zaledwie 5 minut od Krupówek. Idealny wybór na luksusowy i komfortowy urlop dla wymagających.',
    base_price: 550.00,
    capacity: 4,
    amenities: ["wifi", "tv", "balcony", "sauna"],
    smoobu_id: 1000003 // Do zmiany przez użytkownika
  }).eq('id', '33333333-3333-3333-3333-333333333333');

  await supabase.from('rooms').update({
    name: 'Pokój Standard z aneksem',
    description: 'Przytulny i funkcjonalny pokój dla dwóch osób. Wyposażony we wszystko, co potrzebne, by w pełni cieszyć się pobytem blisko serca Zakopanego.',
    base_price: 220.00,
    capacity: 2,
    amenities: ["wifi", "tv"],
    smoobu_id: 1000004 // Do zmiany przez użytkownika
  }).eq('id', '44444444-4444-4444-4444-444444444444');

  console.log('Zakończono aktualizację pokoi!');
}

updateRooms();