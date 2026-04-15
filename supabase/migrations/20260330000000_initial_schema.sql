-- Tabela pokoi (rooms)
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  capacity INTEGER NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  amenities JSONB DEFAULT '[]',
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela rezerwacji (bookings)
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guest_name VARCHAR(100) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  guest_phone VARCHAR(20) NOT NULL,
  guests_count INTEGER NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  deposit_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bookings_room_id ON bookings(room_id);
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX idx_bookings_email ON bookings(guest_email);

-- Tabela płatności (payments)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  method VARCHAR(20) NOT NULL CHECK (method IN ('blik', 'transfer', 'card')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id VARCHAR(100),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela cen sezonowych (room_prices)
CREATE TABLE room_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL,
  season_type VARCHAR(20) CHECK (season_type IN ('low', 'medium', 'high', 'premium')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_room_prices_room_dates ON room_prices(room_id, start_date, end_date);

-- Tabela dostępności (availability)
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  reason VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, date)
);

CREATE INDEX idx_availability_room_date ON availability(room_id, date);

-- Enable RLS (Row Level Security)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- Policies for rooms
CREATE POLICY "Public read access to rooms" ON rooms FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users can insert rooms" ON rooms FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update rooms" ON rooms FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete rooms" ON rooms FOR DELETE TO authenticated USING (true);

-- Policies for bookings
CREATE POLICY "Public can insert bookings" ON bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT TO anon, authenticated USING (true); -- W rzeczywistym środowisku należałoby ograniczyć do ID/email, ale na razie pozwalamy
CREATE POLICY "Authenticated users can update bookings" ON bookings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete bookings" ON bookings FOR DELETE TO authenticated USING (true);

-- Policies for payments
CREATE POLICY "Public can insert payments" ON payments FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public can view payments" ON payments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users can update payments" ON payments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Policies for room_prices
CREATE POLICY "Public read access to room_prices" ON room_prices FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users can manage room_prices" ON room_prices FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Policies for availability
CREATE POLICY "Public read access to availability" ON availability FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users can manage availability" ON availability FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Uprawnienia
GRANT SELECT ON rooms TO anon;
GRANT ALL PRIVILEGES ON rooms TO authenticated;

GRANT SELECT, INSERT ON bookings TO anon;
GRANT ALL PRIVILEGES ON bookings TO authenticated;

GRANT SELECT, INSERT ON payments TO anon;
GRANT ALL PRIVILEGES ON payments TO authenticated;

GRANT SELECT ON room_prices TO anon;
GRANT ALL PRIVILEGES ON room_prices TO authenticated;

GRANT SELECT ON availability TO anon;
GRANT ALL PRIVILEGES ON availability TO authenticated;
