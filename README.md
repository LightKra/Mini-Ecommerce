# 🛒 Mini E-commerce

Aplicación e-commerce full-stack construida con **NestJS** (Backend) y **Next.js** (Frontend).

## 📋 Tabla de Contenidos

- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos](#-requisitos)
- [Desarrollo](#-desarrollo)
- [Producción](#-producción)
- [URLs de Acceso](#-urls-de-acceso)
- [Usuarios de Prueba](#-usuarios-de-prueba)
- [Comandos Útiles](#-comandos-útiles)
- [Stack Tecnológico](#-stack-tecnológico)

## 📁 Estructura del Proyecto

```
Mini-Ecommerce/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── modules/         # Módulos (auth, users, products, etc.)
│   │   ├── migrations/      # Migraciones de DB
│   │   └── seeds/           # Datos semilla
│   ├── Dockerfile           # Docker producción
│   └── Dockerfile.dev       # Docker desarrollo
├── frontend/                # App Next.js
│   ├── app/                 # Páginas (App Router)
│   ├── components/          # Componentes React
│   ├── context/             # Context API
│   ├── queries/             # Hooks TanStack Query
│   ├── Dockerfile           # Docker producción
│   └── Dockerfile.dev       # Docker desarrollo
├── docker-compose.yml       # Desarrollo
├── docker-compose.prod.yml  # Producción
└── README.md
```

## 📌 Requisitos

- [Docker](https://www.docker.com/get-started) v20.10+
- [Docker Compose](https://docs.docker.com/compose/install/) v2.0+

---

## 🔧 Desarrollo

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd Mini-Ecommerce
```

### 2. Iniciar Servicios de Desarrollo

```bash
# Iniciar todos los servicios (con logs)
docker-compose up

# O en segundo plano
docker-compose up -d
```

Esto levanta:

- **MySQL** - Base de datos
- **Backend** - API NestJS con hot reload
- **Frontend** - Next.js con hot reload
- **phpMyAdmin** - Administrador de DB

### 3. Ejecutar Migraciones y Seeds

```bash
# Ejecutar migraciones
docker-compose exec backend npm run migration:run:dev

# Ejecutar seeds (datos de prueba)
docker-compose exec backend npm run seed
```

### 4. Acceder a la Aplicación

| Servicio     | URL                            |
| ------------ | ------------------------------ |
| Frontend     | http://localhost:3001          |
| Backend API  | http://localhost:3000/api      |
| Swagger Docs | http://localhost:3000/api/docs |
| phpMyAdmin   | http://localhost:8080          |

### Hot Reload

Los cambios en el código se reflejan automáticamente:

- **Backend**: Cambios en `backend/src/` se detectan automáticamente
- **Frontend**: Cambios en `frontend/app/` y `frontend/components/` se detectan automáticamente

### Detener Servicios

```bash
# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (base de datos limpia)
docker-compose down -v
```

---

## 🚀 Producción

### 1. Construir e Iniciar

```bash
# Construir e iniciar servicios de producción
docker-compose -f docker-compose.prod.yml up --build

# O en segundo plano
docker-compose -f docker-compose.prod.yml up --build -d
```

### 2. Proceso Automático

Al iniciar el backend en producción, automáticamente:

1. ✅ Espera a que MySQL esté listo
2. ✅ Ejecuta las migraciones
3. ✅ Ejecuta los seeds
4. ✅ Inicia la aplicación

### 3. Acceder a la Aplicación

| Servicio     | URL                            |
| ------------ | ------------------------------ |
| Frontend     | http://localhost:3001          |
| Backend API  | http://localhost:3000/api      |
| Swagger Docs | http://localhost:3000/api/docs |
| phpMyAdmin   | http://localhost:8080          |

### Detener Servicios

```bash
# Detener
docker-compose -f docker-compose.prod.yml down

# Detener y limpiar volúmenes
docker-compose -f docker-compose.prod.yml down -v
```

---

## 🌐 URLs de Acceso

| Servicio    | Desarrollo                     | Producción                     |
| ----------- | ------------------------------ | ------------------------------ |
| Frontend    | http://localhost:3001          | http://localhost:3001          |
| Backend API | http://localhost:3000/api      | http://localhost:3000/api      |
| Swagger     | http://localhost:3000/api/docs | http://localhost:3000/api/docs |
| phpMyAdmin  | http://localhost:8080          | http://localhost:8080          |

---

## 👤 Usuarios de Prueba

Después de ejecutar los seeds:

| Rol      | Email                | Password    |
| -------- | -------------------- | ----------- |
| Admin    | admin@example.com    | admin123    |
| Customer | customer@example.com | customer123 |

---

## 🛠️ Comandos Útiles

### Docker Compose

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Reconstruir imágenes
docker-compose build --no-cache

# Acceder al shell del backend
docker-compose exec backend sh

# Acceder al shell del frontend
docker-compose exec frontend sh

# Conectar a MySQL
docker-compose exec mysql mysql -u ecommerce -pecommerce mini_ecommerce
```

### Migraciones (Desarrollo)

```bash
# Ejecutar migraciones
docker-compose exec backend npm run migration:run:dev

# Revertir última migración
docker-compose exec backend npm run migration:revert:dev

# Ver estado de migraciones
docker-compose exec backend npm run migration:show:dev
```

### Seeds

```bash
# Ejecutar seeds
docker-compose exec backend npm run seed
```

---

## 🔐 Variables de Entorno

Puedes personalizar la configuración creando un archivo `.env` en la raíz:

```env
# Base de Datos
DB_ROOT_PASSWORD=root
DB_USERNAME=ecommerce
DB_PASSWORD=ecommerce
DB_DATABASE=mini_ecommerce

# JWT
JWT_SECRET=tu-clave-secreta-cambiar-en-produccion
JWT_EXPIRATION=1d
```

---

## 🏗️ Stack Tecnológico

### Backend

| Tecnología   | Versión |
| ------------ | ------- |
| NestJS       | 11.x    |
| TypeORM      | 0.3.x   |
| MySQL        | 8.x     |
| Passport JWT | 4.x     |
| Swagger      | 11.x    |

### Frontend

| Tecnología     | Versión |
| -------------- | ------- |
| Next.js        | 16.x    |
| React          | 19.x    |
| TailwindCSS    | 4.x     |
| TanStack Query | 5.x     |
| TypeScript     | 5.x     |

### DevOps

- Docker & Docker Compose
- Multi-stage builds
- Hot Reload en desarrollo

---

## 📚 Documentación Adicional

- [📖 Backend README](./backend/README.md)
- [📖 Frontend README](./frontend/README.md)
- [📖 API Swagger](http://localhost:3000/api/docs) (cuando está ejecutando)

---

## 📝 Licencia

MIT
