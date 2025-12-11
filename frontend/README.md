# Mini E-commerce Frontend

Frontend moderno para el Mini E-commerce, construido con Next.js 16, React 19 y TailwindCSS.

## Tecnologías

- **Next.js 16** - Framework React con App Router
- **React 19** - Librería de UI
- **TypeScript** - Tipado estático
- **TailwindCSS 4** - Estilos utilitarios
- **TanStack Query** - Gestión de estado del servidor
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos

## Estructura del Proyecto

```
frontend/
├── app/                    # App Router (páginas)
│   ├── categories/         # Páginas de categorías
│   ├── checkout/           # Página de checkout
│   ├── orders/             # Páginas de pedidos
│   ├── products/           # Páginas de productos
│   ├── profile/            # Páginas de perfil
│   ├── globals.css         # Estilos globales
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Página de inicio
├── components/             # Componentes reutilizables
│   ├── auth/               # Componentes de autenticación
│   ├── layout/             # Header, Footer, CartSidebar
│   ├── product/            # ProductCard, ProductGrid
│   ├── ui/                 # Button, Input, Modal, etc.
│   └── providers.tsx       # Providers de React Query
├── context/                # Context API (estados del cliente)
│   ├── auth-context.tsx    # Autenticación
│   └── ui-context.tsx      # Estados de UI
├── lib/
│   └── services/           # Servicios de API
├── queries/                # Hooks de TanStack Query
└── public/                 # Archivos estáticos
```

## Arquitectura de Estado

### Estados del Servidor (TanStack Query)
Usados para datos que vienen del API:
- Productos, Categorías
- Carrito, Órdenes
- Usuario, Direcciones

### Estados del Cliente (Context API)
Usados para estados de UI que no dependen del API:
- `AuthContext` - Usuario autenticado, logout
- `UIContext` - Cart sidebar, menú móvil, modal de auth

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

## Variables de Entorno

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Construye para producción |
| `npm start` | Inicia servidor de producción |
| `npm run lint` | Ejecuta ESLint |

## Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio con productos destacados y categorías |
| `/products` | Lista de productos con filtros y paginación |
| `/products/[slug]` | Detalle de producto |
| `/categories` | Lista de categorías |
| `/categories/[slug]` | Productos por categoría |
| `/checkout` | Proceso de checkout |
| `/orders` | Lista de pedidos del usuario |
| `/orders/[id]` | Detalle de pedido |
| `/profile` | Perfil del usuario |
| `/profile/addresses` | Gestión de direcciones |

## Hooks de TanStack Query

### Productos
```typescript
import { useProducts, useProduct, useProductBySlug } from "@/queries";

const { data, isLoading } = useProducts({ page: 1, limit: 10 });
const { data: product } = useProductBySlug("iphone-15-pro");
```

### Carrito
```typescript
import { useCart, useAddToCart, useRemoveFromCart } from "@/queries";

const { data: cart } = useCart();
const addToCart = useAddToCart();
addToCart.mutate({ productId: 1, quantity: 2 });
```

### Autenticación
```typescript
import { useLogin, useRegister, useLogout } from "@/queries";

const login = useLogin();
login.mutate({ email: "user@example.com", password: "123456" });
```

## Componentes UI

### Button
```tsx
<Button variant="primary" size="lg" isLoading={loading}>
  Guardar
</Button>

<Button asChild>
  <Link href="/products">Ver Productos</Link>
</Button>
```

### Input
```tsx
<Input 
  label="Email" 
  type="email" 
  error={errors.email} 
  placeholder="correo@ejemplo.com" 
/>
```

### Modal
```tsx
<Modal isOpen={isOpen} onClose={close} title="Título">
  Contenido del modal
</Modal>
```

## Docker

### Desarrollo
```bash
# Desde la raíz del proyecto
docker-compose up frontend
```

### Producción
```bash
# Construir imagen
docker build -t mini-ecommerce-frontend .

# Ejecutar contenedor
docker run -p 3001:3000 mini-ecommerce-frontend
```

## Características

- ✅ Diseño responsive (móvil y desktop)
- ✅ Tema oscuro moderno
- ✅ Carrito de compras con sidebar
- ✅ Autenticación con JWT
- ✅ Persistencia de sesión
- ✅ Gestión de direcciones
- ✅ Historial de pedidos
- ✅ Búsqueda y filtros de productos
- ✅ Paginación
- ✅ Optimistic updates en carrito
- ✅ Skeletons de carga
- ✅ Manejo de errores

## Licencia

MIT

