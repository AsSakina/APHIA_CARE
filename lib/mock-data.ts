// Mock data store for offline mode
// This replaces all database calls with in-memory data

import type {
  Patient,
  Product,
  Ipm,
  IpmPatient,
  IpmClaim,
  Cart,
  CartItem,
  Sale,
  SaleItem,
  Expense,
  Payment,
  FinancialLoss,
  DashboardSummary,
  SimplifiedAccounting,
  StockQuantity,
  ClientType,
  CashRegister,
  SalesHistoryRecord,
  StockEntry,
  StockLoss,
  LossReason,
  IpmReceivable,
  CashRegisterSession,
  CashMovement,
  CashSummary,
} from "./types"

// =====================================================
// CURRENT USER (simulated logged-in user)
// =====================================================
export const currentUser = {
  id: "mock-user-1",
  email: "pharmacien@aphia.local",
  username: "pharmacien",
  first_name: "Jean",
  last_name: "Pharmacien",
  role: "admin" as const,
  is_active: true,
  pharmacy_id: "mock-pharmacy-1",
  pharmacy_role: "owner" as const,
  pharmacy_name: "Pharmacie APHIA Demo",
  phone: "+221 77 123 45 67",
  avatar_url: null,
  created_at: new Date().toISOString(),
  last_login_at: new Date().toISOString(),
}

export const currentPharmacy = {
  id: "mock-pharmacy-1",
  name: "Pharmacie APHIA Demo",
  code: "PH-DEMO",
  address: "123 Avenue de la Santé, Dakar",
  phone: "+221 33 821 00 00",
  email: "contact@pharmacie-aphia.sn",
  logo_url: null,
  tax_id: "SN123456789",
  license_number: "PHARM-2024-001",
  plan_type: "professional" as const,
  is_active: true,
  created_at: new Date().toISOString(),
}

// =====================================================
// MOCK PATIENTS
// =====================================================
export const mockPatients: Patient[] = [
  {
    id: "patient-1",
    first_name: "Aminata",
    last_name: "Diallo",
    phone: "+221 77 100 00 01",
    email: "aminata.diallo@email.sn",
    can_receive_credit: true,
    credit_limit: 50000,
    current_credit_balance: 0,
  },
  {
    id: "patient-2",
    first_name: "Moussa",
    last_name: "Ndiaye",
    phone: "+221 77 100 00 02",
    email: "moussa.ndiaye@email.sn",
    can_receive_credit: true,
    credit_limit: 100000,
    current_credit_balance: 15000,
  },
  {
    id: "patient-3",
    first_name: "Fatou",
    last_name: "Sow",
    phone: "+221 77 100 00 03",
    email: "fatou.sow@email.sn",
    can_receive_credit: false,
    credit_limit: 0,
    current_credit_balance: 0,
  },
  {
    id: "patient-4",
    first_name: "Ibrahima",
    last_name: "Fall",
    phone: "+221 77 100 00 04",
    email: "ibrahima.fall@email.sn",
    can_receive_credit: true,
    credit_limit: 75000,
    current_credit_balance: 25000,
  },
  {
    id: "patient-5",
    first_name: "Mariama",
    last_name: "Ba",
    phone: "+221 77 100 00 05",
    email: "mariama.ba@email.sn",
    can_receive_credit: false,
  },
]

