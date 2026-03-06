-- APHIA V0 - Script 03: Expenses and Payments Tables

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_type expense_type NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  expense_date DATE NOT NULL,
  status expense_status DEFAULT 'DRAFT',
  expense_category_id UUID,
  notes TEXT,
  validated_at TIMESTAMPTZ,
  validated_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by UUID,
  updated_by UUID,
  CONSTRAINT chk_validation_complete CHECK (
    (validated_by IS NULL AND validated_at IS NULL) OR
    (validated_by IS NOT NULL AND validated_at IS NOT NULL)
  )
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_method payment_method NOT NULL,
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  payment_date DATE NOT NULL,
  reference VARCHAR(100),
  expense_id UUID REFERENCES expenses(id),
  supplier_document_id UUID REFERENCES supplier_documents(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by UUID,
  updated_by UUID,
  CONSTRAINT chk_single_target CHECK (
    (expense_id IS NOT NULL AND supplier_document_id IS NULL) OR
    (expense_id IS NULL AND supplier_document_id IS NOT NULL) OR
    (expense_id IS NULL AND supplier_document_id IS NULL)
  )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_expenses_type ON expenses(expense_type);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_payments_expense ON payments(expense_id);
CREATE INDEX IF NOT EXISTS idx_payments_supplier_doc ON payments(supplier_document_id);
