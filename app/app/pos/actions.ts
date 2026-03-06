"use server"

import { revalidatePath } from "next/cache"
import type {
  Cart,
  CartItem,
  Patient,
  Product,
  Ipm,
  IpmPatient,
  Sale,
  SaleItem,
  ClientType,
  PaymentSplit,
  DiscountType,
  PaymentMethod,
} from "@/lib/types"
import {
  mockPatients,
  mockProducts,
  mockIpms,
  mockIpmPatients,
  mockCarts,
  mockCartItems,
  mockSales,
  mockSaleItems,
  mockStockQuantities,
  generateCartNumber,
  generateCartName,
  generateSaleNumber,
  generateCartId,
  generateCartItemId,
  generateSaleId,
  getProductById,
  getIpmById,
  getIpmPatientById,
  getPatientById,
  currentPharmacy,
  currentUser,
  getDefaultCashRegister,
  createSalesHistoryRecord,
  addToSalesHistory,
} from "@/lib/mock-data"
import { createClient } from "@supabase/supabase-js"

// =====================================================
// CART ACTIONS
// =====================================================

export async function createCart(clientType: ClientType = "COMPTANT") {
  try {
    const cartNumber = generateCartNumber()
    const cartId = generateCartId()
    const now = new Date().toISOString()
    
    // Generate intelligent name with user info
    const cartName = generateCartName(clientType, currentUser?.id, currentUser?.name)

    const newCart: Cart = {
      id: cartId,
      cart_number: cartNumber,
      name: cartName,
      client_type: clientType,
      user_id: currentUser?.id,
      user_name: currentUser?.name,
      status: "ACTIVE",
      subtotal: 0,
      discount_amount: 0,
      discount_percentage: 0,
      discount_type: "FIXED",
      total_amount: 0,
      ipm_coverage_rate: 0,
      ipm_coverage_amount: 0,
      patient_amount: 0,
      created_at: now,
      updated_at: now,
    }

    mockCarts.push(newCart)
    revalidatePath("/app/pos")
    return { success: true, cart: newCart }
  } catch (error) {
    console.error("Create cart error:", error)
    return { success: false, error: "Erreur lors de la création du panier" }
  }
}

export async function getActiveCart(cartId?: string): Promise<Cart | undefined> {
  try {
    if (cartId) {
      const cart = mockCarts.find((c) => c.id === cartId && c.status === "ACTIVE")
      if (cart) {
        // Enrich with patient/ipm names
        if (cart.patient_id) {
          const patient = getPatientById(cart.patient_id)
          if (patient) {
            cart.patient_name = `${patient.first_name} ${patient.last_name}`
          }
        }
        if (cart.ipm_id) {
          const ipm = getIpmById(cart.ipm_id)
          if (ipm) {
            cart.ipm_name = ipm.name
          }
        }
      }
      return cart
    }
    return undefined
  } catch (error) {
    console.error("Get cart error:", error)
    return undefined
  }
}

export async function getActiveCarts(): Promise<Cart[]> {
  try {
    const activeCarts = mockCarts.filter((c) => c.status === "ACTIVE")
    return activeCarts.map((cart) => {
      const items = mockCartItems.filter((i) => i.cart_id === cart.id)
      return {
        ...cart,
        item_count: items.length,
        total_items: items.reduce((sum, i) => sum + i.quantity, 0),
        patient_name: cart.patient_id
          ? (() => {
              const p = getPatientById(cart.patient_id)
              return p ? `${p.first_name} ${p.last_name}` : undefined
            })()
          : undefined,
        ipm_name: cart.ipm_id ? getIpmById(cart.ipm_id)?.name : undefined,
      }
    })
  } catch (error) {
    console.error("Get carts error:", error)
    return []
  }
}

function recalculateCart(cartId: string) {
  const cart = mockCarts.find((c) => c.id === cartId)
  if (!cart) return

  const items = mockCartItems.filter((i) => i.cart_id === cartId)
  const subtotal = items.reduce((sum, i) => sum + i.line_total, 0)

  const actualDiscount =
    cart.discount_type === "PERCENTAGE"
      ? Math.round((subtotal * cart.discount_percentage) / 100)
      : cart.discount_amount

  const total = subtotal - actualDiscount
  const ipmAmount =
    cart.client_type === "IPM_MUTUELLE" ? Math.round((total * cart.ipm_coverage_rate) / 100) : 0
  const patientAmount = cart.client_type === "PROFORMA" ? 0 : total - ipmAmount

  cart.subtotal = subtotal
  cart.total_amount = total
  cart.ipm_coverage_amount = ipmAmount
  cart.patient_amount = patientAmount
  cart.updated_at = new Date().toISOString()
}

