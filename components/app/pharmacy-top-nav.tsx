"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  AlertCircle,
  Users,
  DollarSign,
  Network,
  TrendingUp,
  Lock,
  Menu,
  X,
} from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { useState, useEffect } from "react"
import { NotificationsButton } from "./notifications-button"
import { ThemeToggle } from "./theme-toggle"
import { PWAButton } from "./pwa-button"
import { ThemeLogo } from "@/components/landing/theme-logo"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function PharmacyTopNav() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isActive = (href: string) => pathname.startsWith(href)

  const navItems = [
    {
      label: "Point de Vente",
      href: "/app/pos",
      icon: ShoppingCart,
      submenu: [
        { label: "Nouvelle vente", href: "/app/pos" },
        { label: "Historique", href: "/app/sales" },
      ],
    },
    {
      label: "Stock",
      href: "/app/stock",
      icon: Package,
      submenu: [
        { label: "Inventaire", href: "/app/stock" },
        { label: "Mouvements", href: "/app/stock?tab=mouvements" },
        { label: "Alertes", href: "/app/stock?tab=alertes" },
      ],
    },
    {
      label: "Clients",
      href: "/app/clients",
      icon: Users,
    },
    {
      label: "Caisses",
      href: "/app/cash-registers",
      icon: DollarSign,
    },
    {
      label: "Créances",
      href: "/app/receivables",
      icon: AlertCircle,
      submenu: [
        { label: "Tous les clients", href: "/app/receivables" },
        { label: "Crédit clients", href: "/app/receivables?type=credit" },
        { label: "IPM / Mutuelles", href: "/app/receivables?type=ipm" },
      ],
    },
    {
      label: "Finance",
      href: "/app/accounting",
      icon: BarChart3,
      submenu: [
        { label: "Comptabilité", href: "/app/accounting" },
        { label: "Dépenses", href: "/app/expenses" },
        { label: "Dashboard Finance", href: "/app/finance" },
      ],
    },
    {
      label: "Rapports",
      href: "/app/reports",
      icon: TrendingUp,
      submenu: [
        { label: "Rapports & Analyses", href: "/app/reports" },
        { label: "KPI", href: "/app/finance" },
      ],
    },
    {
      label: "Admin",
      href: "/app/users",
      icon: Lock,
      submenu: [
        { label: "Utilisateurs & Rôles", href: "/app/users" },
        { label: "Audit & Compliance", href: "/app/audit" },
        { label: "Réseau Inter-Pharmacies", href: "/app/network" },
      ],
    },
    {
      label: "Paramètres",
      href: "/app/settings",
      icon: Settings,
      submenu: [
        { label: "Profil", href: "/app/settings" },
        { label: "Sécurité", href: "/app/settings?tab=security" },
      ],
    },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/app/pos" className="flex-shrink-0">
          <ThemeLogo width={120} height={40} className="hidden sm:block" />
          <ThemeLogo width={100} height={35} className="sm:hidden" />
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="gap-0">
            {navItems.map((item) => {
              const Icon = item.icon
              if (!item.submenu) {
                return (
                  <NavigationMenuItem key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        "hover:bg-muted hover:text-foreground",
                        isActive(item.href) ? "bg-muted text-foreground" : "text-muted-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </NavigationMenuItem>
                )
              }

              return (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuTrigger
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      "hover:bg-muted hover:text-foreground",
                      isActive(item.href) ? "bg-muted text-foreground" : "text-muted-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="min-w-max rounded-md border bg-popover p-3 shadow-md">
                    <div className="space-y-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          className="block rounded px-3 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          {subitem.label}
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <NotificationsButton />
          <ThemeToggle />
          {mounted && <PWAButton />}
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-card p-2">
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                      "hover:bg-muted",
                      isActive(item.href) ? "bg-muted font-medium" : "text-muted-foreground",
                    )}
                    onClick={() => !item.submenu && setMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                  {item.submenu && (
                    <div className="ml-4 space-y-1 border-l border-muted pl-2 mt-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          className="block px-3 py-1.5 text-xs rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subitem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
