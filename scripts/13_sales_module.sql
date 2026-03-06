-- =====================================================
-- APHIA V0 - SALES MODULE (CART-BASED WORKFLOW)
-- =====================================================

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS sale_items CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;

-- =====================================================
-- CART STATUS ENUM
-- =====================================================
DO $$ BEGIN
  CREATE TYPE cart_status AS ENUM ('ACTIVE', 'VALIDATED', 'CANCELLED', 'EXPIRED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- CLIENT TYPE ENUM (for cart context)
-- =====================================================
DO $$ BEGIN
  CREATE TYPE client_type AS ENUM (
    'COMPTANT',           -- Anonymous, immediate payment
    'IPM_MUTUELLE',       -- Linked to IPM, partial payment
    'CLIENT_COMPTE',      -- Registered patient with history
    'CLIENT_CREDIT',      -- Deferred payment
    'PROFORMA'            -- Quote only, no financial impact
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- CARTS TABLE (mutable until validated)
-- =====================================================
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_number VARCHAR(50) NOT NULL UNIQUE,
  
  -- Client information
  client_type client_type NOT NULL DEFAULT 'COMPTANT',
  patient_id UUID REFERENCES patients(id),
  ipm_id UUID REFERENCES ipms(id),
  ipm_patient_id UUID REFERENCES ipm_patients(id),
  
  -- Pricing
  subtotal NUMERIC(15,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
  discount_percentage NUMERIC(5,2) DEFAULT 0,
  total_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
  
  -- IPM coverage (calculated when IPM client)
  ipm_coverage_rate NUMERIC(5,2) DEFAULT 0,
  ipm_coverage_amount NUMERIC(15,2) DEFAULT 0,
  patient_amount NUMERIC(15,2) DEFAULT 0,
  
  -- Status
  status cart_status NOT NULL DEFAULT 'ACTIVE',
  notes TEXT,
  
  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  
  -- Constraints
  CONSTRAINT chk_cart_discount_positive CHECK (discount_amount >= 0),
  CONSTRAINT chk_cart_discount_percentage CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  CONSTRAINT chk_cart_ipm_requires_patient CHECK (
    (client_type != 'IPM_MUTUELLE') OR 
    (client_type = 'IPM_MUTUELLE' AND ipm_id IS NOT NULL)
  ),
  CONSTRAINT chk_cart_credit_requires_patient CHECK (
    (client_type != 'CLIENT_CREDIT' AND client_type != 'CLIENT_COMPTE') OR 
    (patient_id IS NOT NULL)
  )
);

-- =====================================================
-- CART ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  
  -- Quantity and pricing
  quantity INTEGER NOT NULL DEFAULT 1,
  is_unit_sale BOOLEAN NOT NULL DEFAULT FALSE, -- true = detail/sachet, false = full box
  unit_price NUMERIC(15,2) NOT NULL,
  line_total NUMERIC(15,2) NOT NULL,
  
  -- Optional lot tracking (FEFO)
  lot_number VARCHAR(100),
  expiry_date DATE,
  
  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT chk_cart_item_quantity_positive CHECK (quantity > 0),
  CONSTRAINT chk_cart_item_price_positive CHECK (unit_price >= 0),
  CONSTRAINT chk_cart_item_unique_product UNIQUE (cart_id, product_id, is_unit_sale)
);

-- =====================================================
-- SALES TABLE (immutable after creation)
-- =====================================================
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_number VARCHAR(50) NOT NULL UNIQUE,
  cart_id UUID REFERENCES carts(id),
  
  -- Client information (copied from cart for immutability)
  client_type client_type NOT NULL,
  patient_id UUID REFERENCES patients(id),
  ipm_id UUID REFERENCES ipms(id),
  
  -- Amounts
  subtotal NUMERIC(15,2) NOT NULL,
  discount_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
  tolerance_amount NUMERIC(15,2) NOT NULL DEFAULT 0, -- Rounding loss
  total_amount NUMERIC(15,2) NOT NULL,
  
  -- IPM breakdown
  ipm_coverage_amount NUMERIC(15,2) DEFAULT 0,
  patient_amount NUMERIC(15,2) NOT NULL,
  amount_paid NUMERIC(15,2) NOT NULL DEFAULT 0,
  
  -- Payment
  payment_method payment_method,
  payment_reference VARCHAR(100),
  
  -- Link to financial record
  financial_record_id UUID REFERENCES sales_financial_records(id),
  
  -- Status
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_proforma BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  
  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  
  -- Constraints
  CONSTRAINT chk_sale_amounts_positive CHECK (
    subtotal >= 0 AND 
    discount_amount >= 0 AND 
    tolerance_amount >= 0 AND 
    total_amount >= 0
  ),
  CONSTRAINT chk_proforma_no_payment CHECK (
    (is_proforma = FALSE) OR 
    (is_proforma = TRUE AND amount_paid = 0)
  )
);

