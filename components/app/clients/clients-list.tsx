"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { getAllClients, deleteClient, updateClient } from "@/app/app/clients/actions"
import type { Patient } from "@/lib/types"
import { Trash2, Edit2, Lock, Unlock, Phone, Mail } from "lucide-react"

export function ClientsList() {
  const [clients, setClients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const data = await getAllClients()
      setClients(data)
    } catch (error) {
      toast.error("Erreur lors du chargement des clients")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (clientId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce client?")) return

    const result = await deleteClient(clientId)
    if (result.success) {
      setClients(clients.filter((c) => c.id !== clientId))
      toast.success("Client supprimé")
    } else {
      toast.error(result.error)
    }
  }

  const handleToggleCredit = async (client: Patient) => {
    const result = await updateClient(client.id, {
      can_receive_credit: !client.can_receive_credit,
    })
    if (result.success && result.client) {
      setClients(clients.map((c) => (c.id === client.id ? result.client! : c)))
      toast.success(
        `Crédit ${!client.can_receive_credit ? "activé" : "désactivé"} pour ${client.first_name}`
      )
    } else {
      toast.error(result.error)
    }
  }

  const filteredClients = clients.filter((client) =>
    `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clients enregistrés</CardTitle>
        <CardDescription>
          {clients.length} client{clients.length !== 1 ? "s" : ""} dans la pharmacie
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <Input
          placeholder="Rechercher un client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p className="text-muted-foreground">Chargement des clients...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucun client trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Crédit</TableHead>
                  <TableHead>Limite</TableHead>
                  <TableHead>Solde</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      {client.first_name} {client.last_name}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {client.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {client.phone}
                          </div>
                        )}
                        {client.email && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {client.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={client.can_receive_credit ? "default" : "outline"}
                      >
                        {client.can_receive_credit ? "Activé" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {client.credit_limit ? (
                        <span className="font-mono text-sm">
                          {client.credit_limit.toLocaleString()} FCFA
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {client.current_credit_balance ? (
                        <span className="font-mono text-sm text-red-600">
                          {client.current_credit_balance.toLocaleString()} FCFA
                        </span>
                      ) : (
                        <span className="text-muted-foreground">0 FCFA</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleCredit(client)}
                          title={client.can_receive_credit ? "Désactiver crédit" : "Activer crédit"}
                        >
                          {client.can_receive_credit ? (
                            <Lock className="h-4 w-4" />
                          ) : (
                            <Unlock className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(client.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
