# Momento 2: almacenamiento SQLite

## Requisitos

Node.js y npm. `better-sqlite3` se instala desde npm.

## Instalación y ejecución

```bash
npm install
npm run dev
```

## Persistencia

La conexión crea `data/productos.db` y la tabla `productos` si aún no existen. Activa el modo WAL. El archivo `.db` es local y está excluido del control de versiones.

## Endpoints

`GET` y `POST /api/productos`; `GET`, `PUT` y `DELETE /api/productos/:id`.
