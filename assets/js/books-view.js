(function () {
  const container = document.querySelector('.books-container');
  if (!container) return;

  const STORAGE_KEY = 'books-view-preference';
  const buttons = document.querySelectorAll('.view-btn');
  const panels = document.querySelectorAll('[data-view-panel]');

  function setView(view) {
    container.setAttribute('data-active-view', view);

    panels.forEach(function (panel) {
      if (panel.getAttribute('data-view-panel') === view) {
        panel.hidden = false;
      } else {
        panel.hidden = true;
      }
    });

    buttons.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-view') === view);
    });

    try {
      localStorage.setItem(STORAGE_KEY, view);
    } catch (e) { /* localStorage nedostupné, ignoruj */ }
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setView(btn.getAttribute('data-view'));
    });
  });

  // Obnovit uložený výběr
  let saved = 'grid';
  try {
    saved = localStorage.getItem(STORAGE_KEY) || 'grid';
  } catch (e) { /* ignoruj */ }
  setView(saved);
})();