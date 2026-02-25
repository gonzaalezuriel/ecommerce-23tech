"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CartItemRow } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { createOrder } from "@/actions/order-actions";
import { validateCart } from "@/actions/cart-actions";
import { getUserProfile } from "@/actions/user-actions";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearLocalCart,
    total,
    fetchDBCart,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isValidating, setIsValidating] = useState(true);

  // CU016: Al abrir el carrito, limpiar productos inactivos/sin stock (las notificaciones las maneja fetchDBCart)
  useEffect(() => {
    if (!isAuthenticated) return
    setIsValidating(true)
    validateCart()
      .then(() => {
        return fetchDBCart?.()
      })
      .catch(() => {
        return fetchDBCart?.()
      })
      .finally(() => setIsValidating(false))
  }, [isAuthenticated, fetchDBCart]);

  // CU018: Pre-completar dirección y teléfono desde el perfil del usuario
  useEffect(() => {
    if (!isAuthenticated) return;
    getUserProfile().then((profile) => {
      if (profile?.address) setAddress(profile.address);
      if (profile?.phone) setPhone(profile.phone);
    });
  }, [isAuthenticated]);

  function handleCheckout() {
    if (!isAuthenticated) {
      toast.error("Iniciá sesión para finalizar tu compra");
      router.push("/auth/login");
      return;
    }
    setCheckoutOpen(true);
  }

  function confirmCheckout() {
    if (!address.trim() || !phone.trim()) {
      toast.error("Completá la dirección y teléfono");
      return;
    }

    startTransition(async () => {
      const result = await createOrder({ address, phone });

      if (result?.error) {
        toast.error(result.error);
        await validateCart().catch(() => {});
        
        // Recargar el carrito en silencio, sin que fetchDBCart tire su propio toast duplicando la queja
        await fetchDBCart?.(true);
        setCheckoutOpen(false);
        return;
      }

      if (result?.success) {
        setCheckoutOpen(false);
        setAddress("");
        setPhone("");

        if (result.url) {
          window.location.href = result.url; // Redirigir a la pasarela de pago
        } else {
          toast.success("¡Compra realizada con éxito!");
          router.push("/historial");

          // Limpieza visual "detrás de la cortina" después de navegar
          setTimeout(() => {
            clearLocalCart();
          }, 500);
        }
      }
    });
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 pb-12">
        <BreadcrumbNav
          items={[{ label: "Inicio", href: "/" }, { label: "Carrito" }]}
        />
        <div className="mt-16 flex flex-col items-center justify-center gap-4 text-center">
          <ShoppingBag className="size-16 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground">
            Tu carrito está vacío
          </h2>
          <p className="text-muted-foreground">
            Explorá nuestros productos y agregá los que te gusten
          </p>
          <Button asChild className="mt-2">
            <Link href="/catalogo">Ver catálogo</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 pb-12">
      <BreadcrumbNav
        items={[{ label: "Inicio", href: "/" }, { label: "Carrito" }]}
      />

      <h1 className="mt-4 text-2xl font-bold text-foreground">Mi Carrito</h1>

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        {/* Cart items */}
        <div className="flex flex-1 flex-col gap-4">
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onQuantityChange={(_id, qty) =>
                updateQuantity(item.productId, qty)
              }
              onRemove={() => removeItem(item.productId)}
            />
          ))}
        </div>

        {/* Summary sidebar */}
        <div className="w-full lg:w-80">
          <div className="sticky top-20">
            <CartSummary
              itemCount={items.reduce((sum, i) => sum + i.quantity, 0)}
              total={total}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>

      {/* Checkout confirmation dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar compra</DialogTitle>
            <DialogDescription>
              Completá los datos para finalizar tu compra.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="address">Dirección de envío</Label>
              <Input
                id="address"
                placeholder="Ej: Av. Corrientes 1234, CABA"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                placeholder="Ej: 1155556666"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCheckoutOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button onClick={confirmCheckout} disabled={isPending}>
              {isPending ? "Procesando pago..." : "Confirmar compra"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
