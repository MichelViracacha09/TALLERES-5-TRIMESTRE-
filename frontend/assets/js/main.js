document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  const message = document.getElementById('form-message');
  const menuButton = document.getElementById('menu-toggle');
  const navigation = document.getElementById('site-nav');

  menuButton?.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    navigation?.classList.toggle('is-open', !expanded);
  });

  document.querySelectorAll('[data-auth-form]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      message?.classList.remove('error');
      message?.replaceChildren();

      const invalidField = form.querySelector(':invalid');
      if (invalidField) {
        invalidField.reportValidity();
        showMessage(invalidField.validationMessage, true);
        return;
      }

      const password = form.querySelector('[name="password"]');
      const confirmation = form.querySelector('[name="confirmPassword"]');
      if (password && confirmation && password.value !== confirmation.value) {
        showMessage('Las contraseñas no coinciden.', true);
        confirmation.focus();
        return;
      }

      const controller = new AbortController();
      const submitButton = form.querySelector('[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      if (preloader) preloader.hidden = false;

      try {
        await new Promise((resolve, reject) => {
          const timer = window.setTimeout(resolve, 250);
          controller.signal.addEventListener('abort', () => {
            window.clearTimeout(timer);
            reject(new DOMException('La operación fue cancelada.', 'AbortError'));
          }, { once: true });
        });
        showMessage(form.dataset.success || 'Formulario validado.');
      } catch (error) {
        showMessage(error.name === 'AbortError' ? error.message : 'No fue posible validar el formulario.', true);
      } finally {
        if (preloader) preloader.hidden = true;
        if (submitButton) submitButton.disabled = false;
      }
    });
  });

  function showMessage(text, isError = false) {
    if (!message) return;
    message.textContent = text;
    message.classList.toggle('error', isError);
  }
});
