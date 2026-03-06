-- APHIA V0 - Script 01: Financial Enums and Types
-- This script creates all enums used in the finance module

-- Payment methods
DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM (
    'CASH',
    'CARD',
    'CHEQUE',
    'TRANSFER',
    'MOBILE_MONEY',
    'MIXED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Expense types
DO $$ BEGIN
  CREATE TYPE expense_type AS ENUM (
    'MEDICATION_PURCHASE',
    'RENT',
    'SALARY',
    'ELECTRICITY',
    'WATER',
    'INTERNET',
    'PHONE',
    'MAINTENANCE',
    'CLEANING',
    'TRANSPORT',
    'OFFICE_SUPPLIES',
    'BANK_FEES',
    'TAXES',
    'INSURANCE',
    'MARKETING',
    'TRAINING',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Supplier document types
DO $$ BEGIN
  CREATE TYPE supplier_document_type AS ENUM (
    'BL',
    'FACTURE',
    'BON_RETOUR'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Financial movement types
DO $$ BEGIN
  CREATE TYPE financial_movement_type AS ENUM (
    'PURCHASE',
    'PAYMENT',
    'LOSS_ADJUSTMENT',
    'RETURN_TO_SUPPLIER',
    'EXPENSE',
    'SALE',
    'IPM_CLAIM',
    'IPM_PAYMENT',
    'CREDIT_RECOVERY'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Sale types
DO $$ BEGIN
  CREATE TYPE sale_type AS ENUM (
    'COMPTANT',
    'MUTUELLE_IPM',
    'CREDIT_PATIENT',
    'BON_PATIENT',
    'PROFORMA',
    'RETAIL_UNIT'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Stock adjustment reasons
DO $$ BEGIN
  CREATE TYPE adjustment_reason AS ENUM (
    'ENTRY_ERROR',
    'EXPIRED',
    'DAMAGED',
    'THEFT',
    'UNRECORDED_EXIT',
    'INVENTORY_CORRECTION',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Expense status
DO $$ BEGIN
  CREATE TYPE expense_status AS ENUM (
    'DRAFT',
    'PENDING',
    'VALIDATED',
    'PAID',
    'CANCELLED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- IPM claim status
DO $$ BEGIN
  CREATE TYPE ipm_claim_status AS ENUM (
    'DRAFT',
    'SENT',
    'ACCEPTED',
    'REJECTED',
    'PARTIAL',
    'PAID'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Accounting entry type
DO $$ BEGIN
  CREATE TYPE accounting_entry_type AS ENUM (
    'DEBIT',
    'CREDIT'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
