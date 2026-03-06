"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Plus, ShoppingCart, Search, X, Package, Minus, Trash2, User, CreditCard, Barcode, ChevronLeft, ChevronRight, Camera } from "lucide-react"
import { useBarcodeScanner } from "@/hooks/use-barcode-scanner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/format"
import { toast } from "sonner"
import type { Cart, CartItem, Product, Ipm, ClientType } from "@/lib/types"
import {
  createCart,
  getActiveCart,
  getCartItems,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  searchProducts,
  searchProductByBarcode,
  cancelCart,
} from "@/app/app/pos/actions"
import { ClientSelector } from "./client-selector"
import { PaymentDialog } from "./payment-dialog"
import { CameraScanner } from "./camera-scanner"

interface PosInterfaceProps {
  initialCarts: Cart[]
  products: Product[]
  ipms: Ipm[]
}

export function PosInterface({ initialCarts, products, ipms }: PosInterfaceProps) {
  const router = useRouter()
  const barcodeInputRef = useRef<HTMLInputElement>(null)
  const cartScrollRef = useRef<HTMLDivElement>(null)
  const [carts, setCarts] = useState<Cart[]>(initialCarts)
  const [activeCartId, setActiveCartId] = useState<string | null>(initialCarts[0]?.id || null)
  const [activeCart, setActiveCart] = useState<Cart | null>(initialCarts[0] || null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [isLoading, setIsLoading] = useState(false)
  const [showClientSelector, setShowClientSelector] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [barcodeInput, setBarcodeInput] = useState("")
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(carts.length > 3)
  const [isScannerActive, setIsScannerActive] = useState(true)
  const [scannedBarcode, setScannedBarcode] = useState("")
  const [showCameraScanner, setShowCameraScanner] = useState(false)

  // Barcode scanner hook
  const { clearBuffer } = useBarcodeScanner({
    onScan: (barcode) => {
      if (!isScannerActive || !activeCartId) return
      handleBarcodeScannedDB(barcode) // Corrected to use handleBarcodeScannedDB
    },
    timeout: 100,
  })

  // Load cart items when active cart changes
  useEffect(() => {
    if (activeCartId) {
      loadCartData()
    } else {
      setCartItems([])
      setActiveCart(null)
    }
  }, [activeCartId])

  // Check scroll position
  useEffect(() => {
    const checkScroll = () => {
      if (cartScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = cartScrollRef.current
        setCanScrollLeft(scrollLeft > 0)
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
      }
    }

    checkScroll()
    const scrollElement = cartScrollRef.current
    scrollElement?.addEventListener("scroll", checkScroll)
    return () => scrollElement?.removeEventListener("scroll", checkScroll)
  }, [carts])

  // Search products
  useEffect(() => {
    if (searchQuery.trim()) {
      searchProducts(searchQuery).then(setFilteredProducts)
    } else {
      setFilteredProducts(products)
    }
  }, [searchQuery, products])

  async function loadCartData() {
    if (!activeCartId) return
    const [cart, items] = await Promise.all([getActiveCart(activeCartId), getCartItems(activeCartId)])
    setActiveCart(cart || null)
    setCartItems(items)
  }

  async function handleCreateCart() {
    setIsLoading(true)
    const result = await createCart()
    if (result.success && result.cart) {
      setCarts([result.cart, ...carts])
      setActiveCartId(result.cart.id)
      toast.success("Nouveau panier créé")
    } else {
      toast.error(result.error || "Erreur lors de la création")
    }
    setIsLoading(false)
  }

  async function handleAddProduct(product: Product) {
    if (!activeCartId) {
      // Create a new cart first
      const result = await createCart()
      if (result.success && result.cart) {
        setCarts([result.cart, ...carts])
        setActiveCartId(result.cart.id)
        await addCartItem(result.cart.id, product.id, 1, false)
        await loadCartData()
      }
    } else {
      await addCartItem(activeCartId, product.id, 1, false)
      await loadCartData()
    }
    toast.success(`${product.name} ajouté`)
  }

  async function handleUpdateQuantity(itemId: string, newQuantity: number) {
    await updateCartItemQuantity(itemId, newQuantity)
    await loadCartData()
  }

  async function handleRemoveItem(itemId: string) {
    await removeCartItem(itemId)
    await loadCartData()
    toast.success("Article supprimé")
  }

  async function handleCancelCart() {
    if (!activeCartId) return
    const result = await cancelCart(activeCartId)
    if (result.success) {
      setCarts(carts.filter((c) => c.id !== activeCartId))
      setActiveCartId(carts.find((c) => c.id !== activeCartId)?.id || null)
      toast.success("Panier annulé")
    }
  }

  function scrollCarts(direction: "left" | "right") {
    if (cartScrollRef.current) {
      const scrollAmount = 200
      cartScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  // Find product by barcode (local search - keep for fast reference)
  const findProductByBarcode = (barcode: string): Product | undefined => {
    const normalizedBarcode = barcode.toLowerCase()
    return products.find((p) => 
      (p.barcode && p.barcode.toLowerCase() === normalizedBarcode) ||
      (p.code && p.code.toLowerCase() === normalizedBarcode)
    )
  }

  // Handle barcode scanned event - search in DB and add to cart
  const handleBarcodeScannedDB = async (barcode: string) => {
    if (!activeCartId) {
      toast.error("Veuillez sélectionner un panier d'abord")
      return
    }

    setScannedBarcode(barcode)
    
    try {
      // Search product by barcode in database
      const product = await searchProductByBarcode(barcode)
      
      if (product) {
        // Automatically add to cart
        const result = await addCartItem(activeCartId, product.id, 1)
        if (result.success) {
          await loadCartData()
          toast.success(`${product.name} ajouté au panier`)
        } else {
          toast.error(result.error || "Erreur lors de l'ajout")
        }
      } else {
        toast.error(`Produit non trouvé: ${barcode}`)
        // Keep the barcode visible briefly for feedback
        setTimeout(() => setScannedBarcode(""), 1500)
      }
    } catch (error) {
      toast.error("Erreur lors du scan du code barre")
    } finally {
      setScannedBarcode("")
      clearBuffer()
    }
  }

  // Group products by category
  const productsByCategory = products.reduce(
    (acc, product) => {
      const category = product.category || "Autres"
      if (!acc[category]) acc[category] = []
      acc[category].push(product)
      return acc
    },
    {} as Record<string, Product[]>,
  )

  const handleBarcodeScanned = async (barcode: string) => {
    if (!activeCartId) {
      toast.error("Veuillez sélectionner un panier d'abord")
      return
    }

    setScannedBarcode(barcode)
    
    try {
      // Search product by barcode in database
      const product = await searchProductByBarcode(barcode)
      
      if (product) {
        // Automatically add to cart
        const result = await addCartItem(activeCartId, product.id, 1)
        if (result.success) {
          await loadCartData()
          toast.success(`${product.name} ajouté au panier`)
        } else {
          toast.error(result.error || "Erreur lors de l'ajout")
        }
      } else {
        toast.error(`Produit non trouvé: ${barcode}`)
        // Keep the barcode visible briefly for feedback
        setTimeout(() => setScannedBarcode(""), 1500)
      }
    } catch (error) {
      toast.error("Erreur lors du scan du code barre")
    } finally {
      setScannedBarcode("")
      clearBuffer()
    }
  }

  return (
    <div className="flex h-full gap-4 p-4">
      {/* Left Panel - Products */}
      <div className="flex w-2/3 flex-col gap-4">
        {/* Barcode Scanner Input (Hidden but focused for scanning) */}
        <Input
          ref={barcodeInputRef}
          type="text"
          placeholder="[Scanner focus - ne saisissez pas]"
          value={scannedBarcode}
          onChange={(e) => {
            // Allow only barcode input, prevent manual typing
            if (e.target.value && !barcodeInputRef.current?.hasAttribute("data-barcode-input")) {
              e.preventDefault()
              return
            }
          }}
          data-barcode-input="true"
          autoFocus
          className="mb-2 h-8 text-xs opacity-50"
        />

        {/* Scanner Status Bar with Real-time Feedback */}
        <div className={`flex items-center gap-2 rounded-lg border-2 p-2 transition-all ${
          isScannerActive 
            ? "border-green-500 bg-green-50 dark:bg-green-950" 
            : "border-gray-300 bg-gray-50 dark:bg-gray-900"
        }`}>
          <div className={`size-3 rounded-full ${isScannerActive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
          <div className="flex-1">
            <span className="text-xs font-semibold">
              {isScannerActive ? "📡 Scanner actif" : "❌ Scanner inactif"}
            </span>
            {scannedBarcode && (
              <p className="text-xs text-muted-foreground mt-1">
                Dernier scan: <span className="font-mono font-bold">{scannedBarcode}</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => setShowCameraScanner(true)}
              title="Ouvrir scanner caméra"
            >
              <Camera className="h-4 w-4" />
            </Button>
            <Button
              variant={isScannerActive ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs shrink-0"
              onClick={() => setIsScannerActive(!isScannerActive)}
            >
              {isScannerActive ? "Pause" : "Reprendre"}
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit ou scanner un code-barres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 size-6 -translate-y-1/2"
              onClick={() => setSearchQuery("")}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>

        {/* Products Grid */}
        <ScrollArea className="flex-1">
          {searchQuery ? (
            <div className="grid grid-cols-3 gap-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={() => handleAddProduct(product)} />
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-12 text-center text-muted-foreground">Aucun produit trouvé</div>
              )}
            </div>
          ) : (
            <Tabs defaultValue={Object.keys(productsByCategory)[0]} className="w-full">
              <TabsList className="mb-4 flex-wrap">
                {Object.keys(productsByCategory).map((category) => (
                  <TabsTrigger key={category} value={category} className="text-xs">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
                <TabsContent key={category} value={category}>
                  <div className="grid grid-cols-3 gap-3 lg:grid-cols-4">
                    {categoryProducts.map((product) => (
                      <ProductCard key={product.id} product={product} onAdd={() => handleAddProduct(product)} />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </ScrollArea>
      </div>

      {/* Right Panel - Cart */}
      <div className="flex w-1/3 flex-col gap-4">
        {/* Cart Tabs */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 bg-transparent"
              onClick={() => scrollCarts("left")}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <ScrollArea className="flex-1">
              <div className="flex gap-2 pb-2" ref={cartScrollRef}>
                {carts.map((cart) => (
                  <Button
                    key={cart.id}
                    variant={activeCartId === cart.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCartId(cart.id)}
                    className="shrink-0 whitespace-nowrap text-xs"
                    title={`ID: ${cart.id}`}
                  >
                    <ShoppingCart className="mr-1 size-3" />
                    {cart.name || cart.cart_number}
                  </Button>
                ))}
              </div>
            </ScrollArea>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 bg-transparent"
              onClick={() => scrollCarts("right")}
              disabled={!canScrollRight}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button size="sm" variant="outline" onClick={handleCreateCart} disabled={isLoading} className="w-full bg-transparent">
            <Plus className="mr-2 size-4" />
            Nouveau panier
          </Button>
        </div>

        {/* Active Cart */}
        {activeCart ? (
          <Card className="flex flex-1 flex-col">
            <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base">{activeCart.name || activeCart.cart_number}</CardTitle>
                <p className="text-xs text-muted-foreground">ID: {activeCart.id}</p>
                <div className="flex gap-2">
                  <Badge className={clientTypeColors[activeCart.client_type]}>
                    {clientTypeLabels[activeCart.client_type]}
                  </Badge>
                  {activeCart.user_name && <Badge variant="secondary">{activeCart.user_name}</Badge>}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowClientSelector(true)}>
                <User className="mr-1 size-4" />
                Client
              </Button>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4 pt-0">
              {/* Client Info */}
              {activeCart.patient_name && (
                <div className="rounded-md bg-muted p-2 text-sm">
                  <span className="font-medium">{activeCart.patient_name}</span>
                  {activeCart.ipm_name && <span className="ml-2 text-muted-foreground">({activeCart.ipm_name})</span>}
                </div>
              )}

              {/* Cart Items */}
              <ScrollArea className="flex-1">
                <div className="space-y-2">
                  {cartItems.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      <Package className="mx-auto mb-2 size-8 opacity-50" />
                      <p>Panier vide</p>
                    </div>
                  ) : (
                    cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-md border p-2">
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium">{item.product_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(item.unit_price)} × {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-6 bg-transparent"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-6 bg-transparent"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="size-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-6 text-destructive"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              {/* Totals */}
              <div className="space-y-1 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Sous-total</span>
                  <span>{formatCurrency(activeCart.subtotal)}</span>
                </div>
                {activeCart.discount_amount > 0 && (
                  <div className="flex justify-between text-sm text-orange-600">
                    <span>Remise</span>
                    <span>-{formatCurrency(activeCart.discount_amount)}</span>
                  </div>
                )}
                {activeCart.client_type === "IPM_MUTUELLE" && activeCart.ipm_coverage_amount > 0 && (
                  <div className="flex justify-between text-sm text-blue-600">
                    <span>Prise en charge IPM</span>
                    <span>-{formatCurrency(activeCart.ipm_coverage_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold">
                  <span>Total client</span>
                  <span>{formatCurrency(activeCart.patient_amount)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={handleCancelCart}>
                  Annuler
                </Button>
                <Button className="flex-1" disabled={cartItems.length === 0} onClick={() => setShowPaymentDialog(true)}>
                  <CreditCard className="mr-2 size-4" />
                  Payer
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <ShoppingCart className="mx-auto mb-4 size-12 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Aucun panier actif</p>
              <Button className="mt-4" onClick={handleCreateCart} disabled={isLoading}>
                <Plus className="mr-2 size-4" />
                Nouveau panier
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Dialogs */}
      {activeCart && (
        <>
          <ClientSelector
            open={showClientSelector}
            onOpenChange={setShowClientSelector}
            cart={activeCart}
            ipms={ipms}
            onUpdate={loadCartData}
          />
          <PaymentDialog
            open={showPaymentDialog}
            onOpenChange={setShowPaymentDialog}
            cart={activeCart}
            cartItems={cartItems}
            onSuccess={loadCartData}
          />
        </>
      )}

      {/* Camera Scanner Modal */}
      {showCameraScanner && (
        <CameraScanner
          isOpen={showCameraScanner}
          onClose={() => setShowCameraScanner(false)}
          onScan={handleBarcodeScanned}
        />
      )}
    </div>
  )
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: () => void }) {
  const stockLevel = Math.floor(Math.random() * 100) // Mock stock data - replace with real data
  const monthlysSales = Math.floor(Math.random() * 200) // Mock sales data
  const margin = product.unit_price - product.purchase_price
  const marginPercent = ((margin / product.unit_price) * 100).toFixed(0)

  const getStockColor = (stock: number) => {
    if (stock < 10) return "text-red-600"
    if (stock < 30) return "text-orange-600"
    return "text-green-600"
  }

  return (
    <Card className="group cursor-pointer transition-all hover:shadow-lg hover:bg-accent" onClick={onAdd}>
      <CardContent className="p-3">
        <div className="mb-2 flex items-start justify-between">
          <div className="flex-1">
            <p className="mb-0.5 truncate text-sm font-medium">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.code || product.barcode}</p>
          </div>
          {stockLevel < 10 && <Badge variant="destructive" className="text-xs shrink-0">Alerte</Badge>}
        </div>
        
        <div className="space-y-1.5 mb-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Stock:</span>
            <span className={`font-semibold ${getStockColor(stockLevel)}`}>{stockLevel}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Ventes/mois:</span>
            <span className="font-semibold">{monthlysSales}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Marge:</span>
            <span className="font-semibold text-green-600">{marginPercent}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="font-bold text-sm text-primary">{formatCurrency(product.unit_price)}</span>
          <span className="text-xs text-muted-foreground">{formatCurrency(product.purchase_price)} cout</span>
        </div>
      </CardContent>
    </Card>
  )
}

const clientTypeLabels: Record<ClientType, string> = {
  COMPTANT: "Comptant",
  IPM_MUTUELLE: "IPM/Mutuelle",
  CLIENT_COMPTE: "Client compte",
  CLIENT_CREDIT: "Crédit",
  PROFORMA: "Pro-forma",
}

const clientTypeColors: Record<ClientType, string> = {
  COMPTANT: "bg-green-100 text-green-800",
  IPM_MUTUELLE: "bg-blue-100 text-blue-800",
  CLIENT_COMPTE: "bg-purple-100 text-purple-800",
  CLIENT_CREDIT: "bg-orange-100 text-orange-800",
  PROFORMA: "bg-gray-100 text-gray-800",
}
