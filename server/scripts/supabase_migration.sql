-- SAAF Smart City OS: Supabase Schema Migration

-- 1. Facilities Table
CREATE TABLE IF NOT EXISTS facilities (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  address TEXT,
  type TEXT,
  total_stalls INTEGER NOT NULL DEFAULT 0,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  rating REAL DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'OPEN',
  hours TEXT,
  ward_number TEXT,
  zone TEXT,
  owning_agency TEXT,
  contractor_name TEXT,
  contract_type TEXT,
  compliance_score REAL DEFAULT 100,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. App Users (Admins/Inspectors)
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'inspector')) DEFAULT 'admin',
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Cleaners Table
CREATE TABLE IF NOT EXISTS cleaners (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  cleaner_id TEXT UNIQUE NOT NULL,
  pin_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'cleaner',
  assigned_zone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Stall Status (Real-time)
CREATE TABLE IF NOT EXISTS stall_status (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  facility_id BIGINT REFERENCES facilities(id) ON DELETE CASCADE,
  stall_number INTEGER NOT NULL,
  is_occupied BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Sensor Readings
CREATE TABLE IF NOT EXISTS sensor_readings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  facility_id BIGINT REFERENCES facilities(id) ON DELETE CASCADE,
  ammonia_level REAL,
  humidity REAL,
  floor_wet BOOLEAN DEFAULT FALSE,
  flush_count INTEGER DEFAULT 0,
  tissue_level REAL,
  soap_level REAL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Cleanliness Status (History)
CREATE TABLE IF NOT EXISTS cleanliness_status (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  facility_id BIGINT REFERENCES facilities(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('GREEN', 'AMBER', 'RED')),
  reason TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Maintenance Tasks
CREATE TABLE IF NOT EXISTS maintenance_tasks (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  facility_id BIGINT REFERENCES facilities(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED')) DEFAULT 'PENDING',
  priority TEXT CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) DEFAULT 'MEDIUM',
  issue_reason TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  assigned_to TEXT,
  cost_estimate REAL,
  verification_photo TEXT,
  location_coords TEXT
);

-- 8. Budget Logs
CREATE TABLE IF NOT EXISTS budget_log (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  task_id BIGINT REFERENCES maintenance_tasks(id) ON DELETE SET NULL,
  facility_id BIGINT REFERENCES facilities(id) ON DELETE CASCADE,
  amount REAL NOT NULL,
  category TEXT, -- 'cleaning', 'repair', 'supplies'
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Crowd Queue
CREATE TABLE IF NOT EXISTS crowd_queue (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  facility_id BIGINT REFERENCES facilities(id) ON DELETE CASCADE,
  current_users INTEGER DEFAULT 0,
  wait_time_mins REAL DEFAULT 0,
  pressure_level TEXT DEFAULT 'LOW',
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 10. User Feedback
CREATE TABLE IF NOT EXISTS user_feedback (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  facility_id BIGINT REFERENCES facilities(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  issue_type TEXT,
  comment TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  photo_url TEXT,
  source TEXT DEFAULT 'citizen',
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Inspection Reports
CREATE TABLE IF NOT EXISTS inspection_reports (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  facility_id BIGINT REFERENCES facilities(id) ON DELETE CASCADE,
  inspector_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  score REAL,
  checklist_json JSONB,
  notes TEXT,
  status TEXT DEFAULT 'COMPLETED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Predicted Rush
CREATE TABLE IF NOT EXISTS predicted_rush (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  facility_id BIGINT REFERENCES facilities(id) ON DELETE CASCADE,
  predicted_at TIMESTAMPTZ DEFAULT NOW(),
  surge_in_mins REAL,
  confidence_pct REAL,
  source TEXT
);

-- Enable Realtime for key tables
-- Note: You may need to enable the 'realtime' publication first in the Supabase Dashboard
-- ALTER PUBLICATION supabase_realtime ADD TABLE stall_status;
-- ALTER PUBLICATION supabase_realtime ADD TABLE sensor_readings;
-- ALTER PUBLICATION supabase_realtime ADD TABLE maintenance_tasks;
-- ALTER PUBLICATION supabase_realtime ADD TABLE cleanliness_status;
