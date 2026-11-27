import './components/NavComponent.js';
import './components/FooterComponent.js';
import './components/RegisterComponent.js';

const app = document.getElementById('app-view');
const templates = {
  login: `
    <section class="form-card"><h1>Iniciar sesión</h1><p class="intro">Ingresa tu usuario y contraseña.</p>
      <p class="form-message" role="status" aria-live="polite"></p>
      <form data-success="Formulario validado. No hay servidor de autenticación en esta práctica.">
        <label for="username">Usuario</label><input id="username" name="username" autocomplete="username" pattern="[a-zA-Z0-9_]{4,20}" required>
        <label for="password">Contraseña</label><input id="password" name="password" type="password" autocomplete="current-password" pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}" title="Usa 8 caracteres como mínimo, con mayúscula, minúscula y número." required>
        <button type="submit">Ingresar</button>
      </form><div class="form-links"><a href="#register" data-route="register">Crear cuenta</a><a href="#forgot" data-route="forgot">¿Olvidaste tu contraseña?</a></div>
    </section>`,
  forgot: `
    <section class="form-card"><h1>Recuperar contraseña</h1><p class="intro">Escribe el correo asociado a tu cuenta.</p>
      <p class="form-message" role="status" aria-live="polite"></p>
      <form data-success="Formulario validado. El envío de correo requiere un backend.">
        <label for="email">Correo electrónico</label><input id="email" name="email" type="email" autocomplete="email" required>
        <button type="submit">Solicitar recuperación</button>
      </form><div class="form-links"><a href="#reset" data-route="reset">Ir a cambio de contraseña</a><a href="#login" data-route="login">Volver al inicio</a></div>
    </section>`,
  reset: `
    <section class="form-card"><h1>Cambiar contraseña</h1><p class="intro">Define la nueva contraseña.</p>
      <p class="form-message" role="status" aria-live="polite"></p>
      <form data-success="Formulario validado. Para guardar el cambio se necesita un backend.">
        <label for="password">Nueva contraseña</label><input id="password" name="password" type="password" autocomplete="new-password" pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}" title="Usa 8 caracteres como mínimo, con mayúscula, minúscula y número." required>
        <label for="confirm-password">Confirmar contraseña</label><input id="confirm-password" name="confirmPassword" type="password" autocomplete="new-password" required>
        <button type="submit">Cambiar contraseña</button>
      </form><div class="form-links"><a href="#login" data-route="login">Volver al inicio</a></div>
    </section>`,
};

function render(route = 'login') {
  app.replaceChildren();
  if (route === 'register') {
    app.innerHTML = '<app-register></app-register>';
    return;
  }
  app.innerHTML = templates[route] || templates.login;
  const form = app.querySelector('form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const invalid = form.querySelector(':invalid');
    const message = form.querySelector('.form-message');
    if (invalid) {
      invalid.reportValidity();
      message.textContent = invalid.validationMessage;
      message.classList.add('error');
      return;
    }
    const password = form.elements.password;
    const confirmation = form.elements.confirmPassword;
    if (password && confirmation && password.value !== confirmation.value) {
      message.textContent = 'Las contraseñas no coinciden.';
      message.classList.add('error');
      confirmation.focus();
      return;
    }
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    try {
      await Promise.resolve();
      message.textContent = form.dataset.success;
      message.classList.remove('error');
    } finally {
      button.disabled = false;
    }
  });
  app.querySelectorAll('[data-route]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      render(link.dataset.route);
    });
  });
}

document.addEventListener('app-navigate', (event) => render(event.detail.route));
document.addEventListener('user-registered', () => {
  const links = app.querySelector('.form-links');
  if (links) links.scrollIntoView({ block: 'nearest' });
});
render(location.hash.slice(1) || 'login');
