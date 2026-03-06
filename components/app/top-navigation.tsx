"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Receipt,
  TrendingDown,
  Building2,
  Settings,
  ShoppingCart,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Tableau de bord",
    href: "/app",
    icon: LayoutDashboard,
  },
  {
    title: "Point de vente",
    href: "/app/pos",
    icon: ShoppingCart,
  },
  {
    title: "Stock",
    href: "/app/stock",
    icon: Package,
  },
  {
    title: "Dépenses",
    href: "/app/expenses",
    icon: Receipt,
  },
  {
    title: "Pertes",
    href: "/app/losses",
    icon: TrendingDown,
  },
  {
    title: "Créances",
    href: "/app/receivables",
    icon: Building2,
  },
  {
    title: "Paramètres",
    href: "/app/settings",
    icon: Settings,
  },
]

export function TopNavigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-background">
      <div className="flex h-12 items-center gap-1 overflow-x-auto px-4 scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={cn("gap-2 whitespace-nowrap", isActive && "bg-primary text-primary-foreground")}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.title}</span>
              </Button>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
