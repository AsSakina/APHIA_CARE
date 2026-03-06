-- APHIA V0 - Script 05: Expense Account Categories (Hierarchical)

CREATE TABLE IF NOT EXISTS expense_account_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  parent_id UUID REFERENCES expense_account_categories(id),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Add foreign key to expenses
ALTER TABLE expenses 
ADD CONSTRAINT fk_expense_category 
FOREIGN KEY (expense_category_id) 
REFERENCES expense_account_categories(id);

-- Seed default categories
INSERT INTO expense_account_categories (code, name, description) VALUES
  ('6010', 'Achats de marchandises', 'Achat de médicaments et produits pharmaceutiques'),
  ('6130', 'Locations', 'Loyer et charges locatives'),
  ('6410', 'Charges de personnel', 'Salaires et charges sociales'),
  ('6051', 'Fournitures non stockables - Eau', 'Factures d''eau'),
  ('6052', 'Fournitures non stockables - Électricité', 'Factures d''électricité'),
  ('6053', 'Fournitures non stockables - Autres', 'Gaz, carburant, etc.'),
  ('6260', 'Frais postaux et télécommunications', 'Téléphone, internet'),
  ('6150', 'Entretien et réparations', 'Maintenance des locaux et équipements'),
  ('6270', 'Services bancaires', 'Frais bancaires et commissions'),
  ('6350', 'Impôts et taxes', 'Taxes diverses'),
  ('6160', 'Assurances', 'Primes d''assurance'),
  ('6230', 'Publicité', 'Marketing et communication'),
  ('6250', 'Déplacements', 'Transport et déplacements'),
  ('6180', 'Documentation', 'Formation et documentation'),
  ('6580', 'Charges diverses', 'Autres charges d''exploitation')
ON CONFLICT (code) DO NOTHING;

-- Create index
CREATE INDEX IF NOT EXISTS idx_expense_categories_parent ON expense_account_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_expense_categories_code ON expense_account_categories(code);
