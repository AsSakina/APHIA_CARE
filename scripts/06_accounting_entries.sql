-- APHIA V0 - Script 06: Simplified Accounting Entries

CREATE TABLE IF NOT EXISTS accounting_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date DATE NOT NULL,
  entry_type accounting_entry_type NOT NULL,
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  category_id UUID REFERENCES expense_account_categories(id),
  reference_type VARCHAR(50) NOT NULL,
  reference_id UUID NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_accounting_entries_date ON accounting_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_accounting_entries_type ON accounting_entries(entry_type);
CREATE INDEX IF NOT EXISTS idx_accounting_entries_category ON accounting_entries(category_id);
CREATE INDEX IF NOT EXISTS idx_accounting_entries_reference ON accounting_entries(reference_type, reference_id);

-- Prevent UPDATE on accounting_entries (immutability)
CREATE OR REPLACE FUNCTION prevent_accounting_update()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Accounting entries are immutable and cannot be updated';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_accounting_update ON accounting_entries;
CREATE TRIGGER trg_prevent_accounting_update
BEFORE UPDATE ON accounting_entries
FOR EACH ROW
EXECUTE FUNCTION prevent_accounting_update();

-- Prevent DELETE on accounting_entries
CREATE OR REPLACE FUNCTION prevent_accounting_delete()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Accounting entries are immutable and cannot be deleted';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_accounting_delete ON accounting_entries;
CREATE TRIGGER trg_prevent_accounting_delete
BEFORE DELETE ON accounting_entries
FOR EACH ROW
EXECUTE FUNCTION prevent_accounting_delete();
