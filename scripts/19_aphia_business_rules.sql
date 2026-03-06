-- APHIA Business Rules Migration
-- This script updates the database to match APHIA pharmacy business logic

-- =====================================================
-- 1. UPDATE LOSS REASONS (adjustment_reason enum)
-- =====================================================

-- Add new adjustment reason values
ALTER TYPE adjustment_reason ADD VALUE IF NOT EXISTS 'VOL_PERDU' AFTER 'THEFT';
ALTER TYPE adjustment_reason ADD VALUE IF NOT EXISTS 'DON' AFTER 'VOL_PERDU';

-- Note: Cannot remove enum values in PostgreSQL, but we will filter them in the UI

-- =====================================================
-- 2. ADD CREDIT FIELDS TO PATIENTS
-- =====================================================

-- Add credit authorization for patients (only authorized patients can receive credit)
ALTER TABLE patients ADD COLUMN IF NOT EXISTS can_receive_credit BOOLEAN DEFAULT false;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS credit_limit NUMERIC(12,2) DEFAULT 0;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS current_credit_balance NUMERIC(12,2) DEFAULT 0;

-- =====================================================
-- 3. ADD DISCOUNT FIELDS TO IPM_PATIENTS (per-patient percentage)
-- =====================================================

-- coverage_rate already exists on ipm_patients table for per-patient override

-- =====================================================
-- 4. ADD CLIENT_COMPTANT DEFAULT CLIENT TYPE
-- =====================================================

-- Create a view for default client type
CREATE OR REPLACE VIEW v_default_client AS
SELECT 'COMPTANT' AS client_type, 'Client Comptant' AS display_name;

-- =====================================================
-- 5. UPDATE CART DISCOUNT FIELDS
-- =====================================================

-- Ensure discount can be percentage OR fixed amount
ALTER TABLE carts ADD COLUMN IF NOT EXISTS discount_type VARCHAR(20) DEFAULT 'FIXED' CHECK (discount_type IN ('FIXED', 'PERCENTAGE'));

-- Same for sales
ALTER TABLE sales ADD COLUMN IF NOT EXISTS discount_type VARCHAR(20) DEFAULT 'FIXED' CHECK (discount_type IN ('FIXED', 'PERCENTAGE'));
ALTER TABLE sales ADD COLUMN IF NOT EXISTS discount_percentage NUMERIC(5,2) DEFAULT 0;

-- =====================================================
-- 6. ADD INVOICE GENERATION TRACKING
-- =====================================================

-- invoice_id already exists on sales table

-- =====================================================
-- 7. CREATE IPM RECEIVABLES VIEW WITH FILTERS
-- =====================================================

CREATE OR REPLACE VIEW v_ipm_receivables AS
SELECT 
  sfr.id,
  sfr.sale_number,
  sfr.sale_date,
  sfr.sale_type,
  sfr.patient_id,
  p.first_name || ' ' || p.last_name AS patient_name,
  sfr.ipm_id,
  i.name AS ipm_name,
  i.code AS ipm_code,
  ip.membership_number AS patient_ipm_code,
  sfr.total_amount,
  sfr.ipm_coverage_amount,
  sfr.amount_paid AS patient_paid,
  sfr.ipm_coverage_amount - COALESCE(
    (SELECT SUM(rp.amount) FROM receivable_payments rp WHERE rp.sale_id = sfr.id AND rp.ipm_claim_id IS NOT NULL), 0
  ) AS ipm_outstanding,
  sfr.pharmacy_id
FROM sales_financial_records sfr
LEFT JOIN patients p ON sfr.patient_id = p.id
LEFT JOIN ipms i ON sfr.ipm_id = i.id
LEFT JOIN ipm_patients ip ON ip.patient_id = sfr.patient_id AND ip.ipm_id = sfr.ipm_id
WHERE sfr.sale_type = 'MUTUELLE_IPM'
  AND sfr.ipm_coverage_amount > 0
  AND sfr.deleted_at IS NULL;

-- =====================================================
-- 8. CREATE SALES HISTORY VIEW WITH IPM FILTER
-- =====================================================

CREATE OR REPLACE VIEW v_sales_history AS
SELECT 
  s.id,
  s.sale_number,
  s.sale_date,
  s.client_type,
  s.patient_id,
  p.first_name || ' ' || p.last_name AS patient_name,
  s.ipm_id,
  i.name AS ipm_name,
  s.subtotal,
  s.discount_amount,
  s.discount_type,
  s.discount_percentage,
  s.tolerance_amount,
  s.total_amount,
  s.ipm_coverage_amount,
  s.patient_amount,
  s.amount_paid,
  s.payment_method,
  s.is_proforma,
  s.created_at,
  s.pharmacy_id,
  CASE WHEN s.ipm_id IS NOT NULL THEN true ELSE false END AS is_ipm_sale
FROM sales s
LEFT JOIN patients p ON s.patient_id = p.id
LEFT JOIN ipms i ON s.ipm_id = i.id
WHERE s.is_proforma = false;

-- =====================================================
-- 9. SIMPLIFIED ACCOUNTING VIEW (CA, Ventes, Dépenses, Soldes)
-- =====================================================

