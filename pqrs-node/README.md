# PQRS Backend API

API del taller PQRS con Node.js, Express, Sequelize y MySQL/MariaDB. Las entregas siguen las partes 1, 2 y 3 de las guías del instructor: autenticación, control de acceso por rol, gestión de catálogos, roles, usuarios, perfiles, módulos, PQRS y respuestas con notas internas.

## Requisitos

- Node.js 18 o superior y npm.
- MySQL o MariaDB.

## Instalación

1. Copia `.env.example` a `.env`; configura MySQL y genera una clave JWT local de al menos 32 caracteres. `.env` está excluido de Git.
2. Revisa el aviso del script SQL. `db/pqrs_system.sql` elimina y crea la base `pqrs_system`; úsalo solo en un entorno de desarrollo vacío o después de respaldar tus datos.
3. Ejecuta `db/pqrs_system.sql` en MySQL/MariaDB.
4. Instala dependencias con `npm install`.
5. Inicia en desarrollo con `npm run dev` o en modo normal con `npm start`.

La API queda en `http://localhost:3000/api/v1`; el health check es `/health` y Swagger UI está en `/api-docs`.

## Rutas principales

- Auth: `/auth/login`, `/auth/me`, `/auth/roles`, `/auth/select-role`, `/auth/permissions`.
- Catálogos: `/catalogs/document-types`, `/catalogs/user-status`, `/catalogs/permissions`, `/catalogs/modules`, `/catalogs/pqrs-types`, `/catalogs/pqrs-status`.
- Seguridad: `/roles`, `/users`, `/profiles`, `/modules` y sus rutas CRUD y permisos.
- PQRS: `/pqrs`, `/pqrs/:id/status`, `/pqrs/:id/assign`, `/pqrs/:id/responses` y `/pqrs/stats`.

Las rutas protegidas requieren `Authorization: Bearer <token>`. Los permisos se heredan del rol activo mediante `role_module_permission`. Un usuario ve sus PQRS; el administrador y el gerente pueden consultar el conjunto completo. Las notas internas nunca se muestran al ciudadano.

## Scripts y archivos

- `npm run db:add-is-internal`: agrega la columna de notas internas solo si no existe; ejecuta únicamente después de respaldar la base.
- `postman/PQRS.postman_collection.json`: solicitudes de ejemplo sin tokens ni credenciales privadas.
- `db/pqrs_system.sql`: esquema y datos de catálogo. El usuario admin de demostración viene del SQL del taller; cambia la contraseña después de iniciar sesión localmente.

No subas `.env`, tokens ni credenciales privadas.

La colección Postman trae rutas representativas. Define `adminPassword` y `token` en tu entorno local de Postman después de configurar `.env`; no guardes esos valores en el archivo.