export async function updateCartClient(
  cartId: string,
  clientType: ClientType,
  patientId?: string,
  ipmId?: string,
  ipmPatientId?: string,
) {
  try {
    const cart = mockCarts.find((c) => c.id === cartId)
    if (!cart) {
      return { success: false, error: "Panier non trouvé" }
    }

    let coverageRate = 0
    if (clientType === "IPM_MUTUELLE" && ipmId) {
      if (ipmPatientId) {
        const ipmPatient = getIpmPatientById(ipmPatientId)
        coverageRate = ipmPatient?.effective_rate || ipmPatient?.coverage_rate || 0
      } else {
        const ipm = getIpmById(ipmId)
        coverageRate = ipm?.coverage_rate || 0
      }
    }

    cart.client_type = clientType
    cart.patient_id = patientId
    cart.ipm_id = ipmId
    cart.ipm_patient_id = ipmPatientId
    cart.ipm_coverage_rate = coverageRate

    recalculateCart(cartId)
    revalidatePath("/app/pos")
    return { success: true }
  } catch (error) {
    console.error("Update cart client error:", error)
    return { success: false, error: "Erreur lors de la mise à jour du client" }
  }
}

export async function updateCartDiscount(
  cartId: string,
  discountAmount: number,
  discountPercentage = 0,
  discountType: DiscountType = "FIXED",
) {
  try {
    const cart = mockCarts.find((c) => c.id === cartId)
    if (!cart) {
      return { success: false, error: "Panier non trouvé" }
    }

    cart.discount_amount = discountAmount
    cart.discount_percentage = discountPercentage
    cart.discount_type = discountType

    recalculateCart(cartId)
    revalidatePath("/app/pos")
    return { success: true }
  } catch (error) {
    console.error("Update discount error:", error)
    return { success: false, error: "Erreur lors de la mise à jour de la remise" }
  }
}

export async function cancelCart(cartId: string) {
  try {
    const cart = mockCarts.find((c) => c.id === cartId)
    if (cart) {
      cart.status = "CANCELLED"
      cart.updated_at = new Date().toISOString()
    }
    revalidatePath("/app/pos")
    return { success: true }
  } catch (error) {
    console.error("Cancel cart error:", error)
    return { success: false, error: "Erreur lors de l'annulation du panier" }
  }
}

// =====================================================
// CART ITEMS ACTIONS
// =====================================================

export async function getCartItems(cartId: string): Promise<CartItem[]> {
  try {
    const items = mockCartItems.filter((i) => i.cart_id === cartId)
    return items.map((item) => {
      const product = getProductById(item.product_id)
      return {
        ...item,
        product_name: product?.name,
        product_code: product?.code,
      }
    })
  } catch (error) {
    console.error("Get cart items error:", error)
    return []
  }
}

export async function addCartItem(cartId: string, productId: string, quantity = 1, isUnitSale = false) {
  try {
    const product = getProductById(productId)
    if (!product) {
      return { success: false, error: "Produit non trouvé" }
    }

    const unitPrice = product.unit_price
    const lineTotal = unitPrice * quantity

    const existing = mockCartItems.find(
      (i) => i.cart_id === cartId && i.product_id === productId && i.is_unit_sale === isUnitSale,
    )

    if (existing) {
      existing.quantity += quantity
      existing.line_total = existing.unit_price * existing.quantity
    } else {
      const newItem: CartItem = {
        id: generateCartItemId(),
        cart_id: cartId,
        product_id: productId,
        quantity,
        is_unit_sale: isUnitSale,
        unit_price: unitPrice,
        line_total: lineTotal,
      }
      mockCartItems.push(newItem)
    }

    recalculateCart(cartId)
    revalidatePath("/app/pos")
    return { success: true }
  } catch (error) {
    console.error("Add cart item error:", error)
    return { success: false, error: "Erreur lors de l'ajout du produit" }
  }
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  try {
    if (quantity <= 0) {
      return removeCartItem(itemId)
    }

    const item = mockCartItems.find((i) => i.id === itemId)
    if (!item) {
      return { success: false, error: "Article non trouvé" }
    }

    item.quantity = quantity
    item.line_total = item.unit_price * quantity

    recalculateCart(item.cart_id)
    revalidatePath("/app/pos")
    return { success: true }
  } catch (error) {
    console.error("Update item quantity error:", error)
    return { success: false, error: "Erreur lors de la mise à jour de la quantité" }
  }
}

