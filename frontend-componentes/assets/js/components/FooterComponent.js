export class FooterComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `
      <style>
        footer { padding:1rem; background:var(--primary-color,#4caf50); color:#fff; text-align:center; font-family:var(--font-family,Arial,sans-serif); }
        p { margin:0; font-size:.92rem; }
      </style>
      <footer><p id="footer-text"></p></footer>`;
  }
  connectedCallback() {
    const company = this.getAttribute('data-company') || 'Taller Front-End';
    this.shadowRoot.getElementById('footer-text').textContent = `Ejercicio académico · ${company} · Sin conexión a un backend`;
  }
}
customElements.define('app-footer', FooterComponent);
