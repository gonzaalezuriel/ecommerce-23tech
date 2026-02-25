import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/50" style={{ backgroundColor: "#07070c" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-between">
          {/* Column 1: Logo + description */}
          <div className="space-y-3">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold">
                <span className="text-[#00d4ff]">23</span>
                <span className="text-white">Tech</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tu tienda de tecnología de confianza
            </p>
          </div>



          {/* Column 4: Contacto */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4 shrink-0" />
                <span>info@23tech.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4 shrink-0" />
                <span>+54 11 5555-6666</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4 shrink-0" />
                <span>Av. Corrientes 1234, CABA</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/50 px-4 md:px-6 py-4">
        <p className="text-center text-xs text-muted-foreground">
          &copy; 2026 23Tech. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
