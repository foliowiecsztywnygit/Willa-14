-- Dodanie kolumny ical_url do synchronizacji z Bookingiem
ALTER TABLE rooms ADD COLUMN ical_url TEXT;

-- Tabela dla logów synchronizacji
CREATE TABLE sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL,
  events_added INTEGER DEFAULT 0,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage sync_logs" ON sync_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
GRANT ALL PRIVILEGES ON sync_logs TO authenticated;
