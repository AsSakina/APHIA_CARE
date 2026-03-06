"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "./profile-settings"
import { SecuritySettings } from "./security-settings"
import { PreferencesSettings } from "./preferences-settings"
import { User, Lock, Settings } from "lucide-react"
import type { User as UserType } from "@/lib/auth"

interface SettingsContentProps {
  user: UserType
}

export function SettingsContent({ user }: SettingsContentProps) {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">Gérez votre compte et vos préférences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Préférences</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings user={user} />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecuritySettings user={user} />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <PreferencesSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
