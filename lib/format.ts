// Currency formatter for FCFA
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-SN", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Short currency format (e.g., 1.5M)
export function formatCurrencyShort(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M FCFA`
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}K FCFA`
  }
  return `${amount} FCFA`
}

// Date formatter
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

// Short date formatter
export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(date))
}

// Percentage formatter
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}
