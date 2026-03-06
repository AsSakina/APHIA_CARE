"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, AlertCircle, AlertTriangle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { generateAlerts, type Alert } from "@/lib/mock-data"

export function NotificationsButton() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const alerts = generateAlerts()

  const criticalCount = alerts.filter((a) => a.severity === "critical").length
  const warningCount = alerts.filter((a) => a.severity === "warning").length

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "expired":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "expiring_soon":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "low_stock":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      case "stock_loss":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "stock_entry":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getAlertRedirectUrl = (type: Alert["type"]) => {
    switch (type) {
      case "low_stock":
        return "/app/stock"
      case "expired":
      case "expiring_soon":
        return "/app/stock?tab=alerts"
      case "stock_loss":
        return "/app/stock/movements?tab=historique"
      default:
        return "/app/stock"
    }
  }

  const handleAlertClick = (alert: Alert) => {
    const url = getAlertRedirectUrl(alert.type)
    setIsOpen(false)
    router.push(url)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {alerts.length > 0 && (
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {alerts.length > 9 ? "9+" : alerts.length}
          </Badge>
        )}
      </Button>

      <DropdownMenuContent className="w-80 max-h-[500px]" align="end" sideOffset={4}>
        <DropdownMenuLabel className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="font-semibold">Alertes et Notifications</span>
          </div>
          {alerts.length > 0 && (
            <Badge variant="destructive" className="text-xs">
              {alerts.length > 9 ? "9+" : alerts.length}
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Summary Statistics */}
        {alerts.length > 0 && (
          <div className="px-3 py-2 text-xs space-y-1 bg-muted/50 border-b mb-2">
            {criticalCount > 0 && (
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3 w-3 text-destructive" />
                <span>{criticalCount} alerte{criticalCount > 1 ? "s" : ""} critique{criticalCount > 1 ? "s" : ""}</span>
              </div>
            )}
            {warningCount > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-orange-500" />
                <span>{warningCount} avertissement{warningCount > 1 ? "s" : ""}</span>
              </div>
            )}
          </div>
        )}

        {alerts.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground space-y-2">
            <Bell className="h-8 w-8 mx-auto opacity-50" />
            <p>Aucune alerte pour le moment</p>
            <p className="text-xs">Vous êtes à jour!</p>
          </div>
        ) : (
          <ScrollArea className="h-[350px]">
            <div className="p-2 space-y-2">
              {alerts.map((alert) => (
                <button
                  key={alert.id}
                  onClick={() => handleAlertClick(alert)}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 hover:shadow-md group ${
                    alert.severity === "critical"
                      ? "bg-destructive/10 border-destructive/30 hover:bg-destructive/15"
                      : "bg-amber-50/50 border-amber-200/50 hover:bg-amber-100/50 dark:bg-amber-950/20 dark:border-amber-900/40 dark:hover:bg-amber-950/30"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5 flex-shrink-0">{getAlertIcon(alert.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm capitalize">
                            {alert.type === "expired"
                              ? "Produit périmé"
                              : alert.type === "expiring_soon"
                                ? "Expiration proche"
                                : alert.type === "low_stock"
                                  ? "Stock faible"
                                  : alert.type === "stock_loss"
                                    ? "Perte de stock"
                                    : "Entrée de stock"}
                          </p>
                          <p className="text-xs text-muted-foreground font-medium mt-0.5">
                            {alert.product_name}
                          </p>
                        </div>
                        {alert.severity === "critical" && (
                          <Badge variant="destructive" className="text-xs shrink-0">Urgent</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5">{alert.message}</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        {new Date(alert.created_at).toLocaleDateString("fr-FR", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