export async function removeCartItem(itemId: string) {
  try {
    const index = mockCartItems.findIndex((i) => i.id === itemId)
    if (index > -1) {
      const item = mockCartItems[index]
      mockCartItems.splice(index, 1)
      recalculateCart(item.cart_id)
    }
    revalidatePath("/app/pos")
    return { success: true }
  } catch (error) {
    console.error("Remove cart item error:", error)
    return { success: false, error: "Erreur lors de la suppression de l'article" }
  }
}

// =====================================================
// PRODUCT SEARCH BY BARCODE (for POS scanner)
// =====================================================

export async function searchProductByBarcode(barcode: string): Promise<Product | undefined> {
  try {
    const normalizedBarcode = barcode.trim().toLowerCase()
    return mockProducts.find(
      (p) =>
        p.is_active &&
        (p.barcode?.toLowerCase() === normalizedBarcode ||
          p.code?.toLowerCase() === normalizedBarcode),
    )
  } catch (error) {
    console.error("Search product by barcode error:", error)
    return undefined
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const lowerQuery = query.toLowerCase()
    return mockProducts.filter(
      (p) =>
        p.is_active &&
        (p.name.toLowerCase().includes(lowerQuery) ||
          p.code?.toLowerCase().includes(lowerQuery) ||
          p.category?.toLowerCase().includes(lowerQuery)),
    )
  } catch (error) {
    console.error("Search products error:", error)
    return []
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    return mockProducts.filter((p) => p.is_active)
  } catch (error) {
    console.error("Get products error:", error)
    return []
  }
}

// =====================================================
// CLIENT SEARCH
// =====================================================

// =====================================================
// CLIENT SEARCH (Using Supabase)
// =====================================================

export async function searchPatients(query: string): Promise<Patient[]> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    )

    // Search in patients table (now in Supabase)
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .is("deleted_at", null)
      .or(
        `first_name.ilike.%${query}%,last_name.ilike.%${query}%,phone.eq.${query}`,
      )
      .limit(10)

    if (error) {
      console.error("[v0] Search patients error:", error)
      return []
    }

    return data as Patient[]
  } catch (error) {
    console.error("[v0] Search patients error:", error)
    return []
  }
}

export async function getActiveIpms(): Promise<Ipm[]> {
  try {
    return mockIpms.filter((i) => i.is_active)
  } catch (error) {
    console.error("Get IPMs error:", error)
    return []
  }
}

export async function getIpmPatients(ipmId: string): Promise<IpmPatient[]> {
  try {
    return mockIpmPatients.filter((ip) => ip.ipm_id === ipmId && ip.is_active)
  } catch (error) {
    console.error("Get IPM patients error:", error)
    return []
  }
}

export async function searchIpmPatientsByCode(code: string, ipmId?: string): Promise<IpmPatient[]> {
  try {
    const lowerCode = code.toLowerCase()
    return mockIpmPatients.filter((ip) => {
      const matchesCode = ip.membership_number.toLowerCase().includes(lowerCode)
      const matchesIpm = ipmId ? ip.ipm_id === ipmId : true
      return ip.is_active && matchesCode && matchesIpm
    })
  } catch (error) {
    console.error("Search IPM patients by code error:", error)
    return []
  }
}

// =====================================================
// SALE VALIDATION
// =====================================================

