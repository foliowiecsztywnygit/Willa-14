INSERT INTO rooms (id, name, description, base_price, capacity, amenities) 
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Pokój Standard z Widokiem', 'Jasny i przytulny pokój w Willi 14 Zakopane. Z okien roztacza się malowniczy widok na Tatry. Wyposażony w wygodne łóżko małżeńskie, prywatną łazienkę oraz bezpłatne Wi-Fi. Doskonały wybór na romantyczny weekend we dwoje.', 280.00, 2, '["wifi", "tv", "coffee"]'::jsonb),
  
  ('22222222-2222-2222-2222-222222222222', 'Rodzinne Studio z Balkonem', 'Przestronne studio o podwyższonym standardzie w Willi 14, stworzone z myślą o rodzinach z dziećmi. Posiada prywatny balkon z widokiem na góry, małą lodówkę i zestaw do parzenia kawy. Cicha i spokojna okolica sprzyja wypoczynkowi.', 450.00, 4, '["wifi", "tv", "balcony", "coffee"]'::jsonb),
  
  ('33333333-3333-3333-3333-333333333333', 'Apartament Salwatoriański Premium', 'Nowoczesny i elegancki apartament. Oferuje w pełni wyposażony aneks kuchenny, przestronną część wypoczynkową oraz designerską łazienkę. Zaledwie krótki spacer dzieli Cię od centrum Zakopanego i głównych atrakcji.', 550.00, 4, '["wifi", "tv", "balcony", "kitchen"]'::jsonb),
  
  ('44444444-4444-4444-4444-444444444444', 'Pokój Komfort z Aneksem', 'Funkcjonalny pokój dla dwóch osób. Wyposażony we własny aneks kuchenny, co daje pełną niezależność podczas górskich wakacji w Willi 14 Zakopane. Przytulne wnętrze gwarantuje świetny relaks po długich wędrówkach.', 220.00, 2, '["wifi", "tv", "kitchen"]'::jsonb),
  
  ('55555555-5555-5555-5555-555555555555', 'Apartament Góralski', 'Duży apartament łączący nowoczesność z tradycyjnymi góralskimi akcentami w drewnie. Posiada dwie oddzielne sypialnie i duży salon. Idealny dla grupy przyjaciół lub większej rodziny poszukującej przestrzeni i wygody.', 650.00, 6, '["wifi", "tv", "balcony", "kitchen", "coffee"]'::jsonb),
  
  ('66666666-6666-6666-6666-666666666666', 'Pokój Deluxe z Sauną', 'Wyjątkowy pokój dla par szukających luksusu i głębokiego relaksu. Znajdziesz tu prywatną mini-saunę oraz komfortowe, duże łoże małżeńskie. Idealne miejsce na odprężenie i niezapomniane chwile we dwoje w sercu Tatr.', 480.00, 2, '["wifi", "tv", "sauna", "coffee"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  base_price = EXCLUDED.base_price,
  capacity = EXCLUDED.capacity,
  amenities = EXCLUDED.amenities;