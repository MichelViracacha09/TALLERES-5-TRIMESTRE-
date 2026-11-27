export class NavComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `
      <style>
        header { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:1rem clamp(1rem,5vw,4rem); background:var(--primary-color,#4caf50); color:#fff; font-family:var(--font-family,Arial,sans-serif); }
        h1 { margin:0; font-size:1.15rem; }
        button { display:none; border:1px solid #fff; border-radius:var(--border-radius,5px); padding:.45rem .8rem; background:transparent; color:#fff; font:inherit; }
        nav { display:flex; flex-wrap:wrap; gap:1.25rem; }
        a { color:#fff; text-decoration:none; }
        a:hover, a[aria-current="page"] { text-decoration:underline; text-underline-offset:.25em; }
        @media(max-width:620px) { header { position:relative; flex-wrap:wrap; } button { display:block; } nav { display:none; flex-basis:100%; flex-direction:column; gap:.7rem; padding-top:.6rem; } nav.show { display:flex; } }
      </style>
      <header><h1 id="title"></h1><button type="button" id="toggle" aria-expanded="false" aria-controls="nav">Menú</button>
        <nav id="nav" aria-label="Navegación principal">
          <a href="#login" data-route="login">Iniciar sesión</a><a href="#register" data-route="register">Registro</a>
          <a href="#forgot" data-route="forgot">Recuperar contraseña</a>
        </nav>
      </header>`;
  }
  connectedCallback() {
    const root = this.shadowRoot;
    root.getElementById('title').textContent = this.getAttribute('data-title') || 'Autenticación';
    const button = root.getElementById('toggle');
    const nav = root.getElementById('nav');
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('show', !expanded);
    });
    root.querySelectorAll('[data-route]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('app-navigate', {
          detail: { route: link.dataset.route }, bubbles: true, composed: true,
        }));
      });
    });
  }
}
customElements.define('app-nav', NavComponent);
