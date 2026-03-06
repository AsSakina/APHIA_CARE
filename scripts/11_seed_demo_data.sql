-- APHIA V0 - Script 11: Demo/Seed Data

-- Insert demo suppliers
INSERT INTO suppliers (id, name, phone, email, address) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Laborex Sénégal', '+221 33 859 00 00', 'contact@laborex.sn', 'Route de Rufisque, Dakar'),
  ('a0000000-0000-0000-0000-000000000002', 'Pharmivoire', '+221 33 849 50 00', 'info@pharmivoire.com', 'Zone Industrielle, Dakar'),
  ('a0000000-0000-0000-0000-000000000003', 'COPHASE', '+221 33 832 00 00', 'cophase@cophase.sn', 'Dakar')
ON CONFLICT DO NOTHING;

-- Insert demo products
INSERT INTO products (id, name, code, unit_price, purchase_price, category) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Paracétamol 500mg', 'PARA500', 1500, 800, 'Antalgiques'),
  ('b0000000-0000-0000-0000-000000000002', 'Amoxicilline 500mg', 'AMOX500', 3500, 2000, 'Antibiotiques'),
  ('b0000000-0000-0000-0000-000000000003', 'Ibuprofène 400mg', 'IBUP400', 2000, 1200, 'Anti-inflammatoires'),
  ('b0000000-0000-0000-0000-000000000004', 'Oméprazole 20mg', 'OMEP20', 4500, 2800, 'Gastro-entérologie'),
  ('b0000000-0000-0000-0000-000000000005', 'Metformine 500mg', 'METF500', 3000, 1800, 'Antidiabétiques')
ON CONFLICT DO NOTHING;

-- Insert demo patients
INSERT INTO patients (id, first_name, last_name, phone) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Amadou', 'Diallo', '+221 77 123 45 67'),
  ('c0000000-0000-0000-0000-000000000002', 'Fatou', 'Ndiaye', '+221 78 234 56 78'),
  ('c0000000-0000-0000-0000-000000000003', 'Moussa', 'Sow', '+221 76 345 67 89')
ON CONFLICT DO NOTHING;

-- Insert demo IPMs
INSERT INTO ipms (id, name, code, coverage_rate, payment_delay_days) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'IPM Sénégal', 'IPMS', 80.00, 30),
  ('d0000000-0000-0000-0000-000000000002', 'Mutuelle des Enseignants', 'MUTEN', 70.00, 45),
  ('d0000000-0000-0000-0000-000000000003', 'IPRESS', 'IPRESS', 80.00, 60)
ON CONFLICT DO NOTHING;

-- Insert demo supplier documents
INSERT INTO supplier_documents (supplier_id, document_type, document_number, document_date, total_amount, amount_paid) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'FACTURE', 'FAC-2024-001', '2024-12-01', 500000, 300000),
  ('a0000000-0000-0000-0000-000000000001', 'BL', 'BL-2024-015', '2024-12-15', 250000, 0),
  ('a0000000-0000-0000-0000-000000000002', 'FACTURE', 'FAC-2024-045', '2024-12-10', 750000, 750000)
ON CONFLICT DO NOTHING;

-- Insert demo expenses (different statuses)
INSERT INTO expenses (expense_type, description, amount, expense_date, status, expense_category_id) VALUES
  ('RENT', 'Loyer Décembre 2024', 350000, '2024-12-01', 'PAID', (SELECT id FROM expense_account_categories WHERE code = '6130')),
  ('ELECTRICITY', 'Facture SENELEC Décembre', 45000, '2024-12-15', 'VALIDATED', (SELECT id FROM expense_account_categories WHERE code = '6052')),
  ('SALARY', 'Salaires Décembre 2024', 800000, '2024-12-25', 'PENDING', (SELECT id FROM expense_account_categories WHERE code = '6410')),
  ('INTERNET', 'Abonnement Internet Décembre', 25000, '2024-12-05', 'DRAFT', (SELECT id FROM expense_account_categories WHERE code = '6260'))
ON CONFLICT DO NOTHING;

-- Insert demo financial losses
INSERT INTO financial_losses (product_id, adjustment_reason, quantity, unit_cost, loss_date, notes) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'EXPIRED', 50, 800, '2024-12-10', 'Lot périmé - Date: Nov 2024'),
  ('b0000000-0000-0000-0000-000000000003', 'DAMAGED', 10, 1200, '2024-12-18', 'Casse lors de la livraison')
ON CONFLICT DO NOTHING;

-- Insert demo sales
INSERT INTO sales_financial_records (sale_number, sale_date, sale_type, total_amount, discount_amount, amount_paid) VALUES
  ('VTE-2024-001', '2024-12-20', 'COMPTANT', 15000, 0, 15000),
  ('VTE-2024-002', '2024-12-20', 'COMPTANT', 8500, 500, 8000),
  ('VTE-2024-003', '2024-12-21', 'PROFORMA', 250000, 0, 0)
ON CONFLICT DO NOTHING;

INSERT INTO sales_financial_records (sale_number, sale_date, sale_type, patient_id, ipm_id, total_amount, ipm_coverage_amount, patient_amount, amount_paid) VALUES
  ('VTE-2024-004', '2024-12-21', 'MUTUELLE_IPM', 'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 50000, 40000, 10000, 10000)
ON CONFLICT DO NOTHING;

INSERT INTO sales_financial_records (sale_number, sale_date, sale_type, patient_id, total_amount, patient_amount, amount_paid) VALUES
  ('VTE-2024-005', '2024-12-22', 'CREDIT_PATIENT', 'c0000000-0000-0000-0000-000000000002', 35000, 35000, 0)
ON CONFLICT DO NOTHING;