-- =====================================================
-- SALE ITEMS TABLE (immutable)
-- =====================================================
CREATE TABLE IF NOT EXISTS sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE RESTRICT,
  product_id UUID NOT NULL REFERENCES products(id),
  
  -- Quantity and pricing (snapshot at time of sale)
  quantity INTEGER NOT NULL,
  is_unit_sale BOOLEAN NOT NULL DEFAULT FALSE,
  unit_price NUMERIC(15,2) NOT NULL,
  unit_cost NUMERIC(15,2) NOT NULL, -- For margin calculation
  line_total NUMERIC(15,2) NOT NULL,
  
  -- Lot tracking
  lot_number VARCHAR(100),
  expiry_date DATE,
  
  -- Link to stock movement
  stock_movement_id UUID REFERENCES stock_movements(id),
  
  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_carts_status ON carts(status);
CREATE INDEX IF NOT EXISTS idx_carts_client_type ON carts(client_type);
CREATE INDEX IF NOT EXISTS idx_carts_patient_id ON carts(patient_id);
CREATE INDEX IF NOT EXISTS idx_carts_created_at ON carts(created_at);
CREATE INDEX IF NOT EXISTS idx_carts_created_by ON carts(created_by);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

CREATE INDEX IF NOT EXISTS idx_sales_sale_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_client_type ON sales(client_type);
CREATE INDEX IF NOT EXISTS idx_sales_patient_id ON sales(patient_id);
CREATE INDEX IF NOT EXISTS idx_sales_ipm_id ON sales(ipm_id);
CREATE INDEX IF NOT EXISTS idx_sales_is_proforma ON sales(is_proforma);
CREATE INDEX IF NOT EXISTS idx_sales_created_by ON sales(created_by);

CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product_id ON sale_items(product_id);

-- =====================================================
-- FUNCTION: Generate cart number
-- =====================================================
CREATE OR REPLACE FUNCTION generate_cart_number()
RETURNS VARCHAR(50) AS $$
DECLARE
  new_number VARCHAR(50);
  today_str VARCHAR(8);
  seq_num INTEGER;
BEGIN
  today_str := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');
  
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(cart_number FROM 'C' || today_str || '-(\d+)') AS INTEGER)
  ), 0) + 1
  INTO seq_num
  FROM carts
  WHERE cart_number LIKE 'C' || today_str || '-%';
  
  new_number := 'C' || today_str || '-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Generate sale number
-- =====================================================
CREATE OR REPLACE FUNCTION generate_sale_number()
RETURNS VARCHAR(50) AS $$
DECLARE
  new_number VARCHAR(50);
  today_str VARCHAR(8);
  seq_num INTEGER;
BEGIN
  today_str := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');
  
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(sale_number FROM 'V' || today_str || '-(\d+)') AS INTEGER)
  ), 0) + 1
  INTO seq_num
  FROM sales
  WHERE sale_number LIKE 'V' || today_str || '-%';
  
  new_number := 'V' || today_str || '-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGER: Auto-calculate cart totals
-- =====================================================
CREATE OR REPLACE FUNCTION update_cart_totals()
RETURNS TRIGGER AS $$
DECLARE
  cart_subtotal NUMERIC(15,2);
  cart_record RECORD;
BEGIN
  -- Get the cart_id from the affected row
  IF TG_OP = 'DELETE' THEN
    SELECT SUM(line_total) INTO cart_subtotal FROM cart_items WHERE cart_id = OLD.cart_id;
    
    SELECT * INTO cart_record FROM carts WHERE id = OLD.cart_id;
  ELSE
    SELECT SUM(line_total) INTO cart_subtotal FROM cart_items WHERE cart_id = NEW.cart_id;
    
    SELECT * INTO cart_record FROM carts WHERE id = NEW.cart_id;
  END IF;
  
  cart_subtotal := COALESCE(cart_subtotal, 0);
  
  -- Update the cart with new totals
  UPDATE carts SET
    subtotal = cart_subtotal,
    total_amount = cart_subtotal - COALESCE(discount_amount, 0),
    ipm_coverage_amount = CASE 
      WHEN client_type = 'IPM_MUTUELLE' THEN 
        ROUND((cart_subtotal - COALESCE(discount_amount, 0)) * COALESCE(ipm_coverage_rate, 0) / 100, 2)
      ELSE 0 
    END,
    patient_amount = CASE
      WHEN client_type = 'IPM_MUTUELLE' THEN
        (cart_subtotal - COALESCE(discount_amount, 0)) - 
        ROUND((cart_subtotal - COALESCE(discount_amount, 0)) * COALESCE(ipm_coverage_rate, 0) / 100, 2)
      WHEN client_type = 'PROFORMA' THEN 0
      ELSE cart_subtotal - COALESCE(discount_amount, 0)
    END,
    updated_at = NOW()
  WHERE id = CASE WHEN TG_OP = 'DELETE' THEN OLD.cart_id ELSE NEW.cart_id END;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_cart_totals ON cart_items;
