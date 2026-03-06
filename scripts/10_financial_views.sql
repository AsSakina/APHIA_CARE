-- APHIA V0 - Script 10: Financial Views (Read-Only Indicators)

-- View: Purchases by period
CREATE OR REPLACE VIEW v_purchases_by_period AS
SELECT 
  DATE_TRUNC('day', document_date) as period_day,
  DATE_TRUNC('week', document_date) as period_week,
  DATE_TRUNC('month', document_date) as period_month,
  document_type,
  COUNT(*) as document_count,
  SUM(total_amount) as total_amount,
  SUM(amount_paid) as total_paid,
  SUM(total_amount - amount_paid) as outstanding
FROM supplier_documents
WHERE deleted_at IS NULL
GROUP BY DATE_TRUNC('day', document_date), DATE_TRUNC('week', document_date), 
         DATE_TRUNC('month', document_date), document_type;

-- View: Supplier outstanding debt with aging
CREATE OR REPLACE VIEW v_supplier_outstanding_debt AS
SELECT 
  s.id as supplier_id,
  s.name as supplier_name,
  COUNT(sd.id) as document_count,
  SUM(sd.total_amount) as total_debt,
  SUM(sd.amount_paid) as total_paid,
  SUM(sd.total_amount - sd.amount_paid) as outstanding_amount,
  SUM(CASE WHEN sd.document_date >= CURRENT_DATE - INTERVAL '30 days' THEN sd.total_amount - sd.amount_paid ELSE 0 END) as debt_0_30_days,
  SUM(CASE WHEN sd.document_date < CURRENT_DATE - INTERVAL '30 days' AND sd.document_date >= CURRENT_DATE - INTERVAL '60 days' THEN sd.total_amount - sd.amount_paid ELSE 0 END) as debt_31_60_days,
  SUM(CASE WHEN sd.document_date < CURRENT_DATE - INTERVAL '60 days' AND sd.document_date >= CURRENT_DATE - INTERVAL '90 days' THEN sd.total_amount - sd.amount_paid ELSE 0 END) as debt_61_90_days,
  SUM(CASE WHEN sd.document_date < CURRENT_DATE - INTERVAL '90 days' THEN sd.total_amount - sd.amount_paid ELSE 0 END) as debt_over_90_days
FROM suppliers s
LEFT JOIN supplier_documents sd ON s.id = sd.supplier_id AND sd.deleted_at IS NULL
WHERE s.deleted_at IS NULL
GROUP BY s.id, s.name
HAVING SUM(sd.total_amount - sd.amount_paid) > 0;

-- View: Total losses by period and reason
CREATE OR REPLACE VIEW v_total_losses_by_period AS
SELECT 
  DATE_TRUNC('month', loss_date) as period_month,
  adjustment_reason,
  COUNT(*) as loss_count,
  SUM(quantity) as total_quantity,
  SUM(total_loss) as total_loss_amount
FROM financial_losses
WHERE deleted_at IS NULL
GROUP BY DATE_TRUNC('month', loss_date), adjustment_reason;

-- View: Expenses by category and period
CREATE OR REPLACE VIEW v_expenses_by_category AS
SELECT 
  DATE_TRUNC('month', e.expense_date) as period_month,
  ec.code as category_code,
  ec.name as category_name,
  e.expense_type,
  COUNT(*) as expense_count,
  SUM(e.amount) as total_amount,
  SUM(CASE WHEN e.status = 'PAID' THEN e.amount ELSE 0 END) as paid_amount,
  SUM(CASE WHEN e.status = 'VALIDATED' THEN e.amount ELSE 0 END) as pending_amount
FROM expenses e
LEFT JOIN expense_account_categories ec ON e.expense_category_id = ec.id
WHERE e.deleted_at IS NULL
GROUP BY DATE_TRUNC('month', e.expense_date), ec.code, ec.name, e.expense_type;

