-- APHIA V0 - Script 09: Accounting Triggers

-- Trigger: Auto-create accounting entry when expense is validated
CREATE OR REPLACE FUNCTION create_expense_accounting_entry()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create entry when status changes to VALIDATED
  IF NEW.status = 'VALIDATED' AND (OLD.status IS NULL OR OLD.status != 'VALIDATED') THEN
    -- Check category is set
    IF NEW.expense_category_id IS NULL THEN
      RAISE EXCEPTION 'Expense must have a category before validation';
    END IF;
    
    -- Create DEBIT entry (expense increases costs)
    INSERT INTO accounting_entries (
      entry_date,
      entry_type,
      amount,
      category_id,
      reference_type,
      reference_id,
      description,
      created_by
    ) VALUES (
      NEW.expense_date,
      'DEBIT',
      NEW.amount,
      NEW.expense_category_id,
      'EXPENSE',
      NEW.id,
      NEW.description,
      NEW.validated_by
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_expense_accounting ON expenses;
CREATE TRIGGER trg_expense_accounting
AFTER UPDATE ON expenses
FOR EACH ROW
EXECUTE FUNCTION create_expense_accounting_entry();

-- Trigger: Auto-create accounting entry when payment is made
CREATE OR REPLACE FUNCTION create_payment_accounting_entry()
RETURNS TRIGGER AS $$
DECLARE
  v_category_id UUID;
  v_description TEXT;
BEGIN
  -- Get category from linked expense if exists
  IF NEW.expense_id IS NOT NULL THEN
    SELECT expense_category_id, description 
    INTO v_category_id, v_description
    FROM expenses 
    WHERE id = NEW.expense_id;
  ELSE
    -- For supplier payments, use purchase category
    SELECT id INTO v_category_id 
    FROM expense_account_categories 
    WHERE code = '6010' 
    LIMIT 1;
    v_description := 'Payment to supplier';
  END IF;
  
  -- Create CREDIT entry (payment = cash outflow)
  INSERT INTO accounting_entries (
    entry_date,
    entry_type,
    amount,
    category_id,
    reference_type,
    reference_id,
    description,
    created_by
  ) VALUES (
    NEW.payment_date,
    'CREDIT',
    NEW.amount,
    v_category_id,
    'PAYMENT',
    NEW.id,
    COALESCE(v_description, NEW.notes, 'Payment'),
    NEW.created_by
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_payment_accounting ON payments;
CREATE TRIGGER trg_payment_accounting
AFTER INSERT ON payments
FOR EACH ROW
EXECUTE FUNCTION create_payment_accounting_entry();

-- Trigger: Update supplier document amount_paid when payment is made
CREATE OR REPLACE FUNCTION update_supplier_document_paid()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.supplier_document_id IS NOT NULL THEN
    UPDATE supplier_documents
    SET amount_paid = amount_paid + NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.supplier_document_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_supplier_paid ON payments;
CREATE TRIGGER trg_update_supplier_paid
AFTER INSERT ON payments
FOR EACH ROW
EXECUTE FUNCTION update_supplier_document_paid();

-- Trigger: Update expense status to PAID when fully paid
CREATE OR REPLACE FUNCTION update_expense_paid_status()
RETURNS TRIGGER AS $$
DECLARE
  v_total_paid DECIMAL(15,2);
  v_expense_amount DECIMAL(15,2);
BEGIN
  IF NEW.expense_id IS NOT NULL THEN
    SELECT COALESCE(SUM(amount), 0) INTO v_total_paid
    FROM payments
    WHERE expense_id = NEW.expense_id AND deleted_at IS NULL;
    
    SELECT amount INTO v_expense_amount
    FROM expenses
    WHERE id = NEW.expense_id;
    
    IF v_total_paid >= v_expense_amount THEN
      UPDATE expenses
      SET status = 'PAID', updated_at = NOW()
      WHERE id = NEW.expense_id AND status = 'VALIDATED';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_expense_paid ON payments;
CREATE TRIGGER trg_update_expense_paid
AFTER INSERT ON payments
FOR EACH ROW
EXECUTE FUNCTION update_expense_paid_status();
