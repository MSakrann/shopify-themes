(function () {
  function initGallery(root) {
    if (root.dataset.galleryInitialized) return;
    root.dataset.galleryInitialized = 'true';

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

    var productRoot = root.closest('.glocket-product');

    root.addEventListener('change', function (event) {
      var input = event.target;
      if (!input.matches('input[type="radio"][data-variant-id]')) return;

      var variantInput = productRoot && productRoot.querySelector('[data-glocket-variant-id]');
      var variantId = input.getAttribute('data-variant-id');
      if (variantInput && variantId) {
        variantInput.value = variantId;
        variantInput.dispatchEvent(new Event('change', { bubbles: true }));
      }

      root.querySelectorAll('.glocket-variant-tiles__tile').forEach(function (tile) {
        tile.classList.remove('is-selected');
      });

      var selectedTile = input.closest('.glocket-variant-tiles__tile');
      if (selectedTile) selectedTile.classList.add('is-selected');

      var mediaSrc = input.getAttribute('data-media-src');
      if (mediaSrc) {
        var galleryRoot = productRoot || document;
        var image = galleryRoot.querySelector('[data-gallery] .glocket-gallery__image');
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

  function formatMoney(cents, format) {
    var value = Number(cents);
    if (!Number.isFinite(value)) return '';

    if (
      typeof window !== 'undefined' &&
      window.Shopify &&
      typeof window.Shopify.formatMoney === 'function'
    ) {
      return window.Shopify.formatMoney(value, format);
    }

    var token = (format || '${{amount}}').match(/\{\{\s*(\w+)\s*\}\}/);
    if (!token) return (value / 100).toFixed(2);

    var decimals = token[1].indexOf('no_decimals') === -1 ? 2 : 0;
    var amount = (value / 100).toFixed(decimals);
    var parts = amount.split('.');
    var thousands = token[1].indexOf('space_separator') !== -1 ? ' ' : ',';
    var decimal = '.';

    if (token[1].indexOf('comma_separator') !== -1) {
      thousands = '.';
      decimal = ',';
    } else if (token[1].indexOf('apostrophe_separator') !== -1) {
      thousands = "'";
    }

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
    amount = parts.length > 1 ? parts[0] + decimal + parts[1] : parts[0];
    return format.replace(token[0], amount);
  }

  function syncVariant(event) {
    var root = event.target.closest('.glocket-product');
    if (!root || !event.detail) return;

    var detail = event.detail;
    var price = root.querySelector('[data-glocket-price]');
    var compare = root.querySelector('[data-glocket-compare]');
    var submit = root.querySelector('[data-glocket-atc]');
    var moneyFormat = root.dataset.moneyFormat || '${{amount}}';

    if (price) price.textContent = formatMoney(detail.price, moneyFormat);

    if (compare) {
      var showCompare = Number(detail.compare) > Number(detail.price);
      compare.hidden = !showCompare;
      compare.textContent = showCompare ? formatMoney(detail.compare, moneyFormat) : '';
    }

    if (submit) {
      var available = detail.available !== false;
      var label = submit.querySelector('[data-glocket-atc-label]');
      submit.disabled = !available;
      if (available) {
        submit.removeAttribute('aria-disabled');
      } else {
        submit.setAttribute('aria-disabled', 'true');
      }
      if (label) {
        label.textContent = available ? root.dataset.addToCartLabel : root.dataset.soldOutLabel;
      }
    }
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
  document.addEventListener('glocket:variant-change', syncVariant);
})();
