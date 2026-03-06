"use server"

import type { Sale, Ipm, Patient, CashRegister, SalesHistoryRecord } from "@/lib/types"
import {
  mockSales,
  mockSaleItems,
  mockIpms,
  mockPatients,
  getPatientById,
  getIpmById,
  getProductById,
  getActiveCashRegisters,
  getSalesHistory,
  getSalesHistoryByRegister,
  searchSalesHistoryByPatient,
  getCashRegisterById,
} from "@/lib/mock-data"

export async function getSales(filters?: {
  startDate?: string
  endDate?: string
  clientType?: string
  patientId?: string
  ipmId?: string
  isIpm?: boolean
  isProforma?: boolean
}): Promise<Sale[]> {
  try {
    let sales = [...mockSales]

    // Apply filters
    if (filters?.patientId) {
      sales = sales.filter((s) => s.patient_id === filters.patientId)
    }

    if (filters?.ipmId) {
      sales = sales.filter((s) => s.ipm_id === filters.ipmId)
    }

    if (filters?.isIpm === true) {
      sales = sales.filter((s) => s.ipm_id !== null && s.ipm_id !== undefined)
    } else if (filters?.isIpm === false) {
      sales = sales.filter((s) => !s.ipm_id)
    }

    if (filters?.startDate) {
      sales = sales.filter((s) => s.sale_date >= filters.startDate!)
    }

    if (filters?.endDate) {
      sales = sales.filter((s) => s.sale_date <= filters.endDate!)
    }

    // Enrich with patient/ipm names
    return sales.map((sale) => ({
      ...sale,
      patient_name: sale.patient_id
        ? (() => {
            const p = getPatientById(sale.patient_id)
            return p ? `${p.first_name} ${p.last_name}` : undefined
          })()
        : undefined,
      ipm_name: sale.ipm_id ? getIpmById(sale.ipm_id)?.name : undefined,
    }))
  } catch (error) {
    console.error("Get sales error:", error)
    return []
  }
}

export async function getSaleById(saleId: string): Promise<Sale | null> {
  try {
    const sale = mockSales.find((s) => s.id === saleId)
    if (!sale) return null

    const items = mockSaleItems
      .filter((i) => i.sale_id === saleId)
      .map((item) => {
        const product = getProductById(item.product_id)
        return {
          ...item,
          product_name: product?.name,
          product_code: product?.code,
        }
      })

    return {
      ...sale,
      patient_name: sale.patient_id
        ? (() => {
            const p = getPatientById(sale.patient_id)
            return p ? `${p.first_name} ${p.last_name}` : undefined
          })()
        : undefined,
      ipm_name: sale.ipm_id ? getIpmById(sale.ipm_id)?.name : undefined,
      items,
    }
  } catch (error) {
    console.error("Get sale error:", error)
    return null
  }
}

export async function getSalesSummary() {
  try {
    const today = new Date().toISOString().split("T")[0]
    const monthStart = new Date()
    monthStart.setDate(1)
    const monthStartStr = monthStart.toISOString().split("T")[0]

    const todaySales = mockSales.filter((s) => s.sale_date === today && !s.is_proforma)
    const monthSales = mockSales.filter((s) => s.sale_date >= monthStartStr && !s.is_proforma)

    return {
      sales_today: todaySales.length,
      sales_this_month: monthSales.length,
      revenue_today: todaySales.reduce((sum, s) => sum + s.total_amount, 0),
      revenue_this_month: monthSales.reduce((sum, s) => sum + s.total_amount, 0),
      collected_today: todaySales.reduce((sum, s) => sum + s.amount_paid, 0),
      collected_this_month: monthSales.reduce((sum, s) => sum + s.amount_paid, 0),
      discounts_this_month: monthSales.reduce((sum, s) => sum + s.discount_amount, 0),
      ipm_coverage_this_month: monthSales.reduce((sum, s) => sum + s.ipm_coverage_amount, 0),
    }
  } catch (error) {
    console.error("Get sales summary error:", error)
    return null
  }
}

export async function getIpmsForFilter(): Promise<Ipm[]> {
  try {
    return mockIpms.filter((i) => i.is_active)
  } catch (error) {
    console.error("Get IPMs for filter error:", error)
    return []
  }
}

export async function getPatientsForFilter(): Promise<Patient[]> {
  try {
    return mockPatients
  } catch (error) {
    console.error("Get patients for filter error:", error)
    return []
  }
}

// =====================================================
// CASH REGISTER ACTIONS
// =====================================================

export async function getCashRegisters(): Promise<CashRegister[]> {
  try {
    return getActiveCashRegisters()
  } catch (error) {
    console.error("Get cash registers error:", error)
    return []
  }
}

export async function getCashRegister(registerId: string): Promise<CashRegister | null> {
  try {
    const register = getCashRegisterById(registerId)
    return register || null
  } catch (error) {
    console.error("Get cash register error:", error)
    return null
  }
}

// =====================================================
// SALES HISTORY ACTIONS
// =====================================================

export async function getAllSalesHistory(): Promise<SalesHistoryRecord[]> {
  try {
    return getSalesHistory()
  } catch (error) {
    console.error("Get all sales history error:", error)
    return []
  }
}

export async function getSalesHistoryByRegisterId(registerId: string): Promise<SalesHistoryRecord[]> {
  try {
    return getSalesHistoryByRegister(registerId)
  } catch (error) {
    console.error("Get sales history by register error:", error)
    return []
  }
}

export async function searchSalesHistory(searchTerm: string): Promise<SalesHistoryRecord[]> {
  try {
    if (!searchTerm.trim()) {
      return getSalesHistory()
    }
    return searchSalesHistoryByPatient(searchTerm)
  } catch (error) {
    console.error("Search sales history error:", error)
    return []
  }
}
