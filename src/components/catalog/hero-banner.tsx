import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TextReveal } from "@/components/animations/text-reveal"
import { MagneticButton } from "@/components/animations/magnetic-button"

export function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background with gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to right, #0a0a0f, #12121a)",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-16 md:py-0 md:min-h-[400px]">
        {/* Left side: Text content */}
        <div className="z-10 flex max-w-xl flex-col gap-6">
          <div className="animate-in fade-in slide-in-from-left-8 duration-700 ease-out fill-mode-both">
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Tecnolog&iacute;a de
            </p>
            <TextReveal 
              text="Alto Rendimiento" 
              className="mt-2 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl md:text-6xl"
              delay={0.2} 
            />
          </div>
          <p className="max-w-md text-base text-muted-foreground md:text-lg animate-in fade-in slide-in-from-left-8 duration-700 delay-150 ease-out fill-mode-both">
            Encontr&aacute; los mejores productos de computaci&oacute;n al mejor precio
          </p>
          <div className="animate-in fade-in slide-in-from-left-8 duration-700 delay-300 ease-out fill-mode-both w-fit">
            <MagneticButton intensity={0.4}>
              <Button asChild size="lg" className="font-semibold">
                <Link href="/catalogo">Ver productos</Link>
              </Button>
            </MagneticButton>
          </div>
        </div>

        {/* Right side: Decorative glow (hidden on mobile) */}
        <div className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 md:block animate-in fade-in zoom-in-75 duration-1000 ease-out fill-mode-both">
          <div
            className="h-[350px] w-[350px] rounded-full lg:h-[450px] lg:w-[450px]"
            style={{
              background:
                "radial-gradient(circle, rgba(0,212,255,0.15) 0%, rgba(0,212,255,0.05) 40%, transparent 70%)",
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full lg:h-[250px] lg:w-[250px]"
            style={{
              background:
                "radial-gradient(circle, rgba(0,212,255,0.2) 0%, rgba(0,212,255,0.08) 50%, transparent 70%)",
            }}
          />
        </div>
      </div>
    </section>
  )
}
