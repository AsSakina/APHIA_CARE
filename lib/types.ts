// Database types based on APHIA schema

export type PaymentMethod = "CASH" | "CARD" | "CHEQUE" | "TRANSFER" | "MOBILE_MONEY" | "IPM" | "CREDIT" | "MIXED"

export interface PaymentSplit {
  method: Exclude<PaymentMethod, "MIXED">
  amount: number
  reference?: string
}

export type ExpenseType =
  | "MEDICATION_PURCHASE"
  | "RENT"
  | "SALARY"
  | "ELECTRICITY"
  | "WATER"
  | "INTERNET"
  | "PHONE"
  | "MAINTENANCE"
  | "CLEANING"
  | "TRANSPORT"
  | "OFFICE_SUPPLIES"
  | "BANK_FEES"
  | "TAXES"
  | "INSURANCE"
  | "MARKETING"
  | "TRAINING"
  | "OTHER"

export type ExpenseStatus = "DRAFT" | "PENDING" | "VALIDATED" | "PAID" | "CANCELLED"

export type SaleType = "COMPTANT" | "MUTUELLE_IPM" | "CREDIT_PATIENT" | "BON_PATIENT" | "PROFORMA" | "RETAIL_UNIT"

export type AdjustmentReason =
  | "EXPIRED"
  | "DAMAGED"
  | "VOL_PERDU" // Renamed from THEFT - Vol ou perdu de vue
  | "DON" // New - Donation
  | "OTHER"

export type LossReason = "EXPIRED" | "DONATION" | "THEFT_LOST" | "OTHER"

export interface StockEntry {
  id: string
  product_id: string
  product_code?: string
  product_name: string
  quantity_received: number
  unit_price: number
  supplier?: string
  invoice_number?: string
  entry_date: string
  created_at: string
}

export interface StockLoss {
  id: string
  product_id: string
  product_code?: string
  product_name: string
  quantity_lost: number
  reason: LossReason
  notes?: string
  loss_date: string
  created_at: string
}

export type IpmClaimStatus = "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED" | "PARTIAL" | "PAID"

export type AccountingEntryType = "DEBIT" | "CREDIT"

export type ClientType = "COMPTANT" | "IPM_MUTUELLE" | "CLIENT_COMPTE" | "CLIENT_CREDIT" | "PROFORMA"
export type CartStatus = "ACTIVE" | "VALIDATED" | "CANCELLED" | "EXPIRED"

export type DiscountType = "FIXED" | "PERCENTAGE"

