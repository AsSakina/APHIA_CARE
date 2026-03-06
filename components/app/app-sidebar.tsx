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
  BookOpen,
  Store,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ThemeLogo } from "@/components/landing/theme-logo"

const mainNavItems = [
  {
    title: "Tableau de bord",
    href: "/app",
    icon: LayoutDashboard,
  },
]

const operationsNavItems = [
  {
    title: "Point de vente",
    href: "/app/pos",
    icon: ShoppingCart,
  },
]

const stockNavItems = [
  {
    title: "Stock",
    href: "/app/stock",
    icon: Package,
  },
]

const financeNavItems = [
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
]

const receivablesNavItems = [
  {
    title: "Créances",
    href: "/app/receivables",
    icon: Building2,
  },
]

const accountingNavItems = [
  {
    title: "Comptabilité",
    href: "/app/accounting",
    icon: BookOpen,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/app") return pathname === "/app"
    return pathname.startsWith(href)
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link href="/app" className="flex items-center gap-2">
          <ThemeLogo className="h-8 w-auto" />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Operations */}
        <SidebarGroup>
          <SidebarGroupLabel>Opérations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {operationsNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Stock */}
        <SidebarGroup>
          <SidebarGroupLabel>Stock</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {stockNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Finance */}
        <SidebarGroup>
          <SidebarGroupLabel>Finance</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {financeNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Receivables */}
        <SidebarGroup>
          <SidebarGroupLabel>Créances</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {receivablesNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Accounting */}
        <SidebarGroup>
          <SidebarGroupLabel>Comptabilité</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountingNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/app/settings"}>
              <Link href="/app/settings">
                <Settings className="size-4" />
                <span>Paramètres</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
