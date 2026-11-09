const filters = document.querySelector('.finish-filters');
const swatches = document.querySelectorAll('.finish-swatch-button');
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

const previewSwatch = preview.querySelector('.finish-preview-swatch');
const previewImage = previewSwatch.querySelector('img');
for (const button of swatches) {
  button.addEventListener('click', () => {
    preview.querySelector('h2').textContent = button.querySelector('strong').textContent;
    previewSwatch.style.background = button.dataset.gradient || '';
    previewImage.hidden = !button.dataset.image;
    if (button.dataset.image) previewImage.src = button.dataset.image;
    preview.showModal();
  });
}