CREATE OR REPLACE VIEW v_simplified_accounting AS
SELECT 
  DATE_TRUNC('month', d.date) AS period,
  -- Chiffre d'Affaires (CA) = Total des ventes brutes
  COALESCE((
    SELECT SUM(total_amount) 
    FROM sales 
    WHERE DATE_TRUNC('month', sale_date) = DATE_TRUNC('month', d.date)
      AND is_proforma = false
  ), 0) AS chiffre_affaires,
  -- Ventes encaissées = montant réellement reçu
  COALESCE((
    SELECT SUM(amount_paid) 
    FROM sales 
    WHERE DATE_TRUNC('month', sale_date) = DATE_TRUNC('month', d.date)
      AND is_proforma = false
  ), 0) AS ventes_encaissees,
  -- Dépenses = total des dépenses validées
  COALESCE((
    SELECT SUM(amount) 
    FROM expenses 
    WHERE DATE_TRUNC('month', expense_date) = DATE_TRUNC('month', d.date)
      AND status IN ('VALIDATED', 'PAID')
  ), 0) AS depenses,
  -- IPM à recevoir
  COALESCE((
    SELECT SUM(ipm_coverage_amount - amount_paid + patient_amount) 
    FROM sales 
    WHERE DATE_TRUNC('month', sale_date) = DATE_TRUNC('month', d.date)
      AND ipm_id IS NOT NULL
      AND is_proforma = false
  ), 0) AS ipm_a_recevoir,
  -- Crédits patients à recevoir
  COALESCE((
    SELECT SUM(patient_amount - amount_paid) 
    FROM sales 
    WHERE DATE_TRUNC('month', sale_date) = DATE_TRUNC('month', d.date)
      AND client_type = 'CLIENT_CREDIT'
      AND is_proforma = false
  ), 0) AS credits_a_recevoir
FROM (
  SELECT generate_series(
    DATE_TRUNC('month', CURRENT_DATE - INTERVAL '11 months'),
    DATE_TRUNC('month', CURRENT_DATE),
    '1 month'
  ) AS date
) d
ORDER BY period DESC;

-- =====================================================
-- 10. STOCK QUANTITY VIEW (per product)
-- =====================================================

CREATE OR REPLACE VIEW v_stock_quantities AS
SELECT 
  p.id AS product_id,
  p.code AS product_code,
  p.name AS product_name,
  p.category,
  p.unit_price,
  p.purchase_price,
  p.pharmacy_id,
  COALESCE(SUM(sm.quantity), 0) AS current_stock,
  COALESCE(SUM(CASE WHEN sm.quantity > 0 THEN sm.quantity ELSE 0 END), 0) AS total_in,
  COALESCE(SUM(CASE WHEN sm.quantity < 0 THEN ABS(sm.quantity) ELSE 0 END), 0) AS total_out
FROM products p
LEFT JOIN stock_movements sm ON p.id = sm.product_id
WHERE p.is_active = true AND p.deleted_at IS NULL
GROUP BY p.id, p.code, p.name, p.category, p.unit_price, p.purchase_price, p.pharmacy_id;

-- =====================================================
-- 11. IPM PATIENT SEARCH FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION search_ipm_patients(
  p_pharmacy_id UUID,
  p_search_code VARCHAR DEFAULT NULL,
  p_ipm_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  patient_id UUID,
  patient_name TEXT,
  membership_number VARCHAR,
  ipm_id UUID,
  ipm_name VARCHAR,
  coverage_rate NUMERIC,
  effective_rate NUMERIC,
  is_active BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ip.id,
    ip.patient_id,
    p.first_name || ' ' || p.last_name AS patient_name,
    ip.membership_number,
    ip.ipm_id,
    i.name AS ipm_name,
    ip.coverage_rate,
    COALESCE(ip.coverage_rate, i.coverage_rate) AS effective_rate,
    ip.is_active
  FROM ipm_patients ip
  JOIN patients p ON ip.patient_id = p.id
  JOIN ipms i ON ip.ipm_id = i.id
  WHERE ip.pharmacy_id = p_pharmacy_id
    AND ip.is_active = true
    AND ip.deleted_at IS NULL
    AND (p_search_code IS NULL OR ip.membership_number ILIKE '%' || p_search_code || '%')
    AND (p_ipm_id IS NULL OR ip.ipm_id = p_ipm_id)
  ORDER BY p.last_name, p.first_name;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 12. GRANT CREDIT TO PATIENT FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION grant_patient_credit(
  p_patient_id UUID,
  p_credit_limit NUMERIC,
  p_pharmacy_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE patients
  SET 
    can_receive_credit = true,
    credit_limit = p_credit_limit,
    updated_at = NOW()
  WHERE id = p_patient_id
    AND pharmacy_id = p_pharmacy_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 13. REVOKE CREDIT FROM PATIENT FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION revoke_patient_credit(
  p_patient_id UUID,
  p_pharmacy_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE patients
  SET 
    can_receive_credit = false,
    credit_limit = 0,
    updated_at = NOW()
  WHERE id = p_patient_id
    AND pharmacy_id = p_pharmacy_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