// Entity interfaces
export interface Supplier {
  id: string
  name: string
  phone?: string
  email?: string
  address?: string
  tax_id?: string
  notes?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface Product {
  id: string
  name: string
  code?: string
  barcode?: string
  unit_price: number
  purchase_price: number
  category?: string
  is_active: boolean
  created_at: string
}

export interface Patient {
  id: string
  first_name: string
  last_name: string
  phone?: string
  email?: string
  address?: string
  date_of_birth?: string
  can_receive_credit?: boolean
  credit_limit?: number
  current_credit_balance?: number
}

export interface Expense {
  id: string
  expense_type: ExpenseType
  description: string
  amount: number
  expense_date: string
  status: ExpenseStatus
  expense_category_id?: string
  category_name?: string
  category_code?: string
  notes?: string
  validated_at?: string
  validated_by?: string
  created_at: string
}

export interface Payment {
  id: string
  payment_method: PaymentMethod
  amount: number
  payment_date: string
  reference?: string
  expense_id?: string
  supplier_document_id?: string
  notes?: string
  created_at: string
  // Joined fields
  expense_description?: string
  supplier_name?: string
  document_number?: string
}

export interface FinancialLoss {
  id: string
  product_id?: string
  product_name?: string
  adjustment_reason: AdjustmentReason
  quantity: number
  unit_cost: number
  total_loss: number
  loss_date: string
  notes?: string
  created_at: string
}

export interface ExpenseCategory {
  id: string
  code: string
  name: string
  parent_id?: string
  description?: string
  is_active: boolean
}

export interface Ipm {
  id: string
  name: string
  code?: string
  contact_name?: string
  phone?: string
  email?: string
  coverage_rate: number
  payment_delay_days: number
  is_active: boolean
}

export interface IpmClaim {
  id: string
  ipm_id: string
  ipm_name?: string
  claim_number: string
  period_start: string
  period_end: string
  total_amount: number
  amount_accepted: number
  amount_paid: number
  status: IpmClaimStatus
  sent_at?: string
  accepted_at?: string
  notes?: string
  created_at: string
}

export interface SalesFinancialRecord {
  id: string
  sale_number: string
  sale_date: string
  sale_type: SaleType
  patient_id?: string
  patient_name?: string
  ipm_id?: string
  ipm_name?: string
  ipm_patient_id?: string
  total_amount: number
  discount_amount: number
  tolerance_amount: number
  ipm_coverage_amount: number
  patient_amount: number
  amount_paid: number
}

export interface Cart {
  id: string
  cart_number: string
  name: string // Intelligent name: e.g., "2026-01-28_Vente_Jour1" or "2026-01-28_Caisse1_Admin"
  client_type: ClientType
  patient_id?: string
  patient_name?: string
  ipm_id?: string
  ipm_name?: string
  ipm_patient_id?: string
  user_id?: string
  user_name?: string // User/pharmacist responsible
  subtotal: number
  discount_amount: number
  discount_percentage: number
  discount_type: DiscountType // Added discount type
  total_amount: number
  ipm_coverage_rate: number
  ipm_coverage_amount: number
  patient_amount: number
  status: CartStatus
  notes?: string
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  product_name?: string
  product_code?: string
  quantity: number
  is_unit_sale: boolean
  unit_price: number
  line_total: number
  lot_number?: string
  expiry_date?: string
}

export interface Sale {
  id: string
  sale_number: string
  cart_id?: string
  client_type: ClientType
  patient_id?: string
  patient_name?: string
  ipm_id?: string
  ipm_name?: string
  subtotal: number
  discount_amount: number
  tolerance_amount: number
  total_amount: number
  ipm_coverage_amount: number
  patient_amount: number
  amount_paid: number
  payment_method?: PaymentMethod
  payment_reference?: string
  payment_splits?: PaymentSplit[]
  sale_date: string
  is_proforma: boolean
  notes?: string
  created_at: string
  created_by?: string
  items?: SaleItem[]
}

export interface SaleItem {
  id: string
  sale_id: string
  product_id: string
  product_name?: string
  product_code?: string
  quantity: number
  is_unit_sale: boolean
  unit_price: number
  unit_cost: number
  line_total: number
  lot_number?: string
  expiry_date?: string
}

export interface IpmPatient {
  id: string
  patient_id: string
  patient_name?: string
  ipm_id: string
  ipm_name?: string
  membership_number: string
  start_date: string
  end_date?: string
  is_active: boolean
  coverage_rate?: number // Per-patient override rate
  effective_rate?: number // Computed effective rate
  pharmacy_id?: string
}

export interface AccountingEntry {
  id: string
  entry_date: string
  entry_type: AccountingEntryType
  amount: number
  category_id?: string
  category_code?: string
  category_name?: string
  reference_type: string
  reference_id: string
  description?: string
  created_at: string
}

// Dashboard summary type
export interface DashboardSummary {
  expenses_this_month: number
  expenses_pending: number
  payments_this_month: number
  total_supplier_debt: number
  losses_this_month: number
  sales_this_month: number
  cash_collected_this_month: number
  ipm_receivables: number
  patient_receivables: number
}

// Supplier debt view
export interface SupplierDebt {
  supplier_id: string
  supplier_name: string
  document_count: number
  total_debt: number
  total_paid: number
  outstanding_amount: number
  debt_0_30_days: number
  debt_31_60_days: number
  debt_61_90_days: number
  debt_over_90_days: number
}

// IPM balance view
export interface IpmBalance {
  ipm_id: string
  ipm_name: string
  ipm_code?: string
  claim_count: number
  total_claimed: number
  total_accepted: number
  total_paid: number
  outstanding_amount: number
  receivable_0_30_days: number
  receivable_31_60_days: number
  receivable_over_60_days: number
}

// Pharmacy type for multi-tenant support
export interface Pharmacy {
  id: string
  name: string
  code?: string
  address?: string
  phone?: string
  email?: string
  logo_url?: string
  tax_id?: string
  license_number?: string
  plan_type: "free" | "starter" | "professional" | "enterprise"
  plan_expires_at?: string
  is_active: boolean
  settings?: Record<string, unknown>
  created_at: string
}

// PharmacyRole type
export type PharmacyRole = "owner" | "admin" | "manager" | "pharmacist" | "staff"

export interface SimplifiedAccounting {
  period: string
  chiffre_affaires: number
  ventes_encaissees: number
  depenses: number
  ipm_a_recevoir: number
  credits_a_recevoir: number
  solde: number // Computed: ventes_encaissees - depenses
}

export interface StockQuantity {
  product_id: string
  product_code?: string
  product_name: string
  category?: string
  unit_price: number
  purchase_price: number
  current_stock: number
  total_in: number
  total_out: number
  stock_value: number // Computed: current_stock * purchase_price
}

// Cash Register types
export interface CashRegister {
  id: string
  register_number: string
  name: string
  pharmacy_id: string
  managers: string[] // User IDs/names
  opened_at: string
  closed_at?: string
  is_active: boolean
  created_at: string
}

export interface CashRegisterSession {
  id: string
  register_id: string
  register_number: string
  opened_at: string
  opened_by: string
  closed_at?: string
  closed_by?: string
  opening_balance: number // Solde initial en caisse
  closing_balance?: number // Solde final
  status: "open" | "closed"
}

export interface CashMovement {
  id: string
  session_id: string
  sale_id?: string
  type: "sale" | "payment" | "adjustment" | "opening" | "closing"
  payment_method: PaymentMethod
  amount: number
  description?: string
  timestamp: string
  created_by?: string
}

export interface CashSummary {
  session_id: string
  opening_balance: number
  closing_balance: number
  total_cash_sales: number
  total_card_payments: number
  total_mobile_money: number
  total_movements: number
  adjustments: number // Corrections manuelles
  discrepancy: number // Différence caisse
  created_at: string
}

export interface SalesHistoryRecord {
  id: string
  sale_id: string
  sale_number: string
  register_id: string
  register_number: string
  patient_code: string
  patient_first_name: string
  patient_last_name: string
  client_type: ClientType
  products_sold: Array<{
    product_name: string
    product_code?: string
    quantity: number
  }>
  subtotal: number
  discount_amount: number
  total_amount: number
  amount_paid: number
  payment_method?: string
  invoice_number?: string
  sale_date: string
  timestamp: string
  created_by?: string
}

export interface IpmReceivable {
  id: string
  ipm_id: string
  ipm_name: string
  patient_id?: string
  patient_name?: string
  amount_due: number
  amount_paid: number
  balance: number
  sale_ids: string[]
  claim_ids: string[]
  status: "pending" | "partial" | "paid"
  created_at: string
  updated_at: string
}