// =====================================================
// MOCK PRODUCTS
// =====================================================
export const mockProducts: Product[] = [
  {
    id: "prod-1",
    code: "PARA001",
    barcode: "3614290255360",
    name: "Paracétamol 500mg",
    category: "Antalgiques",
    unit_price: 1500,
    purchase_price: 800,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "prod-2",
    code: "IBUP001",
    barcode: "3400938016763",
    name: "Ibuprofène 400mg",
    category: "Anti-inflammatoires",
    unit_price: 2500,
    purchase_price: 1200,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "prod-3",
    code: "AMOX001",
    barcode: "3400936105706",
    name: "Amoxicilline 500mg",
    category: "Antibiotiques",
    unit_price: 3500,
    purchase_price: 2000,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "prod-4",
    code: "VITC001",
    barcode: "3701143805017",
    name: "Vitamine C 1000mg",
    category: "Vitamines",
    unit_price: 5000,
    purchase_price: 3000,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "prod-5",
    code: "OMEP001",
    barcode: "3400936199701",
    name: "Oméprazole 20mg",
    category: "Gastro-entérologie",
    unit_price: 4500,
    purchase_price: 2500,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "prod-6",
    code: "DOLP001",
    barcode: "3614290254653",
    name: "Doliprane 1000mg",
    category: "Antalgiques",
    unit_price: 2000,
    purchase_price: 1000,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "prod-7",
    code: "AZIT001",
    barcode: "3400936198994",
    name: "Azithromycine 250mg",
    category: "Antibiotiques",
    unit_price: 8500,
    purchase_price: 5500,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "prod-8",
    code: "LOSC001",
    barcode: "3400936247556",
    name: "Losartan 50mg",
    category: "Cardiologie",
    unit_price: 6000,
    purchase_price: 3800,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "prod-9",
    code: "METF001",
    barcode: "3400936124588",
    name: "Metformine 500mg",
    category: "Diabétologie",
    unit_price: 3000,
    purchase_price: 1500,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "prod-10",
    code: "SERU001",
    barcode: "3701143800011",
    name: "Sérum physiologique 500ml",
    category: "Dispositifs médicaux",
    unit_price: 1500,
    purchase_price: 700,
    is_active: true,
    created_at: new Date().toISOString(),
  },
]

// =====================================================
// MOCK IPMs (Mutuelles)
// =====================================================
export const mockIpms: Ipm[] = [
  {
    id: "ipm-1",
    name: "CNAMGS",
    code: "CNAMGS",
    coverage_rate: 80,
    payment_delay_days: 30,
    is_active: true,
    contact_name: "Service Facturation",
    phone: "+221 33 800 00 01",
    email: "facturation@cnamgs.sn",
  },
  {
    id: "ipm-2",
    name: "IPRES Mutuelle",
    code: "IPRES",
    coverage_rate: 70,
    payment_delay_days: 45,
    is_active: true,
    contact_name: "Direction Prestations",
    phone: "+221 33 800 00 02",
    email: "prestations@ipres.sn",
  },
  {
    id: "ipm-3",
    name: "Mutuelle des Fonctionnaires",
    code: "MUT-FONC",
    coverage_rate: 75,
    payment_delay_days: 60,
    is_active: true,
    contact_name: "Service Remboursement",
    phone: "+221 33 800 00 03",
  },
]

// =====================================================
// MOCK IPM PATIENTS
// =====================================================
export const mockIpmPatients: IpmPatient[] = [
  {
    id: "ipm-patient-1",
    patient_id: "patient-1",
    patient_name: "Aminata Diallo",
    ipm_id: "ipm-1",
    ipm_name: "CNAMGS",
    membership_number: "CNAM-2024-00123",
    start_date: "2024-01-01",
    is_active: true,
    coverage_rate: 80,
    effective_rate: 80,
  },
  {
    id: "ipm-patient-2",
    patient_id: "patient-2",
    patient_name: "Moussa Ndiaye",
    ipm_id: "ipm-2",
    ipm_name: "IPRES Mutuelle",
    membership_number: "IPRES-2024-00456",
    start_date: "2024-02-15",
    is_active: true,
    coverage_rate: 70,
    effective_rate: 70,
  },
  {
    id: "ipm-patient-3",
    patient_id: "patient-4",
    patient_name: "Ibrahima Fall",
    ipm_id: "ipm-1",
    ipm_name: "CNAMGS",
    membership_number: "CNAM-2024-00789",
    start_date: "2024-03-01",
    is_active: true,
    coverage_rate: 85, // Override rate for this patient
    effective_rate: 85,
  },
  {
    id: "ipm-patient-4",
    patient_id: "patient-3",
    patient_name: "Fatou Sow",
    ipm_id: "ipm-3",
    ipm_name: "Mutuelle des Fonctionnaires",
    membership_number: "MUT-FONC-2024-00234",
    start_date: "2024-01-15",
    is_active: true,
    coverage_rate: 75,
    effective_rate: 75,
  },
]

// =====================================================
// IN-MEMORY STORES (mutable)
// =====================================================
const today = new Date().toISOString().slice(0, 10)

