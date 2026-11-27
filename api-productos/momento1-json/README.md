# Momento 1: almacenamiento JSON

## Requisitos

Node.js y npm.

## Instalación y ejecución

```bash
npm install
npm run dev
```

## Persistencia

El modelo lee y escribe `data/productos.json`. Si falta el archivo, el servidor lo crea con un arreglo vacío.

## Endpoints

`GET` y `POST /api/productos`; `GET`, `PUT` y `DELETE /api/productos/:id`.
