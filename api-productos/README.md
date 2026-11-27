# API de productos: JSON, SQLite y MySQL

Taller de evolución de persistencia con Node.js y Express. Las tres implementaciones mantienen las rutas CRUD de productos y cambian únicamente el modelo y la configuración de almacenamiento.

## Requisitos

- Node.js y npm.
- MySQL o MariaDB para el momento 3.

## Ejecución

Cada momento es independiente. Entra a su carpeta, instala sus dependencias y ejecuta el script indicado:

```bash
cd momento1-json
npm install
npm run dev
```

Para las otras versiones usa `momento2-sqlite` o `momento3-mysql`. En cada carpeta, `npm start` inicia el servidor sin nodemon. Las APIs escuchan por defecto en `http://localhost:3000`; cambia `PORT` si ejecutas más de una a la vez.

### Momento 1: JSON

Persiste productos en `data/productos.json`. El archivo se crea con `[]` al iniciar si aún no existe.

### Momento 2: SQLite

Usa `better-sqlite3`; crea `data/productos.db` y la tabla `productos` al iniciar. El archivo local de base de datos no se versiona.

### Momento 3: MySQL

1. Ejecuta `sql/taller_node.sql` en MySQL/MariaDB.
2. Copia `.env.example` a `.env` y configura las variables de tu base local.
3. Ejecuta `npm install` y `npm run dev`.

No publiques `.env`. La base `taller_node` debe existir y el usuario de conexión debe tener permisos sobre ella.

## Rutas disponibles

- `GET /api/productos`
- `GET /api/productos/:id`
- `POST /api/productos` con `{ "nombre": "Laptop HP", "precio": 2500000, "stock": 10 }`
- `PUT /api/productos/:id` con los campos a actualizar
- `DELETE /api/productos/:id`

La creación responde con 201; los identificadores inexistentes con 404; una solicitud inválida con 400; y la eliminación correcta con 204.
