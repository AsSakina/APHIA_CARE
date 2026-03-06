"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sun, Moon, Monitor, Globe, Bell, Clock } from "lucide-react"

export function PreferencesSettings() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Apparence
            </CardTitle>
            <CardDescription>Personnalisez l'apparence de l'application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse">
              <div className="h-24 bg-muted rounded-lg"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Apparence
          </CardTitle>
          <CardDescription>Personnalisez l'apparence de l'application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Thème</Label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                  theme === "light" ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/25"
                }`}
              >
                <Sun className="h-6 w-6" />
                <span className="text-sm font-medium">Clair</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                  theme === "dark" ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/25"
                }`}
              >
                <Moon className="h-6 w-6" />
                <span className="text-sm font-medium">Sombre</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                  theme === "system" ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/25"
                }`}
              >
                <Monitor className="h-6 w-6" />
                <span className="text-sm font-medium">Système</span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Thème actuel : {resolvedTheme === "dark" ? "Sombre" : "Clair"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Langue et région
          </CardTitle>
          <CardDescription>Paramètres régionaux de l'application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Langue</Label>
              <Select defaultValue="fr">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en" disabled>
                    English (Bientôt)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Devise</Label>
              <Select defaultValue="xof">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xof">FCFA (XOF)</SelectItem>
                  <SelectItem value="eur" disabled>
                    Euro (EUR)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Format de date</Label>
            <Select defaultValue="dd/mm/yyyy">
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dd/mm/yyyy">JJ/MM/AAAA</SelectItem>
                <SelectItem value="mm/dd/yyyy">MM/JJ/AAAA</SelectItem>
                <SelectItem value="yyyy-mm-dd">AAAA-MM-JJ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Gérez vos préférences de notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications par email</Label>
              <p className="text-sm text-muted-foreground">Recevoir des alertes importantes par email</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Alertes de stock</Label>
              <p className="text-sm text-muted-foreground">Être notifié en cas de stock bas</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Rappels d'expiration</Label>
              <p className="text-sm text-muted-foreground">Alertes pour les produits bientôt périmés</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Rapports hebdomadaires</Label>
              <p className="text-sm text-muted-foreground">Recevoir un résumé chaque semaine</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Session */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Session
          </CardTitle>
          <CardDescription>Paramètres de session et de sécurité</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Délai d'expiration de session</Label>
            <Select defaultValue="7">
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 jour</SelectItem>
                <SelectItem value="7">7 jours</SelectItem>
                <SelectItem value="30">30 jours</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Durée avant déconnexion automatique</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Se souvenir de moi</Label>
              <p className="text-sm text-muted-foreground">Rester connecté sur cet appareil</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
