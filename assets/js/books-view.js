(function () {
  const container = document.querySelector('.books-container');
  if (!container) return;

  const VIEW_KEY = 'books-view-preference';
  const SORT_KEY = 'books-sort-preference';

  const viewSelect = document.getElementById('view-select');
  const viewPanels = document.querySelectorAll('[data-view-panel]');
  const sortSelect = document.getElementById('sort-select');

  // --- VIEW SWITCHING ---
  function setView(view) {
    container.setAttribute('data-active-view', view);
    viewPanels.forEach(function (panel) {
      panel.hidden = panel.getAttribute('data-view-panel') !== view;
    });
    if (viewSelect) viewSelect.value = view;
    try { localStorage.setItem(VIEW_KEY, view); } catch (e) {}
  }

  if (viewSelect) {
    viewSelect.addEventListener('change', function () {
      setView(viewSelect.value);
    });
  }
  // --- SORTING ---
  function compareString(a, b) {
    return a.localeCompare(b, 'cs', { sensitivity: 'base', numeric: true });
  }

  function compareNumber(a, b) {
    return a - b;
  }

  function sortItems(panel, sortKey) {
    const items = Array.from(panel.querySelectorAll('.book-item'));
    let header = null;

    // Zachovej hlavičku seznamu na svém místě
    if (panel.getAttribute('data-view-panel') === 'list') {
      header = panel.querySelector('.book-list-header');
    }

    const [field, direction] = sortKey.split('-');
    const reverse = direction === 'desc';

    items.sort(function (a, b) {
      let result;
      if (field === 'title') {
        result = compareString(a.dataset.title || '', b.dataset.title || '');
      } else if (field === 'year') {
        result = compareNumber(parseInt(a.dataset.year || '0', 10), parseInt(b.dataset.year || '0', 10));
      } else if (field === 'original') {
        // Textové řazení (může to být '1976', 'okolo 1980', '1976/1985'...)
        result = compareString(a.dataset.originalYear || '', b.dataset.originalYear || '');
      } else if (field === 'copies') {
        result = compareNumber(parseInt(a.dataset.copies || '0', 10), parseInt(b.dataset.copies || '0', 10));
      } else if (field === 'spent') {
        result = compareNumber(parseInt(a.dataset.spent || '0', 10), parseInt(b.dataset.spent || '0', 10));
      } else {
        result = 0;
      }
      return reverse ? -result : result;
    });

    // Přesun v DOM
    const frag = document.createDocumentFragment();
    if (header) frag.appendChild(header);
    items.forEach(function (item) { frag.appendChild(item); });
    panel.appendChild(frag);
  }

  function applySort(sortKey) {
    viewPanels.forEach(function (panel) {
      sortItems(panel, sortKey);
    });
    try { localStorage.setItem(SORT_KEY, sortKey); } catch (e) {}
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      applySort(sortSelect.value);
    });
  }

  // --- INIT ---
  let savedView = 'grid';
  let savedSort = 'title-asc';
  try {
    savedView = localStorage.getItem(VIEW_KEY) || 'grid';
    savedSort = localStorage.getItem(SORT_KEY) || 'title-asc';
  } catch (e) {}

  setView(savedView);
  if (sortSelect) {
    sortSelect.value = savedSort;
    applySort(savedSort);
  }
})();