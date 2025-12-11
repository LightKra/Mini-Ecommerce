import Link from "next/link";
import { Package, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-stone-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <Package className="w-6 h-6 text-stone-900" />
              </div>
              <span className="text-xl font-bold text-stone-100">MiniShop</span>
            </Link>
            <p className="text-stone-400 text-sm">
              Tu tienda online de confianza. Productos de calidad al mejor precio.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-stone-100 font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-stone-400 hover:text-amber-400 transition-colors text-sm"
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-stone-400 hover:text-amber-400 transition-colors text-sm"
                >
                  Categorías
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="text-stone-400 hover:text-amber-400 transition-colors text-sm"
                >
                  Mis Pedidos
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-stone-100 font-semibold mb-4">Atención al Cliente</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-stone-400 hover:text-amber-400 transition-colors text-sm"
                >
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-stone-400 hover:text-amber-400 transition-colors text-sm"
                >
                  Política de Devoluciones
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-stone-400 hover:text-amber-400 transition-colors text-sm"
                >
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-stone-100 font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-stone-400 text-sm">
                <Mail className="w-4 h-4 text-amber-500" />
                contacto@minishop.com
              </li>
              <li className="flex items-center gap-2 text-stone-400 text-sm">
                <Phone className="w-4 h-4 text-amber-500" />
                +1 234 567 890
              </li>
              <li className="flex items-center gap-2 text-stone-400 text-sm">
                <MapPin className="w-4 h-4 text-amber-500" />
                Ciudad, País
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-stone-800 text-center">
          <p className="text-stone-500 text-sm">
            © {new Date().getFullYear()} MiniShop. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

