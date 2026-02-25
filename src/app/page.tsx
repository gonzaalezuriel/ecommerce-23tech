import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { HeroBanner } from "@/components/catalog/hero-banner"
import { CategoryNav } from "@/components/catalog/category-nav"
import { ProductCard } from "@/components/catalog/product-card"
import { Button } from "@/components/ui/button"
import { getBestSellers } from "@/lib/db/products"
import { getCategories } from "@/lib/db/categories"

export default async function Home() {
  // Conectar a DB real
  const featuredProducts = await getBestSellers(4)
  const categories = await getCategories()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroBanner />

      {/* Categories Section */}
      <section className="py-8 md:py-12 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-foreground">Categorías Destacadas</h2>
          <CategoryNav categories={categories} />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-8 md:py-12 bg-surface/50 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Más Vendidos</h2>
            <Button variant="ghost" className="gap-2 text-primary hover:text-primary/80" asChild>
              <Link href="/catalogo">
                Ver todos <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Button size="lg" className="px-8" asChild>
              <Link href="/catalogo">
                Explorar Catálogo Completo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features / Benefits Section (Optional Text) */}
      <section className="py-8 md:py-16 bg-background">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-4 md:gap-8 text-center">
          <div className="p-6 rounded-lg border border-border/50 bg-surface/30">
            <h3 className="text-xl font-semibold mb-2 text-primary">Envío a todo el país</h3>
            <p className="text-muted-foreground">Llegamos a cada rincón de Argentina con paquetería segura.</p>
          </div>
          <div className="p-6 rounded-lg border border-border/50 bg-surface/30">
            <h3 className="text-xl font-semibold mb-2 text-primary">Garantía Oficial</h3>
            <p className="text-muted-foreground">Todos nuestros productos cuentan con garantía directa de fabricante.</p>
          </div>
          <div className="p-6 rounded-lg border border-border/50 bg-surface/30">
            <h3 className="text-xl font-semibold mb-2 text-primary">Atención 24/7</h3>
            <p className="text-muted-foreground">Resolvemos tus dudas en cualquier momento del día.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