export async function validateCart(
  cartId: string,
  paymentMethod: PaymentMethod,
  amountPaid: number,
  toleranceAmount = 0,
  _paymentReference?: string,
) {
  try {
    const cart = mockCarts.find((c) => c.id === cartId && c.status === "ACTIVE")
    if (!cart) {
      return { success: false, error: "Panier non trouvé ou déjà validé" }
    }

    const isProforma = cart.client_type === "PROFORMA"
    const saleNumber = generateSaleNumber()
    const saleId = generateSaleId()
    const now = new Date().toISOString()

    // Create sale
    const sale: Sale = {
      id: saleId,
      sale_number: saleNumber,
      cart_id: cartId,
      client_type: cart.client_type,
      patient_id: cart.patient_id,
      ipm_id: cart.ipm_id,
      subtotal: cart.subtotal,
      discount_amount: cart.discount_amount,
      tolerance_amount: toleranceAmount,
      total_amount: cart.total_amount,
      ipm_coverage_amount: cart.ipm_coverage_amount,
      patient_amount: cart.patient_amount,
      amount_paid: isProforma ? 0 : amountPaid,
      payment_method: paymentMethod,
      sale_date: now.split("T")[0],
      is_proforma: isProforma,
      created_at: now,
      items: [],
    }

    // Create sale items from cart items
    const cartItems = mockCartItems.filter((i) => i.cart_id === cartId)
    for (const item of cartItems) {
      const product = getProductById(item.product_id)
      const saleItem = {
        id: `sale-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sale_id: saleId,
        product_id: item.product_id,
        product_name: product?.name,
        product_code: product?.code,
        quantity: item.quantity,
        is_unit_sale: item.is_unit_sale,
        unit_price: item.unit_price,
        unit_cost: product?.purchase_price || 0,
        line_total: item.line_total,
      }
      mockSaleItems.push(saleItem)
      sale.items?.push(saleItem)

      // Update stock (reduce)
      if (!isProforma) {
        const currentStock = mockStockQuantities.get(item.product_id) || 0
        mockStockQuantities.set(item.product_id, currentStock - item.quantity)
      }
    }

    mockSales.push(sale)

    // Create sales history record
    const cashRegister = getDefaultCashRegister()
    if (cashRegister) {
      const historyRecord = createSalesHistoryRecord(sale, cashRegister.id)
      addToSalesHistory(historyRecord)
    }

    // Update cart status
    cart.status = "VALIDATED"
    cart.updated_at = now

    revalidatePath("/app/pos")
    revalidatePath("/app/sales")
    return { success: true, saleId, saleNumber }
  } catch (error) {
    console.error("Validate cart error:", error)
    return { success: false, error: "Erreur lors de la validation du panier" }
  }
}

// =====================================================
// VALIDATE CART WITH MULTIPLE PAYMENT METHODS
// =====================================================

export async function validateCartWithPaymentSplits(
  cartId: string,
  paymentSplits: PaymentSplit[],
  toleranceAmount = 0,
) {
  try {
    const cart = mockCarts.find((c) => c.id === cartId && c.status === "ACTIVE")
    if (!cart) {
      return { success: false, error: "Panier non trouvé ou déjà validé" }
    }

    const isProforma = cart.client_type === "PROFORMA"
    const saleNumber = generateSaleNumber()
    const saleId = generateSaleId()
    const now = new Date().toISOString()

    // Calculate total paid from splits
    const totalPaid = paymentSplits.reduce((sum, split) => sum + split.amount, 0)

    // Determine primary payment method
    const primaryPaymentMethod = paymentSplits.length === 1 ? paymentSplits[0].method : ("MIXED" as const)

    // Create sale
    const sale: Sale = {
      id: saleId,
      sale_number: saleNumber,
      cart_id: cartId,
      client_type: cart.client_type,
      patient_id: cart.patient_id,
      ipm_id: cart.ipm_id,
      subtotal: cart.subtotal,
      discount_amount: cart.discount_amount,
      tolerance_amount: toleranceAmount,
      total_amount: cart.total_amount,
      ipm_coverage_amount: cart.ipm_coverage_amount,
      patient_amount: cart.patient_amount,
      amount_paid: isProforma ? 0 : Math.min(totalPaid, cart.patient_amount),
      payment_method: primaryPaymentMethod,
      payment_splits: paymentSplits,
      sale_date: now.split("T")[0],
      is_proforma: isProforma,
      created_at: now,
      items: [],
    }

    // Create sale items from cart items
    const cartItems = mockCartItems.filter((i) => i.cart_id === cartId)
    for (const item of cartItems) {
      const product = getProductById(item.product_id)
      const saleItem = {
        id: `sale-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sale_id: saleId,
        product_id: item.product_id,
        product_name: product?.name,
        product_code: product?.code,
        quantity: item.quantity,
        is_unit_sale: item.is_unit_sale,
        unit_price: item.unit_price,
        unit_cost: product?.purchase_price || 0,
        line_total: item.line_total,
      }
      mockSaleItems.push(saleItem)
      sale.items?.push(saleItem)

      // Update stock (reduce) - allows negative stock
      if (!isProforma) {
        const currentStock = mockStockQuantities.get(item.product_id) || 0
        mockStockQuantities.set(item.product_id, currentStock - item.quantity)
      }
    }

    // Add sale to storage
    mockSales.push(sale)

    // Create sales history record
    const cashRegister = getDefaultCashRegister()
    if (cashRegister) {
      const historyRecord = createSalesHistoryRecord(sale, cashRegister.id)
      addToSalesHistory(historyRecord)
    }

    // Update cart status
    cart.status = "VALIDATED"
    cart.updated_at = now

    revalidatePath("/app/pos")
    revalidatePath("/app/sales")
    return { success: true, saleId, saleNumber }
  } catch (error) {
    console.error("Validate cart with payment splits error:", error)
    return { success: false, error: "Erreur lors de la validation du panier" }
  }
}

