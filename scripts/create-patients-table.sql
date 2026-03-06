-- Create Patients/Clients table for pharmacy account management
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  date_of_birth DATE,
  can_receive_credit BOOLEAN DEFAULT FALSE,
  credit_limit DECIMAL(10, 2) DEFAULT 0,
  current_credit_balance DECIMAL(10, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for quick lookup
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_can_receive_credit ON patients(can_receive_credit);

-- Enable RLS
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read patients
CREATE POLICY "Allow read patients" ON patients
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to create patients (pharmacists)
CREATE POLICY "Allow create patients" ON patients
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow update patients
CREATE POLICY "Allow update patients" ON patients
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Allow delete patients
CREATE POLICY "Allow delete patients" ON patients
  FOR DELETE
  USING (auth.role() = 'authenticated');
