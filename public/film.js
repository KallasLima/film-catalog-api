(() => {
  function mount() {
    if (document.querySelector('.film-brand')) return true;
    if (!document.querySelector('.swagger-ui .info')) return false;
    const header = document.createElement('header');
    header.className = 'film-brand';
    const name = document.createElement('span');
    name.textContent = 'FILM / API';
    const link = document.createElement('a');
    link.href = '/docs-json';
    link.textContent = 'OpenAPI JSON ↗';
    header.append(name, link);
    document.body.prepend(header);
    return true;
  }
  function repairControls() {
    document.querySelectorAll('.swagger-ui pre.microlight').forEach((code) => {
      code.tabIndex = 0;
      code.setAttribute('aria-label', 'Scrollable code example');
    });
    document.querySelectorAll('.swagger-ui textarea.body-param__text').forEach((field) => {
      field.setAttribute('aria-label', 'JSON request body');
    });
    // Swagger nests a permalink in each expansion button. The enclosing button
    // already supplies keyboard navigation; retain the path as its visible text.
    document
      .querySelectorAll('.opblock-summary-control .opblock-summary-path a[href]')
      .forEach((link) => {
        link.removeAttribute('href');
        link.removeAttribute('tabindex');
      });
  }
  function ready() {
    mount();
    repairControls();
    const observer = new MutationObserver(() => {
      mount();
      repairControls();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
  }
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', ready, { once: true });
  else ready();
})();
