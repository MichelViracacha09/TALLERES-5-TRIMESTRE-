# Front-End con componentes JavaScript

Continuación de la práctica multipágina en `../frontend/`. Esta versión consolida la navegación y el formulario de registro en una SPA con componentes web nativos de JavaScript (`<app-nav>`, `<app-footer>` y `<app-register>`), `HTMLElement`, Shadow DOM y eventos personalizados.

## Requisitos y ejecución

Requiere un navegador moderno con módulos ES. No tiene dependencias npm ni proceso de compilación. Sirve la carpeta con Live Server en VS Code o, si tienes PHP instalado, abre una terminal aquí y ejecuta `php -S 127.0.0.1:8000`; visita `http://127.0.0.1:8000`.

## Vistas

La navegación permite iniciar sesión, registrarse, solicitar recuperación y cambiar contraseña. Las vistas de autenticación validan datos localmente; no existe servidor, envío de correo, almacenamiento de usuarios ni autenticación real. No ingreses credenciales reales.

## Estructura

- `index.html`: shell SPA.
- `assets/js/components/NavComponent.js`: navegación adaptable y evento `app-navigate`.
- `assets/js/components/FooterComponent.js`: pie reutilizable.
- `assets/js/components/RegisterComponent.js`: registro y evento `user-registered`.
- `assets/js/main.js`: renderizado de vistas y coordinación.
- `assets/css/style.css`: variables y estilos globales.
