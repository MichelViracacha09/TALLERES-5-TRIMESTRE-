# PQRS con CodeIgniter 4

Entrega existente del taller de PQRS. Se conserva el código de la carpeta original; esta copia excluye `.env`, `vendor/` y archivos generados de `writable/`.

## Requisitos

- PHP 8.1 o superior con `intl`, `mbstring`, `json` y `mysqli`.
- Composer.
- MySQL o MariaDB.

## Instalación

1. En MySQL, importa `database/pqrs_system.sql`. **Este script elimina y recrea `pqrs_system`; haz un respaldo si ya existe información.**
2. Copia `env` a `.env` y ajusta `database.default.*` y la clave JWT para tu entorno local.
3. Instala las dependencias: `composer install`.
4. Inicia desde esta carpeta con `php spark serve`.
5. La colección de Postman está en `postman/PQRS-Seguridad.postman_collection.json`.

`vendor/` se regenera con Composer; `writable/` contiene solo los archivos base y CodeIgniter creará allí sus archivos temporales.
