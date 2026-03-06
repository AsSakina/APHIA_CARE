"use client"

import { forwardRef } from "react"
import type { Sale, SaleItem } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/format"

interface InvoiceTemplateProps {
  sale: Sale & {
    items?: SaleItem[]
    patient_name?: string
    ipm_name?: string
  }
  pharmacyInfo?: {
    name: string
    address: string
    phone: string
    email: string
    nif?: string
    ninea?: string
  }
}

const InvoiceTemplate = forwardRef<HTMLDivElement, InvoiceTemplateProps>(({ sale, pharmacyInfo }, ref) => {
  const defaultPharmacy = {
    name: "Pharmacie APHIA",
    address: "Dakar, Sénégal",
    phone: "+221 XX XXX XX XX",
    email: "contact@pharmacie.sn",
    nif: "XXXXXXX",
    ninea: "XXXXXXX",
  }

  const pharmacy = pharmacyInfo || defaultPharmacy

  const isProforma = sale.is_proforma || sale.client_type === "PROFORMA"
  const documentTitle = isProforma ? "FACTURE PROFORMA" : "FACTURE"
  const documentNumber = isProforma ? `PRO-${sale.sale_number}` : sale.sale_number

  return (
    <div
      ref={ref}
      className="bg-white text-black p-8 w-[210mm] min-h-[297mm] mx-auto text-sm"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-4 border-b-2 border-gray-800">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#222e50" }}>
            {pharmacy.name}
          </h1>
          <p className="text-gray-600 mt-1">{pharmacy.address}</p>
          <p className="text-gray-600">Tél: {pharmacy.phone}</p>
          <p className="text-gray-600">{pharmacy.email}</p>
          {pharmacy.nif && <p className="text-gray-600 text-xs mt-2">NIF: {pharmacy.nif}</p>}
          {pharmacy.ninea && <p className="text-gray-600 text-xs">NINEA: {pharmacy.ninea}</p>}
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold" style={{ color: "#222e50" }}>
            {documentTitle}
          </h2>
          <p className="text-gray-700 mt-2">
            <span className="font-semibold">N°:</span> {documentNumber}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Date:</span> {formatDate(sale.sale_date)}
          </p>
        </div>
      </div>

      {/* Client Info */}
      <div className="mb-8 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold text-gray-800 mb-2">Client</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">
              <span className="font-medium">Type:</span>{" "}
              {sale.client_type === "COMPTANT"
                ? "Comptant"
                : sale.client_type === "IPM_MUTUELLE"
                  ? "IPM/Mutuelle"
                  : sale.client_type === "CLIENT_CREDIT"
                    ? "Client à crédit"
                    : sale.client_type === "PROFORMA"
                      ? "Proforma"
                      : sale.client_type}
            </p>
            {sale.patient_name && (
              <p className="text-gray-600">
                <span className="font-medium">Patient:</span> {sale.patient_name}
              </p>
            )}
          </div>
          <div>
            {sale.ipm_name && (
              <p className="text-gray-600">
                <span className="font-medium">IPM:</span> {sale.ipm_name}
              </p>
            )}
            {sale.ipm_coverage_amount > 0 && (
              <p className="text-gray-600">
                <span className="font-medium">Taux couverture:</span>{" "}
                {Math.round((sale.ipm_coverage_amount / sale.total_amount) * 100)}%
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-8 border-collapse">
        <thead>
          <tr style={{ backgroundColor: "#222e50", color: "white" }}>
            <th className="p-3 text-left border">Désignation</th>
            <th className="p-3 text-center border w-20">Qté</th>
            <th className="p-3 text-right border w-28">P.U.</th>
            <th className="p-3 text-right border w-32">Montant</th>
          </tr>
        </thead>
        <tbody>
          {sale.items?.map((item, index) => (
            <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="p-3 border">
                {item.product_name || `Produit ${item.product_id.slice(0, 8)}`}
                {item.is_unit_sale && <span className="ml-2 text-xs text-gray-500">(Unité)</span>}
              </td>
              <td className="p-3 text-center border">{item.quantity}</td>
              <td className="p-3 text-right border">{formatCurrency(item.unit_price)}</td>
              <td className="p-3 text-right border font-medium">{formatCurrency(item.line_total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-72">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Sous-total:</span>
            <span>{formatCurrency(sale.subtotal)}</span>
          </div>
          {sale.discount_amount > 0 && (
            <div className="flex justify-between py-2 border-b" style={{ color: "#ea580c" }}>
              <span>Remise:</span>
              <span>-{formatCurrency(sale.discount_amount)}</span>
            </div>
          )}
          {sale.tolerance_amount > 0 && (
            <div className="flex justify-between py-2 border-b text-gray-500">
              <span>Tolérance:</span>
              <span>-{formatCurrency(sale.tolerance_amount)}</span>
            </div>
          )}
          <div className="flex justify-between py-3 border-b-2 border-gray-800 font-bold text-lg">
            <span>TOTAL:</span>
            <span>{formatCurrency(sale.total_amount)}</span>
          </div>
          {sale.ipm_coverage_amount > 0 && (
            <>
              <div className="flex justify-between py-2" style={{ color: "#2563eb" }}>
                <span>Part IPM:</span>
                <span>{formatCurrency(sale.ipm_coverage_amount)}</span>
              </div>
              <div className="flex justify-between py-2 font-semibold">
                <span>Part Patient:</span>
                <span>{formatCurrency(sale.patient_amount)}</span>
              </div>
            </>
          )}
          {!isProforma && (
            <div className="flex justify-between py-2 mt-2 px-2 rounded" style={{ backgroundColor: "#dcfce7" }}>
              <span className="font-medium" style={{ color: "#15803d" }}>
                Montant payé:
              </span>
              <span className="font-bold" style={{ color: "#15803d" }}>
                {formatCurrency(sale.amount_paid)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Info */}
      {!isProforma && sale.payment_method && (
        <div className="mb-8 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold text-gray-800 mb-2">Paiement</h3>
          <p className="text-gray-600">
            <span className="font-medium">Mode:</span>{" "}
            {sale.payment_method === "CASH"
              ? "Espèces"
              : sale.payment_method === "CARD"
                ? "Carte bancaire"
                : sale.payment_method === "MOBILE_MONEY"
                  ? "Mobile Money"
                  : sale.payment_method === "TRANSFER"
                    ? "Virement"
                    : sale.payment_method}
          </p>
          {sale.payment_reference && (
            <p className="text-gray-600">
              <span className="font-medium">Référence:</span> {sale.payment_reference}
            </p>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto pt-8 border-t text-center text-gray-500 text-xs">
        <p>Merci pour votre confiance!</p>
        <p className="mt-2">
          {pharmacy.name} - {pharmacy.address}
        </p>
        {isProforma && (
          <p className="mt-4 font-medium" style={{ color: "#ea580c" }}>
            Ce document est une facture proforma et ne constitue pas une preuve de paiement.
          </p>
        )}
      </div>
    </div>
  )
})

InvoiceTemplate.displayName = "InvoiceTemplate"

export { InvoiceTemplate }
export default InvoiceTemplate
