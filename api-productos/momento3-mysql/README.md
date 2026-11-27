# Momento 3: almacenamiento MySQL

## Requisitos

Node.js y npm, y una instancia local MySQL/MariaDB.

## Base de datos y configuración

1. Ejecuta `sql/taller_node.sql` en MySQL. El script aportado crea la tabla `productos` y su clave autoincremental en la base `taller_node`; crea antes esa base si aún no existe.
2. Copia `.env.example` a `.env` y ajusta usuario, contraseña y puerto locales.
3. Instala y ejecuta:

```bash
npm install
npm run dev
```

No incluyas `.env` en Git ni compartas su contenido.

## Endpoints

`GET` y `POST /api/productos`; `GET`, `PUT` y `DELETE /api/productos/:id`. Las consultas usan parámetros `?` y la creación devuelve el `insertId` de MySQL.
