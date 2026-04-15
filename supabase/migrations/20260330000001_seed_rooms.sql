-- Insert initial data into rooms table
INSERT INTO rooms (id, name, description, capacity, base_price, amenities, images) VALUES
(
  '11111111-1111-1111-1111-111111111111', 
  'Pokój Dwuosobowy z Balkonem', 
  'Jasny, przestronny pokój z widokiem na Giewont. Idealny dla par szukających relaksu. Luksusowy wystrój i naturalne materiały tworzą idealną przestrzeń do odpoczynku po dniu na szlaku.', 
  2, 
  250.00, 
  '["wifi", "tv", "balcony"]'::jsonb, 
  ARRAY['https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800']
),
(
  '22222222-2222-2222-2222-222222222222', 
  'Apartament Rodzinny', 
  'Dwie oddzielne sypialnie i aneks kuchenny. Doskonały wybór dla rodzin z dziećmi. Przestrzeń, w której każdy znajdzie miejsce dla siebie, połączona wspólną częścią dzienną.', 
  4, 
  450.00, 
  '["wifi", "tv", "kitchen", "balcony"]'::jsonb, 
  ARRAY['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800']
),
(
  '33333333-3333-3333-3333-333333333333', 
  'Pokój Deluxe z Sauną', 
  'Luksusowe wykończenie i prywatna sauna na podczerwień. Najwyższy poziom relaksu. Idealny na romantyczny weekend we dwoje w samym sercu Tatr.', 
  2, 
  350.00, 
  '["wifi", "tv", "sauna", "coffee"]'::jsonb, 
  ARRAY['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800']
),
(
  '44444444-4444-4444-4444-444444444444', 
  'Pokój Jednoosobowy Standard', 
  'Przytulny pokój dla osoby podróżującej w pojedynkę. Wygodne łóżko, biurko do pracy i wszystkie niezbędne udogodnienia.', 
  1, 
  180.00, 
  '["wifi", "tv"]'::jsonb, 
  ARRAY['https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&q=80&w=800']
)
ON CONFLICT (id) DO NOTHING;