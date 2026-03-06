"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import { Fragment } from "react"
import { UserMenu } from "@/components/app/user-menu"
import { NotificationsButton } from "@/components/app/notifications-button"
import { ThemeToggle } from "@/components/app/theme-toggle"
import { PWAButton } from "@/components/app/pwa-button"
import type { User } from "@/lib/auth"

const pathLabels: Record<string, string> = {
  app: "Accueil",
  expenses: "Dépenses",
  payments: "Paiements",
  losses: "Pertes",
  ipm: "IPM / Mutuelles",
  claims: "Créances",
  sales: "Revenus des ventes",
  pos: "Point de vente",
  accounting: "Comptabilité",
  balance: "Balance",
  stock: "Stock",
  categories: "Catégories",
  movements: "Mouvements",
  receivables: "Créances clients",
  new: "Nouveau",
  settings: "Paramètres",
}

interface AppHeaderProps {
  user: User
}

export function AppHeader({ user }: AppHeaderProps) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {segments.map((segment, index) => {
              const href = "/" + segments.slice(0, index + 1).join("/")
              const isLast = index === segments.length - 1
              const label = pathLabels[segment] || segment

              return (
                <Fragment key={href}>
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-3 ml-auto">
        <NotificationsButton />
        <ThemeToggle />
        <PWAButton />
        <Separator orientation="vertical" className="h-6" />
        <UserMenu user={user} />
      </div>
    </header>
  )
}
