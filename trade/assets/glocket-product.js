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

  function initAll() {
    document.querySelectorAll('[data-gallery]').forEach(initGallery);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  document.addEventListener('shopify:section:load', initAll);
})();
