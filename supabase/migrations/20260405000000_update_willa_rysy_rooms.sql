-- Upsert (Insert or Update) existing rooms for Willa Rysy based on real data
INSERT INTO rooms (id, name, description, base_price, capacity, amenities) 
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Pokój 2-osobowy z widokiem na góry', 'Zlokalizowany w Willi Rysy w Zakopanem. Wygodny i przestronny pokój dwuosobowy o powierzchni 26m2, oferujący niesamowity widok na Tatry. W pełni wyposażony, prywatna łazienka, szafa oraz darmowe WiFi. Zapewnia doskonałe warunki do wypoczynku po dniu na szlaku.', 280.00, 2, '["wifi", "tv", "balcony", "coffee"]'::jsonb),
  ('22222222-2222-2222-2222-222222222222', 'Pokój 4-osobowy z balkonem', 'Rodzinny pokój o powierzchni 36m2 w Willi Rysy. Wyposażony w prywatny balkon, czajnik, lodówkę i darmowe WiFi. Czysty, zadbany, w spokojnej okolicy, zaledwie kilkaset metrów od Aqua Parku i Krupówek.', 450.00, 4, '["wifi", "tv", "balcony", "coffee", "kitchen"]'::jsonb),
  ('33333333-3333-3333-3333-333333333333', 'Apartament Rysy Premium', 'Nowoczesny apartament z aneksem kuchennym i częścią wypoczynkową, zaledwie 5 minut od Krupówek. Idealny wybór na luksusowy i komfortowy urlop dla wymagających.', 550.00, 4, '["wifi", "tv", "balcony", "sauna"]'::jsonb),
  ('44444444-4444-4444-4444-444444444444', 'Pokój Standard z aneksem', 'Przytulny i funkcjonalny pokój dla dwóch osób. Wyposażony we wszystko, co potrzebne, by w pełni cieszyć się pobytem blisko serca Zakopanego.', 220.00, 2, '["wifi", "tv"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  base_price = EXCLUDED.base_price,
  capacity = EXCLUDED.capacity,
  amenities = EXCLUDED.amenities;
