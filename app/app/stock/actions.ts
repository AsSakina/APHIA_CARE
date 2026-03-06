"use server"

import type { StockEntry, StockLoss, LossReason } from "@/lib/types"
import {
  addStockEntry,
  getStockEntries,
  getStockEntriesByProduct,
  addStockLoss,
  getStockLosses,
  getStockLossesByProduct,
  getProductById,
  mockStockQuantities,
} from "@/lib/mock-data"
import { revalidatePath } from "next/cache"

// =====================================================
// STOCK ENTRIES ACTIONS
// =====================================================

export async function createStockEntry(
  productId: string,
  productName: string,
  quantityReceived: number,
  unitPrice: number,
  supplier?: string,
  invoiceNumber?: string,
  entryDate?: string,
): Promise<{ success: boolean; entry?: StockEntry; error?: string }> {
  try {
    if (!productId || quantityReceived <= 0) {
      return { success: false, error: "Données invalides" }
    }

    const entry = addStockEntry(productId, productName, quantityReceived, unitPrice, supplier, invoiceNumber, entryDate)

    revalidatePath("/app/stock")
    revalidatePath("/app/stock/movements")
    return { success: true, entry }
  } catch (error) {
    console.error("Create stock entry error:", error)
    return { success: false, error: "Erreur lors de la création de l'entrée" }
  }
}

export async function fetchStockEntries(): Promise<StockEntry[]> {
  try {
    return getStockEntries()
  } catch (error) {
    console.error("Fetch stock entries error:", error)
    return []
  }
}

export async function fetchStockEntriesByProduct(productId: string): Promise<StockEntry[]> {
  try {
    return getStockEntriesByProduct(productId)
  } catch (error) {
    console.error("Fetch product entries error:", error)
    return []
  }
}

// =====================================================
// STOCK LOSSES ACTIONS
// =====================================================

export async function createStockLoss(
  productId: string,
  productName: string,
  quantityLost: number,
  reason: LossReason,
  notes?: string,
  lossDate?: string,
): Promise<{ success: boolean; loss?: StockLoss; error?: string }> {
  try {
    if (!productId || quantityLost <= 0) {
      return { success: false, error: "Données invalides" }
    }

    const loss = addStockLoss(productId, productName, quantityLost, reason, notes, lossDate)

    revalidatePath("/app/stock")
    revalidatePath("/app/stock/movements")
    return { success: true, loss }
  } catch (error) {
    console.error("Create stock loss error:", error)
    return { success: false, error: "Erreur lors de la création de la perte" }
  }
}

export async function fetchStockLosses(): Promise<StockLoss[]> {
  try {
    return getStockLosses()
  } catch (error) {
    console.error("Fetch stock losses error:", error)
    return []
  }
}

export async function fetchStockLossesByProduct(productId: string): Promise<StockLoss[]> {
  try {
    return getStockLossesByProduct(productId)
  } catch (error) {
    console.error("Fetch product losses error:", error)
    return []
  }
}

// =====================================================
// INVENTORY ADJUSTMENT
// =====================================================

export async function adjustStockQuantity(
  productId: string,
  newQuantity: number,
): Promise<{ success: boolean; newQuantity?: number; error?: string }> {
  try {
    const product = getProductById(productId)
    if (!product) {
      return { success: false, error: "Produit non trouvé" }
    }

    mockStockQuantities.set(productId, newQuantity)

    revalidatePath("/app/stock")
    return { success: true, newQuantity }
  } catch (error) {
    console.error("Adjust stock error:", error)
    return { success: false, error: "Erreur lors de l'ajustement du stock" }
  }
}

export async function getStockQuantity(productId: string): Promise<number> {
  try {
    return mockStockQuantities.get(productId) || 0
  } catch (error) {
    console.error("Get stock quantity error:", error)
    return 0
  }
}

// =====================================================
// STOCK STATUS & ALERTS
// =====================================================

export async function getStockStatus() {
  const stocks = getProductById("") ? [] : [] // Initialize empty
  
  const allProducts = await Promise.all(
    Array.from({ length: 10 }, (_, i) => getProductById(`prod-${i + 1}`))
  ).then((products) => products.filter(Boolean))

  const stockData = allProducts.map((product: any) => {
    const quantity = mockStockQuantities.get(product.id) || 0
    return {
      id: product.id,
      name: product.name,
      dosage: product.dosage,
      quantity,
      status: quantity === 0 ? "out" : quantity < 10 ? "low" : "ok",
    }
  })

  const lowStockCount = stockData.filter((s) => s.status === "low").length
  const outOfStockCount = stockData.filter((s) => s.status === "out").length
  const totalQuantity = stockData.reduce((sum: number, s) => sum + s.quantity, 0)

  return {
    stocks: stockData,
    summary: {
      totalQuantity,
      lowStockCount,
      outOfStockCount,
      totalProducts: stockData.length,
    },
  }
}

export async function getStockAlerts() {
  const allProducts = await Promise.all(
    Array.from({ length: 10 }, (_, i) => getProductById(`prod-${i + 1}`))
  ).then((products) => products.filter(Boolean))

  const alerts = allProducts
    .map((product: any) => {
      const quantity = mockStockQuantities.get(product.id) || 0

      if (quantity === 0) {
        return {
          id: `alert-${product.id}`,
          product_id: product.id,
          product_name: product.name,
          type: "out_of_stock",
          severity: "critical",
          message: "Produit en rupture de stock",
          quantity,
          created_at: new Date().toISOString(),
        }
      }

      if (quantity < 10) {
        return {
          id: `alert-${product.id}`,
          product_id: product.id,
          product_name: product.name,
          type: "low_stock",
          severity: "warning",
          message: `Stock faible (${quantity} unités)`,
          quantity,
          created_at: new Date().toISOString(),
        }
      }

      return null
    })
    .filter(Boolean)

  return alerts
}
