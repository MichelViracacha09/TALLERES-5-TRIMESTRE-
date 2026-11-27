# Taller Front-End: autenticación y validación

Versión multipágina del taller. Incluye inicio de sesión, registro, solicitud de recuperación y cambio de contraseña con HTML semántico, validación nativa y expresiones regulares, menú adaptable y estado de carga.

## Requisitos e instalación

No requiere dependencias externas ni proceso de compilación. Abre `index.html` en un navegador moderno. También puedes servir la carpeta con cualquier servidor estático.

## Alcance

Es una práctica de interfaz: no existe servidor, base de datos, envío de correo ni autenticación real. Los formularios solo validan los datos en el navegador y muestran el resultado; no almacenan ni transmiten contraseñas. No uses credenciales reales.

## Archivos

- `index.html`: inicio de sesión.
- `register.html`: registro.
- `forgot-password.html`: solicitud de recuperación.
- `reset-password.html`: cambio de contraseña.
- `assets/css/style.css`: estilos globales y responsivos.
- `assets/js/main.js`: validación del formulario, menú móvil y estado de carga con `AbortController`.
