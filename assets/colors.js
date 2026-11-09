const filters = document.querySelector('.finish-filters');
const cards = document.querySelectorAll('.finish-card');
const collections = document.querySelectorAll('.finish-collection');
const preview = document.querySelector('#finish-preview');

filters.hidden = false;
filters.addEventListener('click', (event) => {
  const button = event.target.closest('[data-finish-filter]');
  if (!button) return;

  const category = button.dataset.finishFilter;
  for (const filter of filters.querySelectorAll('button')) {
    filter.setAttribute('aria-pressed', String(filter === button));
  }
  for (const collection of collections) {
    collection.hidden = category !== 'all' && collection.dataset.finishGroup !== category;
  }
});

for (const card of cards) {
  const button = card.querySelector('[data-swatch]');
  button.addEventListener('click', () => {
    preview.querySelector('h2').textContent = card.querySelector('strong').textContent;
    preview.querySelector('.swatch').className = 'swatch ' + button.dataset.swatch;
    preview.showModal();
  });
}