CREATE TRIGGER trg_update_cart_totals
AFTER INSERT OR UPDATE OR DELETE ON cart_items
FOR EACH ROW
EXECUTE FUNCTION update_cart_totals();

-- =====================================================
-- VIEW: Active carts with details
-- =====================================================
CREATE OR REPLACE VIEW v_active_carts AS
SELECT 
  c.id,
  c.cart_number,
  c.client_type,
  c.status,
  c.subtotal,
  c.discount_amount,
  c.total_amount,
  c.ipm_coverage_amount,
  c.patient_amount,
  c.created_at,
  c.updated_at,
  p.first_name || ' ' || p.last_name AS patient_name,
  i.name AS ipm_name,
  i.coverage_rate AS ipm_rate,
  u.first_name || ' ' || u.last_name AS created_by_name,
  COUNT(ci.id) AS item_count,
  SUM(ci.quantity) AS total_items
FROM carts c
LEFT JOIN patients p ON c.patient_id = p.id
LEFT JOIN ipms i ON c.ipm_id = i.id
LEFT JOIN users u ON c.created_by = u.id
LEFT JOIN cart_items ci ON c.id = ci.cart_id
WHERE c.status = 'ACTIVE'
GROUP BY c.id, p.first_name, p.last_name, i.name, i.coverage_rate, u.first_name, u.last_name;

-- =====================================================
-- VIEW: Sales summary by day
-- =====================================================
CREATE OR REPLACE VIEW v_sales_by_day AS
SELECT 
  sale_date,
  client_type,
  COUNT(*) AS sale_count,
  SUM(subtotal) AS gross_revenue,
  SUM(discount_amount) AS total_discounts,
  SUM(tolerance_amount) AS total_tolerance,
  SUM(total_amount) AS net_revenue,
  SUM(ipm_coverage_amount) AS ipm_portion,
  SUM(patient_amount) AS patient_portion,
  SUM(amount_paid) AS cash_collected,
  SUM(patient_amount - amount_paid) AS outstanding
FROM sales
WHERE is_proforma = FALSE
GROUP BY sale_date, client_type
ORDER BY sale_date DESC, client_type;

-- =====================================================
-- SEED: Demo products (if not exist)
-- =====================================================
INSERT INTO products (id, code, name, category, unit_price, purchase_price, is_active)
SELECT 
  gen_random_uuid(),
  code,
  name,
  category,
  unit_price,
  purchase_price,
  true
FROM (VALUES
  ('PARA001', 'Paracétamol 500mg', 'Analgésiques', 1500, 800),
  ('PARA002', 'Paracétamol 1000mg', 'Analgésiques', 2000, 1200),
  ('IBUP001', 'Ibuprofène 400mg', 'Anti-inflammatoires', 2500, 1500),
  ('AMOX001', 'Amoxicilline 500mg', 'Antibiotiques', 3500, 2000),
  ('AMOX002', 'Amoxicilline 1g', 'Antibiotiques', 5000, 3000),
  ('OMEP001', 'Oméprazole 20mg', 'Gastro-entérologie', 4000, 2500),
  ('LOPE001', 'Lopéramide 2mg', 'Gastro-entérologie', 1800, 1000),
  ('CETI001', 'Cétirizine 10mg', 'Antihistaminiques', 2200, 1300),
  ('DOLO001', 'Doliprane sirop enfant', 'Pédiatrie', 3000, 1800),
  ('VITA001', 'Vitamine C 1000mg', 'Vitamines', 2500, 1400),
  ('VITA002', 'Complexe Vitamine B', 'Vitamines', 4500, 2800),
  ('ASPI001', 'Aspirine 100mg', 'Cardiologie', 1200, 700),
  ('META001', 'Metformine 500mg', 'Diabétologie', 2800, 1600),
  ('ATOR001', 'Atorvastatine 10mg', 'Cardiologie', 6000, 3500),
  ('LOSI001', 'Losartan 50mg', 'Cardiologie', 4500, 2700)
) AS p(code, name, category, unit_price, purchase_price)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE code = p.code);
