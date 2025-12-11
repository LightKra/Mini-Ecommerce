# Mini E-commerce Backend

API RESTful para el Mini E-commerce, construida con NestJS 11, TypeORM y MySQL.

## Características

- 🔐 **Autenticación**: JWT con refresh tokens y endpoint `/auth/me`
- 👥 **Usuarios**: Control de acceso basado en roles (admin/customer)
- 📦 **Catálogo**: Categorías, productos con imágenes, búsqueda y filtros
- 🛒 **Carrito**: Agregar, actualizar y eliminar items
- 📋 **Órdenes**: Creación, gestión de estados e historial
- 📍 **Direcciones**: Gestión de direcciones de envío

## Tecnologías

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| NestJS | 11.x | Framework backend |
| TypeORM | 0.3.x | ORM con migraciones |
| MySQL | 8.x | Base de datos |
| Passport JWT | 4.x | Autenticación |
| Swagger | 11.x | Documentación API |
| class-validator | 0.14.x | Validación de DTOs |

## Requisitos

- Node.js v18 o superior
- MySQL 8.0 o superior
- npm

## Instalación

```bash
# Navegar al directorio backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores
```

## Variables de Entorno

```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=ecommerce
DB_PASSWORD=ecommerce
DB_DATABASE=mini_ecommerce

# JWT
JWT_SECRET=tu-clave-secreta-cambiar-en-produccion
JWT_EXPIRATION=1d

# Aplicación
PORT=3000
```

## Ejecutar la Aplicación

```bash
# Desarrollo (con hot reload)
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## Migraciones

### Desarrollo
```bash
# Ejecutar migraciones pendientes
npm run migration:run:dev

# Revertir última migración
npm run migration:revert:dev

# Ver estado de migraciones
npm run migration:show:dev

# Generar migración (después de cambios en entidades)
npm run migration:generate:dev src/migrations/NombreMigracion
```

### Producción
```bash
# Ejecutar migraciones
npm run migration:run:prod

# Revertir última migración
npm run migration:revert:prod
```

## Seeds (Datos de Prueba)

```bash
# Ejecutar seeds (construye y ejecuta)
npm run seed
```

Esto crea:
- Roles: `admin`, `customer`
- Usuarios de prueba
- Categorías
- Productos con imágenes

## Usuarios de Prueba

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@example.com | admin123 |
| Customer | customer@example.com | customer123 |

## Documentación API

Una vez ejecutando, accede a Swagger:

```
http://localhost:3000/api/docs
```

## Endpoints API

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/logout` | Cerrar sesión (auth) |
| POST | `/api/auth/refresh` | Refrescar token |
| GET | `/api/auth/me` | Obtener usuario actual (auth) |

### Usuarios
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/users` | Listar usuarios (admin) |
| GET | `/api/users/:id` | Obtener usuario por ID |
| POST | `/api/users` | Crear usuario |
| PATCH | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Eliminar usuario |

### Categorías
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/categories` | Listar categorías |
| GET | `/api/categories/:id` | Obtener por ID |
| GET | `/api/categories/slug/:slug` | Obtener por slug |
| POST | `/api/categories` | Crear categoría (admin) |
| PATCH | `/api/categories/:id` | Actualizar (admin) |
| DELETE | `/api/categories/:id` | Eliminar (admin) |

### Productos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products` | Listar productos (con filtros) |
| GET | `/api/products/:id` | Obtener por ID |
| GET | `/api/products/slug/:slug` | Obtener por slug |
| POST | `/api/products` | Crear producto (admin) |
| PATCH | `/api/products/:id` | Actualizar (admin) |
| DELETE | `/api/products/:id` | Eliminar (admin) |
| POST | `/api/products/:id/images` | Agregar imagen (admin) |
| DELETE | `/api/products/:id/images/:imageId` | Eliminar imagen (admin) |

**Filtros de productos:**
- `search` - Búsqueda por nombre
- `categoryId` - Filtrar por categoría
- `minPrice` / `maxPrice` - Rango de precios
- `page` / `limit` - Paginación

### Carrito
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/cart` | Obtener carrito (auth) |
| POST | `/api/cart` | Agregar item (auth) |
| PATCH | `/api/cart/items/:itemId` | Actualizar cantidad (auth) |
| DELETE | `/api/cart/items/:itemId` | Eliminar item (auth) |
| DELETE | `/api/cart` | Vaciar carrito (auth) |
| GET | `/api/cart/total` | Obtener total (auth) |

### Órdenes
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/orders` | Listar mis órdenes (auth) |
| GET | `/api/orders/admin` | Listar todas (admin) |
| GET | `/api/orders/:id` | Obtener por ID (auth) |
| POST | `/api/orders` | Crear orden (auth) |
| PATCH | `/api/orders/:id/status` | Cambiar estado (admin) |
| PATCH | `/api/orders/:id/cancel` | Cancelar orden (auth) |

### Direcciones
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/addresses` | Listar direcciones (auth) |
| GET | `/api/addresses/:id` | Obtener por ID (auth) |
| POST | `/api/addresses` | Crear dirección (auth) |
| PATCH | `/api/addresses/:id` | Actualizar (auth) |
| DELETE | `/api/addresses/:id` | Eliminar (auth) |

### Roles
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/roles` | Listar roles |
| GET | `/api/roles/:id` | Obtener por ID |
| POST | `/api/roles` | Crear rol |
| PATCH | `/api/roles/:id` | Actualizar rol |
| DELETE | `/api/roles/:id` | Eliminar rol |

## Estructura del Proyecto

```
src/
├── config/                 # Configuración
│   ├── database.config.ts  # Config de MySQL
│   └── jwt.config.ts       # Config de JWT
├── migrations/             # Migraciones de DB
├── modules/                # Módulos de funcionalidades
│   ├── auth/               # Autenticación
│   │   ├── entities/       # Token entity
│   │   ├── dto/            # Login, Register DTOs
│   │   ├── guards/         # JWT Guard
│   │   ├── decorators/     # @CurrentUser
│   │   └── strategies/     # JWT Strategy
│   ├── users/              # Usuarios
│   ├── roles/              # Roles
│   ├── categories/         # Categorías
│   ├── products/           # Productos e imágenes
│   ├── cart/               # Carrito
│   ├── orders/             # Órdenes
│   └── addresses/          # Direcciones
├── seeds/                  # Datos semilla
├── app.module.ts           # Módulo principal
├── data-source.ts          # DataSource para migraciones
└── main.ts                 # Entry point
```

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run start:dev` | Desarrollo con hot reload |
| `npm run start:prod` | Producción |
| `npm run build` | Compilar TypeScript |
| `npm run lint` | Ejecutar ESLint |
| `npm run test` | Ejecutar tests |
| `npm run seed` | Ejecutar seeds |
| `npm run migration:run:dev` | Ejecutar migraciones (dev) |
| `npm run migration:run:prod` | Ejecutar migraciones (prod) |

## Docker

### Desarrollo
```bash
# Desde la raíz del proyecto
docker-compose up backend
```

### Producción
```bash
# Construir imagen
docker build -t mini-ecommerce-backend -f Dockerfile .

# El entrypoint ejecuta automáticamente:
# 1. Migraciones
# 2. Seeds
# 3. Inicia la aplicación
```

## Licencia

MIT
