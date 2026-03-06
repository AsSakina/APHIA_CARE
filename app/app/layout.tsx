import type React from "react"
import { PharmacyTopNav } from "@/components/app/pharmacy-top-nav"
import { Toaster } from "@/components/ui/sonner"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PharmacyTopNav />
      <main className="flex-1 overflow-auto">
        <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  )
}