-- View: IPM outstanding balances with aging
CREATE OR REPLACE VIEW v_ipm_outstanding_balances AS
SELECT 
  i.id as ipm_id,
  i.name as ipm_name,
  i.code as ipm_code,
  COUNT(ic.id) as claim_count,
  SUM(ic.total_amount) as total_claimed,
  SUM(ic.amount_accepted) as total_accepted,
  SUM(ic.amount_paid) as total_paid,
  SUM(ic.amount_accepted - ic.amount_paid) as outstanding_amount,
  SUM(CASE WHEN ic.status IN ('SENT', 'ACCEPTED') AND ic.sent_at >= CURRENT_DATE - INTERVAL '30 days' THEN ic.amount_accepted - ic.amount_paid ELSE 0 END) as receivable_0_30_days,
  SUM(CASE WHEN ic.status IN ('SENT', 'ACCEPTED') AND ic.sent_at < CURRENT_DATE - INTERVAL '30 days' AND ic.sent_at >= CURRENT_DATE - INTERVAL '60 days' THEN ic.amount_accepted - ic.amount_paid ELSE 0 END) as receivable_31_60_days,
  SUM(CASE WHEN ic.status IN ('SENT', 'ACCEPTED') AND ic.sent_at < CURRENT_DATE - INTERVAL '60 days' THEN ic.amount_accepted - ic.amount_paid ELSE 0 END) as receivable_over_60_days
FROM ipms i
LEFT JOIN ipm_claims ic ON i.id = ic.ipm_id AND ic.deleted_at IS NULL AND ic.status NOT IN ('DRAFT', 'REJECTED', 'PAID')
WHERE i.deleted_at IS NULL AND i.is_active = true
GROUP BY i.id, i.name, i.code;

-- View: Sales revenue summary by day and type
CREATE OR REPLACE VIEW v_sales_revenue_summary AS
SELECT 
  sale_date,
  sale_type,
  COUNT(*) as sale_count,
  SUM(total_amount) as gross_revenue,
  SUM(discount_amount) as total_discounts,
  SUM(tolerance_amount) as total_tolerance,
  SUM(ipm_coverage_amount) as ipm_coverage,
  SUM(patient_amount) as patient_portion,
  SUM(amount_paid) as cash_collected,
  SUM(total_amount - discount_amount - tolerance_amount - amount_paid) as outstanding
FROM sales_financial_records
WHERE deleted_at IS NULL AND sale_type != 'PROFORMA'
GROUP BY sale_date, sale_type;

-- View: Accounting balance by category
CREATE OR REPLACE VIEW v_accounting_balance_by_category AS
SELECT 
  ec.id as category_id,
  ec.code as category_code,
  ec.name as category_name,
  COALESCE(SUM(CASE WHEN ae.entry_type = 'DEBIT' THEN ae.amount ELSE 0 END), 0) as total_debit,
  COALESCE(SUM(CASE WHEN ae.entry_type = 'CREDIT' THEN ae.amount ELSE 0 END), 0) as total_credit,
  COALESCE(SUM(CASE WHEN ae.entry_type = 'DEBIT' THEN ae.amount ELSE -ae.amount END), 0) as balance
FROM expense_account_categories ec
LEFT JOIN accounting_entries ae ON ec.id = ae.category_id
WHERE ec.deleted_at IS NULL AND ec.is_active = true
GROUP BY ec.id, ec.code, ec.name
ORDER BY ec.code;

-- View: Monthly financial summary
CREATE OR REPLACE VIEW v_monthly_financial_summary AS
SELECT 
  DATE_TRUNC('month', d.date) as month,
  COALESCE(p.total_payments, 0) as total_payments,
  COALESCE(e.total_expenses, 0) as total_expenses,
  COALESCE(l.total_losses, 0) as total_losses,
  COALESCE(s.total_sales, 0) as total_sales,
  COALESCE(s.cash_collected, 0) as cash_collected,
  COALESCE(r.ipm_received, 0) as ipm_received
