export class RegisterComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `
      <style>
        :host { display:block; color:var(--text-color,#26332b); font-family:var(--font-family,Arial,sans-serif); }
        .card { width:min(100%,28rem); padding:clamp(1.5rem,4vw,2.4rem); border-radius:var(--border-radius,5px); background:#fff; box-shadow:var(--box-shadow,0 2px 4px rgb(0 0 0 / 10%)); }
        h1 { margin:0 0 .5rem; font-size:clamp(1.7rem,5vw,2.1rem); }
        p { margin:0 0 1.2rem; color:var(--muted-color,#5c6c61); }
        form { display:grid; gap:.55rem; }
        label { margin-top:.35rem; font-weight:700; }
        input { width:100%; min-height:2.8rem; padding:.65rem .75rem; border:1px solid #b8c4bb; border-radius:.35rem; color:inherit; font:inherit; box-sizing:border-box; }
        button { min-height:2.9rem; margin-top:.7rem; border:0; border-radius:.4rem; padding:.7rem 1rem; background:var(--primary-color,#4caf50); color:#fff; font:inherit; font-weight:700; cursor:pointer; }
        button:hover { background:var(--primary-dark,#32813a); }
        .message { min-height:1.5rem; margin:.7rem 0 0; padding:0; }
        .message:not(:empty) { padding:.65rem .75rem; border-radius:.35rem; background:#e8f5e9; color:#245a2b; }
        .message.error { background:#ffebee; color:#a61b1b; }
      </style>
      <section class="card" aria-labelledby="register-title"><h1 id="register-title">Registro</h1><p>Completa los datos para validar el formulario.</p>
        <form id="register-form">
          <label for="username">Usuario</label><input id="username" name="username" autocomplete="username" pattern="[a-zA-Z0-9_]{4,20}" title="Usa entre 4 y 20 letras, números o guiones bajos." required>
          <label for="email">Correo electrónico</label><input id="email" name="email" type="email" autocomplete="email" required>
          <label for="phone">Teléfono</label><input id="phone" name="phone" type="tel" autocomplete="tel" pattern="\+?[0-9\s()\-]{7,20}" title="Ingresa un teléfono válido." required>
          <label for="password">Contraseña</label><input id="password" name="password" type="password" autocomplete="new-password" pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}" title="Usa 8 caracteres como mínimo, con mayúscula, minúscula y número." required>
          <button type="submit">Registrarme</button>
        </form><div class="message" id="message" role="status" aria-live="polite"></div>
      </section>`;
  }
  connectedCallback() {
    this.shadowRoot.getElementById('register-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!form.reportValidity()) return;
      const detail = {
        username: form.elements.username.value,
        email: form.elements.email.value,
        phone: form.elements.phone.value,
      };
      const message = this.shadowRoot.getElementById('message');
      message.classList.remove('error');
      message.textContent = 'Formulario validado. Esta práctica no guarda ni envía los datos.';
      this.dispatchEvent(new CustomEvent('user-registered', { detail, bubbles: true, composed: true }));
    });
  }
}
customElements.define('app-register', RegisterComponent);
