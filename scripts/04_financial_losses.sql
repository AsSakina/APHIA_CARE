-- APHIA V0 - Script 04: Financial Losses Table

CREATE TABLE IF NOT EXISTS financial_losses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  stock_movement_id UUID REFERENCES stock_movements(id),
  adjustment_reason adjustment_reason NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_cost DECIMAL(15,2) NOT NULL CHECK (unit_cost >= 0),
  total_loss DECIMAL(15,2) GENERATED ALWAYS AS (quantity * unit_cost) STORED,
  loss_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by UUID,
  updated_by UUID
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_financial_losses_product ON financial_losses(product_id);
CREATE INDEX IF NOT EXISTS idx_financial_losses_reason ON financial_losses(adjustment_reason);
CREATE INDEX IF NOT EXISTS idx_financial_losses_date ON financial_losses(loss_date);