FROM (
  SELECT DISTINCT DATE_TRUNC('month', payment_date) as date FROM payments WHERE deleted_at IS NULL
  UNION
  SELECT DISTINCT DATE_TRUNC('month', expense_date) FROM expenses WHERE deleted_at IS NULL
  UNION
  SELECT DISTINCT DATE_TRUNC('month', loss_date) FROM financial_losses WHERE deleted_at IS NULL
  UNION
  SELECT DISTINCT DATE_TRUNC('month', sale_date) FROM sales_financial_records WHERE deleted_at IS NULL
) d
LEFT JOIN (
  SELECT DATE_TRUNC('month', payment_date) as month, SUM(amount) as total_payments
  FROM payments WHERE deleted_at IS NULL GROUP BY 1
) p ON p.month = d.date
LEFT JOIN (
  SELECT DATE_TRUNC('month', expense_date) as month, SUM(amount) as total_expenses
  FROM expenses WHERE deleted_at IS NULL AND status IN ('VALIDATED', 'PAID') GROUP BY 1
) e ON e.month = d.date
LEFT JOIN (
  SELECT DATE_TRUNC('month', loss_date) as month, SUM(total_loss) as total_losses
  FROM financial_losses WHERE deleted_at IS NULL GROUP BY 1
) l ON l.month = d.date
LEFT JOIN (
  SELECT DATE_TRUNC('month', sale_date) as month, SUM(total_amount) as total_sales, SUM(amount_paid) as cash_collected
  FROM sales_financial_records WHERE deleted_at IS NULL AND sale_type != 'PROFORMA' GROUP BY 1
) s ON s.month = d.date
LEFT JOIN (
  SELECT DATE_TRUNC('month', payment_date) as month, SUM(amount) as ipm_received
  FROM receivable_payments WHERE deleted_at IS NULL AND ipm_claim_id IS NOT NULL GROUP BY 1
) r ON r.month = d.date
ORDER BY month DESC;

-- View: Financial dashboard summary (current month)
CREATE OR REPLACE VIEW v_financial_dashboard_summary AS
SELECT 
  -- Expenses
  (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE deleted_at IS NULL AND status IN ('VALIDATED', 'PAID') AND expense_date >= DATE_TRUNC('month', CURRENT_DATE)) as expenses_this_month,
  (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE deleted_at IS NULL AND status = 'PENDING') as expenses_pending,
  
  -- Payments (outgoing)
  (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE deleted_at IS NULL AND payment_date >= DATE_TRUNC('month', CURRENT_DATE)) as payments_this_month,
  
  -- Supplier debt
  (SELECT COALESCE(SUM(total_amount - amount_paid), 0) FROM supplier_documents WHERE deleted_at IS NULL) as total_supplier_debt,
  
  -- Losses
  (SELECT COALESCE(SUM(total_loss), 0) FROM financial_losses WHERE deleted_at IS NULL AND loss_date >= DATE_TRUNC('month', CURRENT_DATE)) as losses_this_month,
  
  -- Sales
  (SELECT COALESCE(SUM(total_amount), 0) FROM sales_financial_records WHERE deleted_at IS NULL AND sale_type != 'PROFORMA' AND sale_date >= DATE_TRUNC('month', CURRENT_DATE)) as sales_this_month,
  (SELECT COALESCE(SUM(amount_paid), 0) FROM sales_financial_records WHERE deleted_at IS NULL AND sale_date >= DATE_TRUNC('month', CURRENT_DATE)) as cash_collected_this_month,
  
  -- IPM Receivables
  (SELECT COALESCE(SUM(amount_accepted - amount_paid), 0) FROM ipm_claims WHERE deleted_at IS NULL AND status IN ('SENT', 'ACCEPTED', 'PARTIAL')) as ipm_receivables,
  
  -- Credit patients
  (SELECT COALESCE(SUM(patient_amount - amount_paid), 0) FROM sales_financial_records WHERE deleted_at IS NULL AND sale_type = 'CREDIT_PATIENT' AND patient_amount > amount_paid) as patient_receivables;
