(function () {
  function plainMoney(value) {
    if (!value) return '';
    var el = document.createElement('div');
    el.innerHTML = value;
    return (el.textContent || el.innerText || '').trim();
  }

  function formatMoney(cents, format) {
    var value = Number(cents);
    if (!Number.isFinite(value)) return '';

    var cleanFormat = plainMoney(format) || '${{amount}}';

    if (
      typeof window !== 'undefined' &&
      window.Shopify &&
      typeof window.Shopify.formatMoney === 'function'
    ) {
      return plainMoney(window.Shopify.formatMoney(value, cleanFormat));
    }

    var token = cleanFormat.match(/\{\{\s*(\w+)\s*\}\}/);
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
    return cleanFormat.replace(token[0], amount);
  }

  function updateGalleryImage(productRoot, mediaSrc) {
    if (!mediaSrc || !productRoot) return;
    var image = productRoot.querySelector('[data-gallery] .nomad-gallery__image');
    if (!image) return;
    image.src = mediaSrc;
    image.srcset = '';
  }

  function setVariantId(productRoot, variantId) {
    var variantInput = productRoot && productRoot.querySelector('[data-nomad-variant-id]');
    if (!variantInput || !variantId) return;
    variantInput.value = variantId;
    variantInput.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function getVariantMediaSrc(variant) {
    if (!variant) return '';
    if (variant.featured_image && variant.featured_image.src) {
      return variant.featured_image.src;
    }
    if (variant.featured_media && variant.featured_media.preview_image) {
      return variant.featured_media.preview_image.src || '';
    }
    return '';
  }

  function initGallery(root) {
    if (root.dataset.galleryInitialized) return;
    root.dataset.galleryInitialized = 'true';

    var image = root.querySelector('.nomad-gallery__image');
    if (!image) return;

    root.querySelectorAll('.nomad-gallery__thumb').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var src = thumb.getAttribute('data-media-src');
        if (!src) return;
        image.src = src;
        image.srcset = '';
        root.querySelectorAll('.nomad-gallery__thumb').forEach(function (t) {
          t.classList.remove('is-active');
        });
        thumb.classList.add('is-active');
      });
    });
  }

  function initVariantTiles(root) {
    if (root.dataset.variantTilesInitialized) return;
    root.dataset.variantTilesInitialized = 'true';

    var productRoot = root.closest('[data-nomad-product]');

    root.addEventListener('change', function (event) {
      var input = event.target;
      if (!input.matches('input[type="radio"][data-variant-id]')) return;

      var variantId = input.getAttribute('data-variant-id');
      setVariantId(productRoot, variantId);

      root.querySelectorAll('.nomad-variant-tiles__tile').forEach(function (tile) {
        tile.classList.remove('is-selected');
      });

      var selectedTile = input.closest('.nomad-variant-tiles__tile');
      if (selectedTile) selectedTile.classList.add('is-selected');

      var mediaSrc = input.getAttribute('data-media-src') || '';
      if (mediaSrc) updateGalleryImage(productRoot, mediaSrc);

      root.dispatchEvent(
        new CustomEvent('nomad:variant-change', {
          bubbles: true,
          detail: {
            variantId: variantId,
            price: input.getAttribute('data-variant-price'),
            compare: input.getAttribute('data-variant-compare'),
            available: input.getAttribute('data-variant-available') === 'true',
          },
        })
      );
    });
  }

  function parseVariants(productRoot) {
    try {
      return JSON.parse(productRoot.dataset.variants || '[]');
    } catch (error) {
      return [];
    }
  }

  function getSelectedOptionValues(productRoot) {
    var selected = {};
    productRoot
      .querySelectorAll('[data-nomad-variant-pills] input[type="radio"][data-option-position]:checked')
      .forEach(function (input) {
        var position = input.getAttribute('data-option-position');
        if (!position) return;
        selected[position] = input.getAttribute('data-option-value');
      });
    return selected;
  }

  function findVariantByOptions(variants, selected) {
    var positions = Object.keys(selected);
    if (!positions.length) return null;

    for (var i = 0; i < variants.length; i++) {
      var variant = variants[i];
      var matches = true;
      for (var j = 0; j < positions.length; j++) {
        var position = positions[j];
        var optionKey = 'option' + position;
        if (String(variant[optionKey] || '') !== String(selected[position] || '')) {
          matches = false;
          break;
        }
      }
      if (matches) return variant;
    }
    return null;
  }

  function initVariantPills(productRoot) {
    if (!productRoot || productRoot.dataset.variantPillsInitialized) return;
    var pillsRoot = productRoot.querySelector('[data-nomad-variant-pills]');
    if (!pillsRoot) return;

    productRoot.dataset.variantPillsInitialized = 'true';
    var variants = parseVariants(productRoot);

    pillsRoot.addEventListener('change', function (event) {
      var input = event.target;
      if (!input.matches('input[type="radio"][data-option-position]')) return;

      var group = input.closest('.nomad-variant-pills__group');
      if (group) {
        group.querySelectorAll('.nomad-variant-pills__label').forEach(function (label) {
          label.classList.remove('is-selected');
        });
      }

      var selectedLabel = input.closest('.nomad-variant-pills__label');
      if (selectedLabel) selectedLabel.classList.add('is-selected');

      var selected = getSelectedOptionValues(productRoot);
      var variant = findVariantByOptions(variants, selected);
      if (!variant) return;

      var variantId = String(variant.id);
      setVariantId(productRoot, variantId);
      updateGalleryImage(productRoot, getVariantMediaSrc(variant));

      productRoot.dispatchEvent(
        new CustomEvent('nomad:variant-change', {
          bubbles: true,
          detail: {
            variantId: variantId,
            price: variant.price,
            compare: variant.compare_at_price,
            available: variant.available !== false,
          },
        })
      );
    });
  }

  function syncVariant(event) {
    var productRoot = event.target.closest('[data-nomad-product]');
    if (!productRoot || !event.detail) return;

    var detail = event.detail;
    var price = productRoot.querySelector('[data-nomad-price]');
    var compare = productRoot.querySelector('[data-nomad-compare]');
    var submit = productRoot.querySelector('[data-nomad-atc]');
    var moneyFormat = productRoot.dataset.moneyFormat || '${{amount}}';

    if (price) {
      price.textContent = formatMoney(detail.price, moneyFormat);
    }

    if (compare) {
      var showCompare = Number(detail.compare) > Number(detail.price);
      compare.hidden = !showCompare;
      compare.textContent = showCompare ? formatMoney(detail.compare, moneyFormat) : '';
    }

    if (submit) {
      var available = detail.available !== false;
      var label = submit.querySelector('[data-nomad-atc-label]');
      submit.disabled = !available;
      if (available) {
        submit.removeAttribute('aria-disabled');
      } else {
        submit.setAttribute('aria-disabled', 'true');
      }
      if (label) {
        label.textContent = available
          ? productRoot.dataset.addToCartLabel
          : productRoot.dataset.soldOutLabel;
      }
    }
  }

  function initAll() {
    document.querySelectorAll('[data-nomad-product] [data-gallery]').forEach(initGallery);
    document.querySelectorAll('[data-nomad-product] [data-variant-tiles]').forEach(initVariantTiles);
    document.querySelectorAll('[data-nomad-product]').forEach(initVariantPills);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  document.addEventListener('shopify:section:load', initAll);
  document.addEventListener('nomad:variant-change', syncVariant);
})();