// Initialize sample carts with intelligent names
const sampleCarts: Cart[] = [
  {
    id: "cart-1-demo",
    cart_number: "PAN-20260128-0001",
    name: `${today}_Vente_01_Admin`,
    client_type: "COMPTANT",
    user_id: "user-admin",
    user_name: "Admin",
    status: "ACTIVE",
    subtotal: 0,
    discount_amount: 0,
    discount_percentage: 0,
    discount_type: "FIXED",
    total_amount: 0,
    ipm_coverage_rate: 0,
    ipm_coverage_amount: 0,
    patient_amount: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cart-2-demo",
    cart_number: "PAN-20260128-0002",
    name: `${today}_IPM_02_Pharma`,
    client_type: "IPM_MUTUELLE",
    user_id: "user-pharma",
    user_name: "Pharma",
    status: "ACTIVE",
    subtotal: 0,
    discount_amount: 0,
    discount_percentage: 0,
    discount_type: "FIXED",
    total_amount: 0,
    ipm_coverage_rate: 0,
    ipm_coverage_amount: 0,
    patient_amount: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const mockCarts: Cart[] = sampleCarts
export const mockCartItems: CartItem[] = []
export const mockSales: Sale[] = [
  // Sample IPM sales for demonstration
  {
    id: "sale-ipm-001",
    sale_number: "VTE-20250128-0001",
    pharmacy_id: "mock-pharmacy-1",
    register_id: "register-1",
    patient_id: "patient-1",
    client_type: "IPM_MUTUELLE",
    ipm_id: "ipm-1",
    discount_percentage: 0,
    discount_amount: 0,
    subtotal: 50000,
    total_amount: 50000,
    amount_paid: 0,
    amount_due: 50000,
    ipm_coverage_amount: 40000,
    payment_method: "IPM",
    sale_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sale-ipm-002",
    sale_number: "VTE-20250128-0002",
    pharmacy_id: "mock-pharmacy-1",
    register_id: "register-1",
    patient_id: "patient-2",
    client_type: "IPM_MUTUELLE",
    ipm_id: "ipm-2",
    discount_percentage: 0,
    discount_amount: 0,
    subtotal: 75000,
    total_amount: 75000,
    amount_paid: 0,
    amount_due: 75000,
    ipm_coverage_amount: 52500,
    payment_method: "IPM",
    sale_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sale-ipm-003",
    sale_number: "VTE-20250128-0003",
    pharmacy_id: "mock-pharmacy-1",
    register_id: "register-1",
    patient_id: "patient-4",
    client_type: "IPM_MUTUELLE",
    ipm_id: "ipm-1",
    discount_percentage: 0,
    discount_amount: 0,
    subtotal: 35000,
    total_amount: 35000,
    amount_paid: 28000,
    amount_due: 7000,
    ipm_coverage_amount: 28000,
    payment_method: "IPM",
    sale_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sale-comptant-001",
    sale_number: "VTE-20250128-0004",
    pharmacy_id: "mock-pharmacy-1",
    register_id: "register-1",
    patient_id: "patient-3",
    client_type: "COMPTANT",
    discount_percentage: 0,
    discount_amount: 0,
    subtotal: 25000,
    total_amount: 25000,
    amount_paid: 25000,
    amount_due: 0,
    ipm_coverage_amount: 0,
    payment_method: "CASH",
    sale_date: new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
  },
]
export const mockSaleItems: SaleItem[] = [
  {
    id: "item-001",
    sale_id: "sale-ipm-001",
    product_id: "prod-1",
    product_name: "Paracétamol 500mg",
    quantity: 20,
    unit_price: 1500,
    line_total: 30000,
  },
  {
    id: "item-002",
    sale_id: "sale-ipm-001",
    product_id: "prod-2",
    product_name: "Ibuprofène 400mg",
    quantity: 10,
    unit_price: 2000,
    line_total: 20000,
  },
  {
    id: "item-003",
    sale_id: "sale-ipm-002",
    product_id: "prod-3",
    product_name: "Amoxicilline 500mg",
    quantity: 15,
    unit_price: 5000,
    line_total: 75000,
  },
  {
    id: "item-004",
    sale_id: "sale-ipm-003",
    product_id: "prod-4",
    product_name: "Vitamine C 1000mg",
    quantity: 7,
    unit_price: 5000,
    line_total: 35000,
  },
  {
    id: "item-005",
    sale_id: "sale-comptant-001",
    product_id: "prod-5",
    product_name: "Oméprazole 20mg",
    quantity: 5,
    unit_price: 5000,
    line_total: 25000,
  },
]
export const mockExpenses: Expense[] = []
export const mockPayments: Payment[] = []
export const mockLosses: FinancialLoss[] = []
export const mockIpmClaims: IpmClaim[] = []

// Stock quantities (in-memory tracking)
export const mockStockQuantities: Map<string, number> = new Map([
  ["prod-1", 5],
  ["prod-2", -10],
  ["prod-3", 200],
  ["prod-4", 3],
  ["prod-5", 250],
  ["prod-6", 0],
  ["prod-7", 100],
  ["prod-8", 8],
  ["prod-9", 220],
  ["prod-10", 350],
])

// Product expiration dates for alerts (in-memory tracking)
export const mockProductExpirationDates: Map<string, string> = new Map([
  ["prod-1", new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]], // 7 days from now
  ["prod-2", new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]], // 30 days from now
  ["prod-3", new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]], // 90 days from now
  ["prod-4", new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]], // 5 days ago (expired)
  ["prod-5", new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]], // 14 days from now
  ["prod-6", new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]], // 3 days from now
  ["prod-7", new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]], // 60 days from now
  ["prod-8", new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]], // 45 days from now
  ["prod-9", new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]], // 120 days from now
  ["prod-10", new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]], // 180 days from now
])

