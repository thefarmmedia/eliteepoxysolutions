const filters = document.querySelector('.finish-filters');
const cards = document.querySelectorAll('.finish-card');
const preview = document.querySelector('#finish-preview');

filters.hidden = false;
filters.addEventListener('click', (event) => {
  const button = event.target.closest('[data-finish-filter]');
  if (!button) return;

  const category = button.dataset.finishFilter;
  for (const filter of filters.querySelectorAll('button')) {
    filter.setAttribute('aria-pressed', String(filter === button));
  }
  for (const card of cards) {
    card.hidden = category !== 'all' && card.dataset.finishGroup !== category;
  }
});

for (const card of cards) {
  const button = card.querySelector('[data-swatch]');
  button.addEventListener('click', () => {
    preview.querySelector('h2').textContent = card.querySelector('h3').textContent;
    preview.querySelector('.swatch').className = 'swatch ' + button.dataset.swatch;
    preview.showModal();
  });
}
