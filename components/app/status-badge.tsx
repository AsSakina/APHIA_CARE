import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ExpenseStatus, IpmClaimStatus } from "@/lib/types"

interface StatusBadgeProps {
  status: ExpenseStatus | IpmClaimStatus
  className?: string
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  // Expense statuses
  DRAFT: { label: "Brouillon", variant: "outline" },
  PENDING: { label: "En attente", variant: "secondary" },
  VALIDATED: { label: "Validée", variant: "default" },
  PAID: { label: "Payée", variant: "default" },
  CANCELLED: { label: "Annulée", variant: "destructive" },
  // IPM claim statuses
  SENT: { label: "Envoyée", variant: "secondary" },
  ACCEPTED: { label: "Acceptée", variant: "default" },
  REJECTED: { label: "Rejetée", variant: "destructive" },
  PARTIAL: { label: "Partiel", variant: "secondary" },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: "outline" as const }

  return (
    <Badge
      variant={config.variant}
      className={cn(
        status === "PAID" || status === "VALIDATED" || status === "ACCEPTED"
          ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
          : "",
        className,
      )}
    >
      {config.label}
    </Badge>
  )
}
