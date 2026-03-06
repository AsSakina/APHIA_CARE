"use client"

import { useState, useEffect } from "react"
import { Search, User, Building2, FileText, CreditCard, Wallet, Percent, Hash } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import type { Cart, Patient, Ipm, IpmPatient, ClientType, DiscountType } from "@/lib/types"
import {
  updateCartClient,
  searchPatients,
  getIpmPatients,
  updateCartDiscount,
  searchIpmPatientsByCode,
} from "@/app/app/pos/actions"

interface ClientSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cart: Cart
  ipms: Ipm[]
  onUpdate: () => void
}

export function ClientSelector({ open, onOpenChange, cart, ipms, onUpdate }: ClientSelectorProps) {
  const [clientType, setClientType] = useState<ClientType>(cart.client_type || "COMPTANT")
  const [patientSearch, setPatientSearch] = useState("")
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedIpm, setSelectedIpm] = useState<string>(cart.ipm_id || "")
  const [ipmPatients, setIpmPatients] = useState<IpmPatient[]>([])
  const [selectedIpmPatient, setSelectedIpmPatient] = useState<string>("")

  const [ipmPatientCode, setIpmPatientCode] = useState("")
  const [ipmSearchResults, setIpmSearchResults] = useState<IpmPatient[]>([])

  const [discountType, setDiscountType] = useState<DiscountType>(cart.discount_type || "FIXED")
  const [discountAmount, setDiscountAmount] = useState(cart.discount_amount.toString())
  const [discountPercentage, setDiscountPercentage] = useState(cart.discount_percentage?.toString() || "0")
  const [isLoading, setIsLoading] = useState(false)

  // Search patients
  useEffect(() => {
    if (patientSearch.trim().length >= 2) {
      searchPatients(patientSearch).then(setPatients)
    } else {
      setPatients([])
    }
  }, [patientSearch])

  // Load IPM patients when IPM selected
  useEffect(() => {
    if (selectedIpm && clientType === "IPM_MUTUELLE") {
      getIpmPatients(selectedIpm).then(setIpmPatients)
    } else {
      setIpmPatients([])
    }
  }, [selectedIpm, clientType])

  useEffect(() => {
    if (ipmPatientCode.trim().length >= 2 && clientType === "IPM_MUTUELLE") {
      searchIpmPatientsByCode(ipmPatientCode, selectedIpm || undefined).then(setIpmSearchResults)
    } else {
      setIpmSearchResults([])
    }
  }, [ipmPatientCode, selectedIpm, clientType])

  async function handleSave() {
    setIsLoading(true)

    // Validate credit - only authorized patients
    if (clientType === "CLIENT_CREDIT" && selectedPatient && !selectedPatient.can_receive_credit) {
      toast.error("Ce patient n'est pas autorisé à recevoir du crédit. Veuillez contacter le pharmacien.")
      setIsLoading(false)
      return
    }

    if ((clientType === "CLIENT_COMPTE" || clientType === "CLIENT_CREDIT") && !selectedPatient) {
      toast.error("Veuillez sélectionner un patient")
      setIsLoading(false)
      return
    }

    if (clientType === "IPM_MUTUELLE" && !selectedIpm) {
      toast.error("Veuillez sélectionner une IPM")
      setIsLoading(false)
      return
    }

    // Update client
    const result = await updateCartClient(
      cart.id,
      clientType,
      selectedPatient?.id ||
        (clientType === "IPM_MUTUELLE" && selectedIpmPatient
          ? ipmPatients.find((ip) => ip.id === selectedIpmPatient)?.patient_id
          : undefined),
      clientType === "IPM_MUTUELLE" ? selectedIpm : undefined,
      clientType === "IPM_MUTUELLE" ? selectedIpmPatient : undefined,
    )

    if (!result.success) {
      toast.error(result.error || "Erreur")
      setIsLoading(false)
      return
    }

    const discount = discountType === "FIXED" ? Number.parseFloat(discountAmount) || 0 : 0
    const percentage = discountType === "PERCENTAGE" ? Number.parseFloat(discountPercentage) || 0 : 0

    await updateCartDiscount(cart.id, discount, percentage, discountType)

    toast.success("Client mis à jour")
    onUpdate()
    onOpenChange(false)
    setIsLoading(false)
  }

  function handleSelectIpmPatient(ipmPatient: IpmPatient) {
    setSelectedIpm(ipmPatient.ipm_id)
    setSelectedIpmPatient(ipmPatient.id)
    setIpmSearchResults([])
    setIpmPatientCode(ipmPatient.membership_number)
    toast.success(`Patient ${ipmPatient.patient_name} sélectionné`)
  }

  const clientTypes = [
    { value: "COMPTANT", label: "Client comptant", icon: Wallet, description: "Paiement immédiat" },
    { value: "IPM_MUTUELLE", label: "IPM / Mutuelle", icon: Building2, description: "Prise en charge partielle" },
    { value: "CLIENT_COMPTE", label: "Client avec compte", icon: User, description: "Client enregistré" },
    { value: "CLIENT_CREDIT", label: "Client à crédit", icon: CreditCard, description: "Paiement différé (autorisé)" },
    { value: "PROFORMA", label: "Pro-forma", icon: FileText, description: "Devis uniquement" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Sélection du client</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Type Selection */}
          <RadioGroup
            value={clientType}
            onValueChange={(v) => setClientType(v as ClientType)}
            className="grid grid-cols-2 gap-2"
          >
            {clientTypes.map((type) => (
              <div key={type.value}>
                <RadioGroupItem value={type.value} id={type.value} className="peer sr-only" />
                <Label
                  htmlFor={type.value}
                  className="flex cursor-pointer flex-col rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <type.icon className="mb-2 size-4" />
                  <span className="text-sm font-medium">{type.label}</span>
                  <span className="text-xs text-muted-foreground">{type.description}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>

          {/* Patient Search (for CLIENT_COMPTE or CLIENT_CREDIT) */}
          {(clientType === "CLIENT_COMPTE" || clientType === "CLIENT_CREDIT") && (
            <div className="space-y-2">
              <Label>Rechercher un patient</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Nom ou téléphone..."
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              {patients.length > 0 && (
                <ScrollArea className="h-40 rounded-md border">
                  <div className="p-2">
                    {patients.map((patient) => (
                      <div
                        key={patient.id}
                        className={`cursor-pointer rounded-md p-2 hover:bg-accent ${
                          selectedPatient?.id === patient.id ? "bg-accent" : ""
                        }`}
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {patient.first_name} {patient.last_name}
                            </p>
                            <p className="text-xs text-muted-foreground">{patient.phone}</p>
                          </div>
                          {clientType === "CLIENT_CREDIT" && (
                            <span
                              className={`text-xs px-2 py-1 rounded ${patient.can_receive_credit ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                            >
                              {patient.can_receive_credit ? "Crédit autorisé" : "Non autorisé"}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
              {selectedPatient && (
                <div className="rounded-md bg-muted p-2 text-sm">
                  Sélectionné: {selectedPatient.first_name} {selectedPatient.last_name}
                </div>
              )}
            </div>
          )}

          {clientType === "IPM_MUTUELLE" && (
            <div className="space-y-4">
              {/* Search by patient code first */}
              <div className="space-y-2">
                <Label>Rechercher par code patient IPM</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Code patient (ex: IPM-001)..."
                    value={ipmPatientCode}
                    onChange={(e) => setIpmPatientCode(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {ipmSearchResults.length > 0 && (
                  <ScrollArea className="h-40 rounded-md border">
                    <div className="p-2">
                      {ipmSearchResults.map((ip) => (
                        <div
                          key={ip.id}
                          className="cursor-pointer rounded-md p-2 hover:bg-accent"
                          onClick={() => handleSelectIpmPatient(ip)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{ip.patient_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {ip.membership_number} - {ip.ipm_name}
                              </p>
                            </div>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {ip.effective_rate}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>

              <div className="text-center text-sm text-muted-foreground">ou sélectionnez manuellement</div>

              <div className="space-y-2">
                <Label>Sélectionner une IPM</Label>
                <Select value={selectedIpm} onValueChange={setSelectedIpm}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une IPM..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ipms.map((ipm) => (
                      <SelectItem key={ipm.id} value={ipm.id}>
                        {ipm.name} ({ipm.coverage_rate}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedIpm && ipmPatients.length > 0 && (
                <div className="space-y-2">
                  <Label>Patient affilié</Label>
                  <Select value={selectedIpmPatient} onValueChange={setSelectedIpmPatient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un patient..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ipmPatients.map((ip) => (
                        <SelectItem key={ip.id} value={ip.id}>
                          {ip.patient_name} - {ip.membership_number} ({ip.effective_rate}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <Label>Remise</Label>
            <Tabs value={discountType} onValueChange={(v) => setDiscountType(v as DiscountType)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="FIXED" className="flex items-center gap-1">
                  <Hash className="size-3" />
                  Montant fixe
                </TabsTrigger>
                <TabsTrigger value="PERCENTAGE" className="flex items-center gap-1">
                  <Percent className="size-3" />
                  Pourcentage
                </TabsTrigger>
              </TabsList>
              <TabsContent value="FIXED" className="mt-2">
                <Input
                  type="number"
                  min="0"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  placeholder="Montant en FCFA"
                />
              </TabsContent>
              <TabsContent value="PERCENTAGE" className="mt-2">
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(e.target.value)}
                    placeholder="Pourcentage"
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button className="flex-1" onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