// =====================================================
// PATIENT CREATION
// =====================================================

export async function createPatient(data: {
  first_name: string
  last_name: string
  phone?: string
  email?: string
  can_receive_credit?: boolean
  credit_limit?: number
}): Promise<{ success: boolean; patient?: Patient; error?: string }> {
  try {
    const newPatient: Patient = {
      id: `patient-${Date.now()}`,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      email: data.email,
      can_receive_credit: data.can_receive_credit || false,
      credit_limit: data.credit_limit || 0,
      current_credit_balance: 0,
    }

    mockPatients.push(newPatient)
    revalidatePath("/app/pos")
    return { success: true, patient: newPatient }
  } catch (error) {
    console.error("Create patient error:", error)
    return { success: false, error: "Erreur lors de la création du patient" }
  }
}

// =====================================================
// INVOICE GENERATION (MOCK)
// =====================================================

export async function generateInvoice(saleId: string): Promise<{
  success: boolean
  invoice?: {
    id: string
    sale_number: string
    date: string
    items: Array<{ name: string; quantity: number; unit_price: number; total: number }>
    subtotal: number
    discount: number
    total: number
    payment_method: string
  }
  error?: string
}> {
  try {
    const sale = mockSales.find((s) => s.id === saleId)
    if (!sale) {
      return { success: false, error: "Vente non trouvée" }
    }

    const items = mockSaleItems.filter((i) => i.sale_id === saleId)

    const invoice = {
      id: `INV-${Date.now()}`,
      sale_number: sale.sale_number,
      date: sale.sale_date,
      items: items.map((i) => ({
        name: i.product_name || "Produit",
        quantity: i.quantity,
        unit_price: i.unit_price,
        total: i.line_total,
      })),
      subtotal: sale.subtotal,
      discount: sale.discount_amount,
      total: sale.total_amount,
      payment_method: sale.payment_method || "CASH",
    }

    return { success: true, invoice }
  } catch (error) {
    console.error("Generate invoice error:", error)
    return { success: false, error: "Erreur lors de la génération de la facture" }
  }
}

// =====================================================
// STOCK MANAGEMENT (after sale)
// =====================================================

/**
 * Decrement stock for each item in a sale
 * Called after payment is validated
 */
export async function decrementStockAfterSale(saleId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const sale = mockSales.find((s) => s.id === saleId)
    if (!sale) {
      return { success: false, error: "Vente non trouvée" }
    }

    const saleItems = mockSaleItems.filter((i) => i.sale_id === saleId)

    console.log("[v0] Decrementing stock for sale:", saleId)
    console.log("[v0] Sale items:", saleItems)

    // Decrement stock for each item
    for (const saleItem of saleItems) {
      const product = getProductById(saleItem.product_id)
      if (product) {
        // Get current stock quantity from Map
        const currentStock = mockStockQuantities.get(product.id) || 0
        const newStock = Math.max(0, currentStock - saleItem.quantity)
        
        // Update the Map
        mockStockQuantities.set(product.id, newStock)
        
        console.log(`[v0] Stock updated: ${product.name} (${product.id}): ${currentStock} → ${newStock}`)
      }
    }

    revalidatePath("/app/stock")
    return { success: true }
  } catch (error) {
    console.error("[v0] Decrement stock after sale error:", error)
    return { success: false, error: "Erreur lors de la mise à jour du stock" }
  }
}

/**
 * Record stock entry (when receiving new products)
 */
export async function recordStockEntry(data: {
  product_id: string
  quantity: number
  reference: string
  notes?: string
}): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const product = getProductById(data.product_id)
    if (!product) {
      return { success: false, error: "Produit non trouvé" }
    }

    // Get current stock and add new quantity
    const currentStock = mockStockQuantities.get(product.id) || 0
    const newStock = currentStock + data.quantity
    
    // Update the Map
    mockStockQuantities.set(product.id, newStock)
    
    console.log(`[v0] Stock entry recorded: ${product.name} (${product.id}): ${currentStock} → ${newStock} (ref: ${data.reference})`)

    revalidatePath("/app/stock")
    return { success: true }
  } catch (error) {
    console.error("[v0] Record stock entry error:", error)
    return { success: false, error: "Erreur lors de l'enregistrement du stock" }
  }
}
