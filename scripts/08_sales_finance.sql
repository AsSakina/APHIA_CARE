-- APHIA V0 - Script 08: Sales Financial Records

-- Sales financial records (light version - no full workflow)
CREATE TABLE IF NOT EXISTS sales_financial_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_number VARCHAR(100) NOT NULL UNIQUE,
  sale_date DATE NOT NULL,
  sale_type sale_type NOT NULL,
  patient_id UUID REFERENCES patients(id),
  ipm_id UUID REFERENCES ipms(id),
  ipm_claim_id UUID REFERENCES ipm_claims(id),
  total_amount DECIMAL(15,2) NOT NULL CHECK (total_amount >= 0),
  discount_amount DECIMAL(15,2) DEFAULT 0 CHECK (discount_amount >= 0),
  tolerance_amount DECIMAL(15,2) DEFAULT 0 CHECK (tolerance_amount >= 0),
  ipm_coverage_amount DECIMAL(15,2) DEFAULT 0 CHECK (ipm_coverage_amount >= 0),
  patient_amount DECIMAL(15,2) DEFAULT 0 CHECK (patient_amount >= 0),
  amount_paid DECIMAL(15,2) DEFAULT 0 CHECK (amount_paid >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by UUID,
  updated_by UUID,
  CONSTRAINT chk_proforma_zero CHECK (
    sale_type != 'PROFORMA' OR amount_paid = 0
  ),
  CONSTRAINT chk_ipm_has_ipm_id CHECK (
    sale_type != 'MUTUELLE_IPM' OR ipm_id IS NOT NULL
  )
);

-- Receivable payments (from IPMs or credit patients)
CREATE TABLE IF NOT EXISTS receivable_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_method payment_method NOT NULL,
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  payment_date DATE NOT NULL,
  reference VARCHAR(100),
  ipm_claim_id UUID REFERENCES ipm_claims(id),
  sale_id UUID REFERENCES sales_financial_records(id),
  patient_id UUID REFERENCES patients(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by UUID,
  updated_by UUID,
  CONSTRAINT chk_receivable_source CHECK (
    (ipm_claim_id IS NOT NULL AND sale_id IS NULL AND patient_id IS NULL) OR
    (ipm_claim_id IS NULL AND sale_id IS NOT NULL) OR
    (ipm_claim_id IS NULL AND sale_id IS NULL AND patient_id IS NOT NULL)
  )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sales_records_date ON sales_financial_records(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_records_type ON sales_financial_records(sale_type);
CREATE INDEX IF NOT EXISTS idx_sales_records_patient ON sales_financial_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_sales_records_ipm ON sales_financial_records(ipm_id);
CREATE INDEX IF NOT EXISTS idx_receivable_payments_date ON receivable_payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_receivable_payments_claim ON receivable_payments(ipm_claim_id);
