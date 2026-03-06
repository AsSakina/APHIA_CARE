-- APHIA V0 - Script 07: IPM / Mutuelle Tables

-- IPM Organizations
CREATE TABLE IF NOT EXISTS ipms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE,
  contact_name VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  coverage_rate DECIMAL(5,2) DEFAULT 80.00 CHECK (coverage_rate >= 0 AND coverage_rate <= 100),
  payment_delay_days INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by UUID,
  updated_by UUID
);

-- IPM Patient membership
CREATE TABLE IF NOT EXISTS ipm_patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  ipm_id UUID NOT NULL REFERENCES ipms(id),
  membership_number VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(patient_id, ipm_id, membership_number)
);

-- IPM Claims (period-based)
CREATE TABLE IF NOT EXISTS ipm_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ipm_id UUID NOT NULL REFERENCES ipms(id),
  claim_number VARCHAR(100) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_amount DECIMAL(15,2) NOT NULL CHECK (total_amount > 0),
  amount_accepted DECIMAL(15,2) DEFAULT 0 CHECK (amount_accepted >= 0),
  amount_paid DECIMAL(15,2) DEFAULT 0 CHECK (amount_paid >= 0),
  status ipm_claim_status DEFAULT 'DRAFT',
  sent_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by UUID,
  updated_by UUID,
  CONSTRAINT chk_period_valid CHECK (period_end >= period_start),
  CONSTRAINT chk_accepted_lte_total CHECK (amount_accepted <= total_amount),
  CONSTRAINT chk_paid_lte_accepted CHECK (amount_paid <= amount_accepted)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ipms_code ON ipms(code);
CREATE INDEX IF NOT EXISTS idx_ipm_patients_patient ON ipm_patients(patient_id);
CREATE INDEX IF NOT EXISTS idx_ipm_patients_ipm ON ipm_patients(ipm_id);
CREATE INDEX IF NOT EXISTS idx_ipm_claims_ipm ON ipm_claims(ipm_id);
CREATE INDEX IF NOT EXISTS idx_ipm_claims_status ON ipm_claims(status);
CREATE INDEX IF NOT EXISTS idx_ipm_claims_period ON ipm_claims(period_start, period_end);
