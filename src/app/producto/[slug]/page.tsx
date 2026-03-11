import { notFound } from "next/navigation"
import { ProductImages } from "@/components/product/product-images"
import { ProductInfo } from "@/components/product/product-info"
import { AddToCart } from "@/components/product/add-to-cart"
import { ProductGrid } from "@/components/catalog/product-grid"
import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav"
import { Separator } from "@/components/ui/separator"
import { getProductBySlug, getRelatedProducts } from "@/lib/db/products" // Use DB service

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const product = await getProductBySlug(decodedSlug)

  if (!product) {
    notFound()
  }

  // Fetch related products (using categoryId from the product)
  const related = await getRelatedProducts(product.id, product.categoryId, 4)
  const category = product.category

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 pb-12">
      <BreadcrumbNav
        items={[
          { label: "Inicio", href: "/" },
          ...(category
            ? [{ label: category.name, href: `/catalogo?cat=${category.slug}` }]
            : []),
          { label: product.model },
        ]}
      />

      {/* Product detail: 2 columns */}
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
          <ProductImages images={product.images} productName={product.brand} />
        </div>

        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 ease-out fill-mode-both">
          <ProductInfo product={product} />
          <AddToCart product={product} />
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 ease-out fill-mode-both">
          <Separator className="my-10" />
          <ProductGrid
            products={related}
            title="Productos relacionados"
          />
        </div>
      )}
    </div>
  )
}
