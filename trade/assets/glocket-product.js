(function () {
  function initGallery(root) {
    var image = root.querySelector('.glocket-gallery__image');
    if (!image) return;
    root.querySelectorAll('.glocket-gallery__thumb').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var src = thumb.getAttribute('data-media-src');
        if (!src) return;
        image.src = src;
        image.srcset = '';
        root.querySelectorAll('.glocket-gallery__thumb').forEach(function (t) {
          t.classList.remove('is-active');
        });
        thumb.classList.add('is-active');
      });
    });
  }

  function initVariantTiles(root) {
    if (root.dataset.variantTilesInitialized) return;
    root.dataset.variantTilesInitialized = 'true';

    root.addEventListener('change', function (event) {
      var input = event.target;
      if (!input.matches('input[type="radio"][name="id"]')) return;

      root.querySelectorAll('.glocket-variant-tiles__tile').forEach(function (tile) {
        tile.classList.remove('is-selected');
      });

      var selectedTile = input.closest('.glocket-variant-tiles__tile');
      if (selectedTile) selectedTile.classList.add('is-selected');

      var mediaSrc = input.getAttribute('data-media-src');
      if (mediaSrc) {
        var productRoot = root.closest('.glocket-product') || document;
        var image = productRoot.querySelector('[data-gallery] .glocket-gallery__image');
        if (image) {
          image.src = mediaSrc;
          image.srcset = '';
        }
      }

      root.dispatchEvent(
        new CustomEvent('glocket:variant-change', {
          bubbles: true,
          detail: {
            price: input.getAttribute('data-variant-price'),
            compare: input.getAttribute('data-variant-compare'),
            available: input.getAttribute('data-variant-available') === 'true',
            id: input.getAttribute('data-variant-id'),
          },
        })
      );
    });
  }

  function initAll() {
    document.querySelectorAll('[data-gallery]').forEach(initGallery);
    document.querySelectorAll('[data-variant-tiles]').forEach(initVariantTiles);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  document.addEventListener('shopify:section:load', initAll);
})();
