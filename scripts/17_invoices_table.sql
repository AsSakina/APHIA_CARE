-- Script 17: Invoices table for storing generated invoices
-- This table stores PDF invoices linked to sales

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES sales(id),
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  invoice_url TEXT NOT NULL,
  invoice_type VARCHAR(20) NOT NULL DEFAULT 'FACTURE', -- FACTURE, PROFORMA
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  generated_by UUID REFERENCES users(id),
  
  -- Metadata
  file_size INTEGER,
  file_name VARCHAR(255),
  
  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT valid_invoice_type CHECK (invoice_type IN ('FACTURE', 'PROFORMA'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_invoices_sale_id ON invoices(sale_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_generated_at ON invoices(generated_at DESC);

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number(is_proforma BOOLEAN DEFAULT FALSE)
RETURNS VARCHAR AS $$
DECLARE
  prefix VARCHAR(3);
  today_str VARCHAR(8);
  seq_num INTEGER;
  inv_number VARCHAR(50);
BEGIN
  prefix := CASE WHEN is_proforma THEN 'PRO' ELSE 'FAC' END;
  today_str := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');
  
  SELECT COALESCE(MAX(
    CAST(SPLIT_PART(invoice_number, '-', 3) AS INTEGER)
  ), 0) + 1
  INTO seq_num
  FROM invoices
  WHERE invoice_number LIKE prefix || '-' || today_str || '-%';
  
  inv_number := prefix || '-' || today_str || '-' || LPAD(seq_num::TEXT, 4, '0');
  
  RETURN inv_number;
END;
$$ LANGUAGE plpgsql;

-- Add invoice_id to sales table if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sales' AND column_name = 'invoice_id'
  ) THEN
    ALTER TABLE sales ADD COLUMN invoice_id UUID REFERENCES invoices(id);
  END IF;
END $$;

COMMENT ON TABLE invoices IS 'Stores generated invoice PDFs linked to sales';
