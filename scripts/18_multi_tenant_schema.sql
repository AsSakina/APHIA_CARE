-- =====================================================
-- APHIA V0 - MULTI-TENANT SCHEMA MIGRATION
-- Script 18: Multi-Pharmacy Support
-- =====================================================
-- This migration transforms APHIA into a multi-tenant
-- system where each pharmacy has isolated data.
-- =====================================================

-- 1. Create pharmacies table
CREATE TABLE IF NOT EXISTS pharmacies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    logo_url TEXT,
    tax_id VARCHAR(100),
    license_number VARCHAR(100),
    
    -- Subscription & billing
    plan_type VARCHAR(50) DEFAULT 'free', -- free, starter, professional, enterprise
    plan_expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    
    -- Settings stored as JSONB for flexibility
    settings JSONB DEFAULT '{}',
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    
    CONSTRAINT pharmacies_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- 2. Add pharmacy_id to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS pharmacy_id UUID REFERENCES pharmacies(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS pharmacy_role VARCHAR(50) DEFAULT 'staff'; -- owner, admin, manager, pharmacist, staff

-- 3. Add pharmacy_id to all data tables
ALTER TABLE products ADD COLUMN IF NOT EXISTS pharmacy_id UUID REFERENCES pharmacies(id);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS pharmacy_id UUID REFERENCES pharmacies(id);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS pharmacy_id UUID REFERENCES pharmacies(id);
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS pharmacy_id UUID REFERENCES pharmacies(id);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS pharmacy_id UUID REFERENCES pharmacies(id);
ALTER TABLE financial_losses ADD COLUMN IF NOT EXISTS pharmacy_id UUID REFERENCES pharmacies(id);
ALTER TABLE expense_account_categories ADD COLUMN IF NOT EXISTS pharmacy_id UUID REFERENCES pharmacies(id);
ALTER TABLE accounting_entries ADD COLUMN IF NOT EXISTS pharmacy_id UUID REFERENCES pharmacies(id);
ALTER TABLE ipms ADD COLUMN IF NOT EXISTS pharmacy_id UUID REFERENCES pharmacies(id);
ALTER TABLE ipm_patients ADD COLUMN IF NOT EXISTS pharmacy_id UUID REFERENCES pharmacies(id);
ALTER TABLE ipm_claims ADD COLUMN IF NOT EXISTS pharmacy_id UUID REFERENCES pharmacies(id);
ALTER TABLE sales_financial_records ADD COLUMN IF NOT EXISTS pharmacy_id UUID REFERENCES pharmacies(id);
ALTER TABLE receivable_payments ADD COLUMN IF NOT EXISTS pharmacy_id UUID REFERENCES pharmacies(id);
ALTER TABLE carts ADD COLUMN IF NOT EXISTS pharmacy_id UUID REFERENCES pharmacies(id);
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS pharmacy_id UUID REFERENCES pharmacies(id);
ALTER TABLE sales ADD COLUMN IF NOT EXISTS pharmacy_id UUID REFERENCES pharmacies(id);
ALTER TABLE sale_items ADD COLUMN IF NOT EXISTS pharmacy_id UUID REFERENCES pharmacies(id);
ALTER TABLE supplier_documents ADD COLUMN IF NOT EXISTS pharmacy_id UUID REFERENCES pharmacies(id);
ALTER TABLE stock_movements ADD COLUMN IF NOT EXISTS pharmacy_id UUID REFERENCES pharmacies(id);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS pharmacy_id UUID REFERENCES pharmacies(id);

-- 4. Add coverage_rate to ipm_patients for per-patient variable rates
ALTER TABLE ipm_patients ADD COLUMN IF NOT EXISTS coverage_rate NUMERIC(5,2);
COMMENT ON COLUMN ipm_patients.coverage_rate IS 'Override IPM default rate for this specific patient. NULL means use IPM default.';

-- 5. Create indexes for pharmacy_id on all tables
CREATE INDEX IF NOT EXISTS idx_users_pharmacy ON users(pharmacy_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_pharmacy ON products(pharmacy_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_patients_pharmacy ON patients(pharmacy_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_suppliers_pharmacy ON suppliers(pharmacy_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_expenses_pharmacy ON expenses(pharmacy_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_payments_pharmacy ON payments(pharmacy_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_financial_losses_pharmacy ON financial_losses(pharmacy_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_ipms_pharmacy ON ipms(pharmacy_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_ipm_patients_pharmacy ON ipm_patients(pharmacy_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_ipm_claims_pharmacy ON ipm_claims(pharmacy_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_carts_pharmacy ON carts(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_sales_pharmacy ON sales(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_invoices_pharmacy ON invoices(pharmacy_id);

-- 6. Create a default pharmacy for migration
INSERT INTO pharmacies (id, name, code, plan_type, is_active)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Pharmacie APHIA Demo',
    'APHIA-DEMO',
    'professional',
    true
) ON CONFLICT DO NOTHING;

-- 7. Migrate existing data to default pharmacy
UPDATE users SET pharmacy_id = '00000000-0000-0000-0000-000000000001', pharmacy_role = 'owner' 
WHERE pharmacy_id IS NULL AND role = 'admin';
UPDATE users SET pharmacy_id = '00000000-0000-0000-0000-000000000001', pharmacy_role = 'staff' 
WHERE pharmacy_id IS NULL;
UPDATE products SET pharmacy_id = '00000000-0000-0000-0000-000000000001' WHERE pharmacy_id IS NULL;
UPDATE patients SET pharmacy_id = '00000000-0000-0000-0000-000000000001' WHERE pharmacy_id IS NULL;
UPDATE suppliers SET pharmacy_id = '00000000-0000-0000-0000-000000000001' WHERE pharmacy_id IS NULL;
UPDATE expenses SET pharmacy_id = '00000000-0000-0000-0000-000000000001' WHERE pharmacy_id IS NULL;
UPDATE payments SET pharmacy_id = '00000000-0000-0000-0000-000000000001' WHERE pharmacy_id IS NULL;
UPDATE financial_losses SET pharmacy_id = '00000000-0000-0000-0000-000000000001' WHERE pharmacy_id IS NULL;
UPDATE expense_account_categories SET pharmacy_id = '00000000-0000-0000-0000-000000000001' WHERE pharmacy_id IS NULL;
UPDATE accounting_entries SET pharmacy_id = '00000000-0000-0000-0000-000000000001' WHERE pharmacy_id IS NULL;
UPDATE ipms SET pharmacy_id = '00000000-0000-0000-0000-000000000001' WHERE pharmacy_id IS NULL;
UPDATE ipm_patients SET pharmacy_id = '00000000-0000-0000-0000-000000000001' WHERE pharmacy_id IS NULL;
UPDATE ipm_claims SET pharmacy_id = '00000000-0000-0000-0000-000000000001' WHERE pharmacy_id IS NULL;
UPDATE sales_financial_records SET pharmacy_id = '00000000-0000-0000-0000-000000000001' WHERE pharmacy_id IS NULL;
UPDATE receivable_payments SET pharmacy_id = '00000000-0000-0000-0000-000000000001' WHERE pharmacy_id IS NULL;
UPDATE carts SET pharmacy_id = '00000000-0000-0000-0000-000000000001' WHERE pharmacy_id IS NULL;
UPDATE cart_items SET pharmacy_id = '00000000-0000-0000-0000-000000000001' WHERE pharmacy_id IS NULL;
UPDATE sales SET pharmacy_id = '00000000-0000-0000-0000-000000000001' WHERE pharmacy_id IS NULL;
UPDATE sale_items SET pharmacy_id = '00000000-0000-0000-0000-000000000001' WHERE pharmacy_id IS NULL;
UPDATE supplier_documents SET pharmacy_id = '00000000-0000-0000-0000-000000000001' WHERE pharmacy_id IS NULL;
UPDATE stock_movements SET pharmacy_id = '00000000-0000-0000-0000-000000000001' WHERE pharmacy_id IS NULL;
UPDATE invoices SET pharmacy_id = '00000000-0000-0000-0000-000000000001' WHERE pharmacy_id IS NULL;

-- 8. Create view for pharmacy dashboard summary
CREATE OR REPLACE VIEW v_pharmacy_dashboard AS
SELECT 
    p.id AS pharmacy_id,
    p.name AS pharmacy_name,
    p.plan_type,
    p.is_active,
    COUNT(DISTINCT u.id) FILTER (WHERE u.deleted_at IS NULL) AS user_count,
    COUNT(DISTINCT pr.id) FILTER (WHERE pr.deleted_at IS NULL) AS product_count,
    COUNT(DISTINCT pt.id) FILTER (WHERE pt.deleted_at IS NULL) AS patient_count,
    COUNT(DISTINCT s.id) AS sales_this_month,
    COALESCE(SUM(s.total_amount) FILTER (WHERE s.sale_date >= date_trunc('month', CURRENT_DATE)), 0) AS revenue_this_month
FROM pharmacies p
LEFT JOIN users u ON u.pharmacy_id = p.id
LEFT JOIN products pr ON pr.pharmacy_id = p.id
LEFT JOIN patients pt ON pt.pharmacy_id = p.id
LEFT JOIN sales s ON s.pharmacy_id = p.id AND s.sale_date >= date_trunc('month', CURRENT_DATE)
WHERE p.deleted_at IS NULL
GROUP BY p.id, p.name, p.plan_type, p.is_active;

-- 9. Function to get effective coverage rate for an IPM patient
CREATE OR REPLACE FUNCTION get_effective_coverage_rate(p_ipm_patient_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    v_patient_rate NUMERIC;
    v_ipm_rate NUMERIC;
BEGIN
    SELECT ip.coverage_rate, i.coverage_rate
    INTO v_patient_rate, v_ipm_rate
    FROM ipm_patients ip
    JOIN ipms i ON ip.ipm_id = i.id
    WHERE ip.id = p_ipm_patient_id;
    
    -- Return patient-specific rate if set, otherwise use IPM default
    RETURN COALESCE(v_patient_rate, v_ipm_rate, 0);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_effective_coverage_rate IS 'Returns the effective coverage rate for an IPM patient, using patient override if set, otherwise IPM default.';