// Alert constants
export const LOW_STOCK_THRESHOLD = 10
export const EXPIRY_WARNING_DAYS = 30

// =====================================================
// COUNTERS FOR GENERATING IDs
// =====================================================
let cartCounter = 1
let saleCounter = 1
let expenseCounter = 1
let paymentCounter = 1
let lossCounter = 1
let patientCounter = mockPatients.length + 1
let ipmCounter = mockIpms.length + 1
let claimCounter = 1

export function generateCartNumber(): string {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "")
  return `PAN-${today}-${String(cartCounter++).padStart(4, "0")}`
}

export function generateCartName(clientType?: string, userId?: string, userName?: string): string {
  // Format: Date_Type_Number or Date_Caisse_Number_User
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  const cartNum = String(cartCounter).padStart(2, "0")
  
  const typeMap: Record<string, string> = {
    COMPTANT: "Vente",
    IPM_MUTUELLE: "IPM",
    CLIENT_COMPTE: "Crédit",
    CLIENT_CREDIT: "Crédit",
    PROFORMA: "Proforma",
  }
  
  const type = typeMap[clientType || "COMPTANT"] || "Caisse"
  const userSuffix = userName ? `_${userName.slice(0, 8)}` : ""
  
  return `${today}_${type}_${cartNum}${userSuffix}`
}

export function generateSaleNumber(): string {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "")
  return `VTE-${today}-${String(saleCounter++).padStart(4, "0")}`
}

export function generateExpenseId(): string {
  return `exp-${expenseCounter++}`
}

export function generatePaymentId(): string {
  return `pay-${paymentCounter++}`
}

export function generateLossId(): string {
  return `loss-${lossCounter++}`
}

export function generatePatientId(): string {
  return `patient-${patientCounter++}`
}

export function generateIpmId(): string {
  return `ipm-${ipmCounter++}`
}

export function generateClaimId(): string {
  return `claim-${claimCounter++}`
}

export function generateCartId(): string {
  return `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function generateCartItemId(): string {
  return `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function generateSaleId(): string {
  return `sale-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// =====================================================
// MOCK DASHBOARD DATA
// =====================================================
export function getMockDashboardSummary(): DashboardSummary {
  const salesTotal = mockSales.reduce((sum, s) => sum + s.total_amount, 0)
  const cashCollected = mockSales.reduce((sum, s) => sum + s.amount_paid, 0)
  const ipmReceivables = mockSales.reduce((sum, s) => sum + (s.ipm_coverage_amount - 0), 0)
  const expensesTotal = mockExpenses.reduce((sum, e) => sum + e.amount, 0)
  const lossesTotal = mockLosses.reduce((sum, l) => sum + l.total_loss, 0)

  return {
    expenses_this_month: expensesTotal || 125000,
    expenses_pending: 45000,
    payments_this_month: mockPayments.reduce((sum, p) => sum + p.amount, 0) || 80000,
    total_supplier_debt: 250000,
    losses_this_month: lossesTotal || 15000,
    sales_this_month: salesTotal || 850000,
    cash_collected_this_month: cashCollected || 720000,
    ipm_receivables: ipmReceivables || 180000,
    patient_receivables: 45000,
  }
}

export function getMockSimplifiedAccounting(): SimplifiedAccounting[] {
  return [
    {
      period: new Date().toISOString().slice(0, 7), // Current month
      chiffre_affaires: 850000,
      ventes_encaissees: 720000,
      depenses: 125000,
      ipm_a_recevoir: 180000,
      credits_a_recevoir: 45000,
      solde: 595000,
    },
  ]
}

export function getMockStockInventory(): StockQuantity[] {
  return mockProducts.map((p) => ({
    product_id: p.id,
    product_code: p.code,
    product_name: p.name,
    category: p.category,
    unit_price: p.unit_price,
    purchase_price: p.purchase_price,
    current_stock: mockStockQuantities.get(p.id) || 0,
    total_in: (mockStockQuantities.get(p.id) || 0) + 50,
    total_out: 50,
    stock_value: (mockStockQuantities.get(p.id) || 0) * p.purchase_price,
  }))
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================
export function addPatient(patient: Omit<Patient, "id">): Patient {
  const newPatient: Patient = {
    ...patient,
    id: generatePatientId(),
  }
  mockPatients.push(newPatient)
  return newPatient
}

export function getPatientById(id: string): Patient | undefined {
  return mockPatients.find((p) => p.id === id)
}

export function getProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id)
}

export function getIpmById(id: string): Ipm | undefined {
  return mockIpms.find((i) => i.id === id)
}

export function getIpmPatientById(id: string): IpmPatient | undefined {
  return mockIpmPatients.find((ip) => ip.id === id)
}

// =====================================================
// ALERT SYSTEM (mock)
// =====================================================
export interface Alert {
  id: string
  type: "low_stock" | "expired" | "expiring_soon" | "stock_loss" | "stock_entry"
  product_id: string
  product_name: string
  message: string
  severity: "warning" | "critical" | "info"
  created_at: string
}

export function generateAlerts(): Alert[] {
  const alerts: Alert[] = []
  const today = new Date()

  mockProducts.forEach((product) => {
    const stock = mockStockQuantities.get(product.id) || 0
    const expiryDate = mockProductExpirationDates.get(product.id)

    // Check for low stock or negative stock
    if (stock < 0) {
      alerts.push({
        id: `alert-negative-${product.id}`,
        type: "low_stock",
        product_id: product.id,
        product_name: product.name,
        message: `Stock négatif: ${stock} unités`,
        severity: "critical",
        created_at: new Date().toISOString(),
      })
    } else if (stock <= LOW_STOCK_THRESHOLD && stock > 0) {
      alerts.push({
        id: `alert-low-${product.id}`,
        type: "low_stock",
        product_id: product.id,
        product_name: product.name,
        message: `Stock faible: ${stock} unités`,
        severity: "warning",
        created_at: new Date().toISOString(),
      })
    }

    // Check for expired products
    if (expiryDate) {
      const expDate = new Date(expiryDate)
      if (expDate < today) {
        alerts.push({
          id: `alert-expired-${product.id}`,
          type: "expired",
          product_id: product.id,
          product_name: product.name,
          message: `Produit périmé depuis le ${expiryDate}`,
          severity: "critical",
          created_at: new Date().toISOString(),
        })
      } else {
        // Check for expiring soon (within EXPIRY_WARNING_DAYS)
        const daysUntilExpiry = Math.floor((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        if (daysUntilExpiry <= EXPIRY_WARNING_DAYS && daysUntilExpiry > 0) {
          alerts.push({
            id: `alert-expiring-${product.id}`,
            type: "expiring_soon",
            product_id: product.id,
            product_name: product.name,
            message: `Expiration dans ${daysUntilExpiry} jours (${expiryDate})`,
            severity: "warning",
            created_at: new Date().toISOString(),
          })
        }
      }
    }
  })

  // Add alerts for recent stock losses
  const recentLosses = mockStockLosses.filter((loss) => {
    const lossDate = new Date(loss.loss_date)
    const daysDiff = Math.floor((today.getTime() - lossDate.getTime()) / (1000 * 60 * 60 * 24))
    return daysDiff <= 7 // Last 7 days
  })

  recentLosses.forEach((loss) => {
    alerts.push({
      id: `alert-loss-${loss.id}`,
      type: "stock_loss",
      product_id: loss.product_id,
      product_name: loss.product_name,
      message: `Perte ${loss.reason.toLowerCase()}: ${loss.quantity_lost} unités`,
      severity: "warning",
      created_at: new Date().toISOString(),
    })
  })

  return alerts
}

// =====================================================
// STOCK MANAGEMENT HELPERS
// =====================================================
export function getStockQuantity(productId: string): number {
  return mockStockQuantities.get(productId) || 0
}

export function updateStockQuantity(productId: string, quantity: number): void {
  mockStockQuantities.set(productId, quantity)
}

export function addToStock(productId: string, quantity: number): number {
  const current = getStockQuantity(productId)
  const newQuantity = current + quantity
  updateStockQuantity(productId, newQuantity)
  return newQuantity
}

export function removeFromStock(productId: string, quantity: number): number {
  const current = getStockQuantity(productId)
  const newQuantity = current - quantity
  updateStockQuantity(productId, newQuantity)
  return newQuantity
}

export function getProductExpiryDate(productId: string): string | undefined {
  return mockProductExpirationDates.get(productId)
}

export function setProductExpiryDate(productId: string, expiryDate: string): void {
  mockProductExpirationDates.set(productId, expiryDate)
}

// =====================================================
// CASH REGISTER MANAGEMENT (mock)
// =====================================================

// Mock cash registers
export const mockCashRegisters: CashRegister[] = [
  {
    id: "register-1",
    register_number: "REG-001",
    name: "Caisse principale",
    pharmacy_id: currentPharmacy.id,
    managers: [currentUser.username],
    opened_at: new Date().toISOString(),
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "register-2",
    register_number: "REG-002",
    name: "Caisse secondaire",
    pharmacy_id: currentPharmacy.id,
    managers: ["manager2"],
    opened_at: new Date().toISOString(),
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "register-3",
    register_number: "REG-003",
    name: "Caisse consultation",
    pharmacy_id: currentPharmacy.id,
    managers: ["pharmacist1"],
    opened_at: new Date().toISOString(),
    is_active: true,
    created_at: new Date().toISOString(),
  },
]

// Sales history records
export const mockSalesHistory: SalesHistoryRecord[] = []

// Cash register sessions
export const mockCashSessions: CashRegisterSession[] = [
  {
    id: "session-1",
    register_id: "register-1",
    register_number: "REG-001",
    opened_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    opened_by: "pharmacien",
    closed_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    closed_by: "pharmacien",
    opening_balance: 100000,
    closing_balance: 350000,
    status: "closed",
  },
  {
    id: "session-2",
    register_id: "register-1",
    register_number: "REG-001",
    opened_at: new Date().toISOString(),
    opened_by: "pharmacien",
    opening_balance: 350000,
    status: "open",
  },
]

// Cash movements
export const mockCashMovements: CashMovement[] = [
  {
    id: "move-1",
    session_id: "session-2",
    type: "opening",
    payment_method: "CASH",
    amount: 350000,
    description: "Solde initial de caisse",
    timestamp: new Date().toISOString(),
    created_by: "pharmacien",
  },
]

// Cash summaries
export const mockCashSummaries: CashSummary[] = []

// =====================================================
// CASH REGISTER HELPERS
// =====================================================
export function getActiveCashRegisters(): CashRegister[] {
  return mockCashRegisters.filter((r) => r.is_active)
}

export function getCashRegisterById(registerId: string): CashRegister | undefined {
  return mockCashRegisters.find((r) => r.id === registerId)
}

export function getDefaultCashRegister(): CashRegister | undefined {
  return mockCashRegisters[0]
}

export function generateCashRegisterId(): string {
  return `register-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// =====================================================
// SALES HISTORY HELPERS
// =====================================================
export function createSalesHistoryRecord(
  sale: Sale,
  registerId: string,
  invoiceNumber?: string,
): SalesHistoryRecord {
  const register = getCashRegisterById(registerId)
  const patient = sale.patient_id ? getPatientById(sale.patient_id) : null
  const saleItems = mockSaleItems.filter((item) => item.sale_id === sale.id)

  const record: SalesHistoryRecord = {
    id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    sale_id: sale.id,
    sale_number: sale.sale_number,
    register_id: registerId,
    register_number: register?.register_number || "UNKNOWN",
    patient_code: patient?.id || "COMPTANT",
    patient_first_name: patient?.first_name || "Comptant",
    patient_last_name: patient?.last_name || "",
    client_type: sale.client_type,
    products_sold: saleItems.map((item) => ({
      product_name: item.product_name || "Unknown",
      product_code: item.product_code,
      quantity: item.quantity,
    })),
    subtotal: sale.subtotal,
    discount_amount: sale.discount_amount,
    total_amount: sale.total_amount,
    amount_paid: sale.amount_paid,
    payment_method: sale.payment_method,
    invoice_number: invoiceNumber,
    sale_date: sale.sale_date,
    timestamp: sale.created_at,
    created_by: sale.created_by || currentUser.username,
  }

  return record
}

export function addToSalesHistory(record: SalesHistoryRecord): void {
  mockSalesHistory.push(record)
}

export function getSalesHistory(): SalesHistoryRecord[] {
  return mockSalesHistory
}

export function getSalesHistoryByRegister(registerId: string): SalesHistoryRecord[] {
  return mockSalesHistory.filter((record) => record.register_id === registerId)
}

export function searchSalesHistoryByPatient(searchTerm: string): SalesHistoryRecord[] {
  const term = searchTerm.toLowerCase()
  return mockSalesHistory.filter(
    (record) =>
      record.patient_code.toLowerCase().includes(term) ||
      record.patient_first_name.toLowerCase().includes(term) ||
      record.patient_last_name.toLowerCase().includes(term),
  )
}

export function getSalesHistoryByDate(dateStr: string): SalesHistoryRecord[] {
  return mockSalesHistory.filter((record) => record.sale_date === dateStr)
}

// =====================================================
// STOCK ENTRIES MANAGEMENT (mock)
// =====================================================
export const mockStockEntries: StockEntry[] = []

export function addStockEntry(
  productId: string,
  productName: string,
  quantityReceived: number,
  unitPrice: number,
  supplier?: string,
  invoiceNumber?: string,
  entryDate?: string,
): StockEntry {
  const product = getProductById(productId)
  const entry: StockEntry = {
    id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    product_id: productId,
    product_code: product?.code,
    product_name: productName || product?.name || "Unknown",
    quantity_received: quantityReceived,
    unit_price: unitPrice,
    supplier,
    invoice_number: invoiceNumber,
    entry_date: entryDate || new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
  }

  mockStockEntries.push(entry)

  // Update mock stock
  const currentStock = mockStockQuantities.get(productId) || 0
  mockStockQuantities.set(productId, currentStock + quantityReceived)

  return entry
}

export function getStockEntries(): StockEntry[] {
  return mockStockEntries
}

export function getStockEntriesByProduct(productId: string): StockEntry[] {
  return mockStockEntries.filter((entry) => entry.product_id === productId)
}

// =====================================================
// STOCK LOSSES MANAGEMENT (mock)
// =====================================================
export const mockStockLosses: StockLoss[] = []

export function addStockLoss(
  productId: string,
  productName: string,
  quantityLost: number,
  reason: LossReason,
  notes?: string,
  lossDate?: string,
): StockLoss {
  const product = getProductById(productId)
  const loss: StockLoss = {
    id: `loss-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    product_id: productId,
    product_code: product?.code,
    product_name: productName || product?.name || "Unknown",
    quantity_lost: quantityLost,
    reason,
    notes,
    loss_date: lossDate || new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
  }

  mockStockLosses.push(loss)

  // Update mock stock
  const currentStock = mockStockQuantities.get(productId) || 0
  mockStockQuantities.set(productId, currentStock - quantityLost)

  return loss
}

export function getStockLosses(): StockLoss[] {
  return mockStockLosses
}

export function getStockLossesByProduct(productId: string): StockLoss[] {
  return mockStockLosses.filter((loss) => loss.product_id === productId)
}

// =====================================================
// IPM RECEIVABLES MANAGEMENT (mock)
// =====================================================
export const mockIpmReceivables: Map<string, IpmReceivable> = new Map()

export function calculateIpmReceivables(): IpmReceivable[] {
  const receivablesMap = new Map<string, IpmReceivable>()

  // Calculate from sales with IPM client type
  mockSales.forEach((sale) => {
    if (sale.client_type === "IPM_MUTUELLE" && sale.ipm_id) {
      const ipm = getIpmById(sale.ipm_id)
      if (!ipm) return

      const key = sale.ipm_id
      let receivable = receivablesMap.get(key)

      if (!receivable) {
        receivable = {
          id: `receivable-${sale.ipm_id}-${Date.now()}`,
          ipm_id: sale.ipm_id,
          ipm_name: ipm.name,
          amount_due: 0,
          amount_paid: 0,
          balance: 0,
          sale_ids: [],
          claim_ids: [],
          status: "pending" as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      }

      receivable.amount_due += sale.ipm_coverage_amount
      receivable.balance = receivable.amount_due - receivable.amount_paid
      receivable.sale_ids.push(sale.id)

      if (receivable.amount_paid > 0) {
        receivable.status = "partial"
      } else if (receivable.balance === 0) {
        receivable.status = "paid"
      }

      receivablesMap.set(key, receivable)
    }
  })

  return Array.from(receivablesMap.values())
}

export function getIpmReceivables(): IpmReceivable[] {
  return calculateIpmReceivables()
}

export function getIpmReceivableByIpmId(ipmId: string): IpmReceivable | undefined {
  return calculateIpmReceivables().find((r) => r.ipm_id === ipmId)
}

export function getTotalIpmReceivables(): number {
  return calculateIpmReceivables().reduce((sum, r) => sum + r.balance, 0)
}

// =====================================================
// EXCEL IMPORT MANAGEMENT (mock)
// =====================================================
import type { ExcelProductRow, ImportResult } from "./excel-import"

export function importExcelProducts(products: ExcelProductRow[]): ImportResult {
  const result: ImportResult = {
    success: true,
    created: 0,
    updated: 0,
    errors: [],
    products: [],
  }

  products.forEach((excelProduct) => {
    try {
      // Check if product already exists by code or name
      const existingProduct = mockProducts.find(
        (p) =>
          (excelProduct.code && p.code === excelProduct.code) ||
          p.name.toLowerCase() === excelProduct.name.toLowerCase(),
      )

      if (existingProduct) {
        // Update existing product
        existingProduct.unit_price = excelProduct.unit_price
        existingProduct.purchase_price = excelProduct.purchase_price || excelProduct.unit_price
        existingProduct.category = excelProduct.category || existingProduct.category

        // Update stock
        const currentStock = mockStockQuantities.get(existingProduct.id) || 0
        mockStockQuantities.set(existingProduct.id, currentStock + excelProduct.quantity)

        result.updated++
        result.products.push({
          code: existingProduct.code,
          name: existingProduct.name,
          status: "updated",
          quantity: excelProduct.quantity,
          unit_price: excelProduct.unit_price,
        })
      } else {
        // Create new product
        const newProductId = `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const newProduct: Product = {
          id: newProductId,
          code: excelProduct.code || `GEN-${Date.now()}`,
          name: excelProduct.name,
          unit_price: excelProduct.unit_price,
          purchase_price: excelProduct.purchase_price || excelProduct.unit_price,
          category: excelProduct.category || "Sans catégorie",
          is_active: true,
          created_at: new Date().toISOString(),
        }

        mockProducts.push(newProduct)

        // Add stock
        mockStockQuantities.set(newProductId, excelProduct.quantity)

        result.created++
        result.products.push({
          code: newProduct.code,
          name: newProduct.name,
          status: "created",
          quantity: excelProduct.quantity,
          unit_price: excelProduct.unit_price,
        })
      }
    } catch (error) {
      result.errors.push(`Erreur avec le produit "${excelProduct.name}": ${error instanceof Error ? error.message : String(error)}`)
    }
  })

  return result
}
