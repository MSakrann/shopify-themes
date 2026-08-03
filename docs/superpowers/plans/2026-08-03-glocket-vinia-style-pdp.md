# POV Glocket Vinia-Style PDP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Glocket product template so its layout matches the Vinia-style high-conversion PDP (buy box + below-fold sections), fully editable in the Shopify theme editor.

**Architecture:** Custom Glocket-only sections/snippets under `trade/`, wired exclusively through `templates/product.glocket.json`. Do not change shared `main-product.liquid` or other product templates. Replace incomplete legacy `glocket-*` files with the approved spec file names.

**Tech Stack:** Shopify Trade theme (Liquid OS 2.0), section `{% schema %}`, native product form + dynamic checkout, Trade color schemes, CSS/JS via `assets/` (Trade pattern) plus small inline `{% style %}` for section padding tokens.

**Spec:** `docs/superpowers/specs/2026-08-03-glocket-vinia-style-pdp-design.md`  
**Reference layout:** https://vinia.com/products/vinia-coffee  
**Live product:** https://pov-worldwide.com/products/pov-glocket

## Global Constraints

- Paths are under `trade/` unless noted
- Use Trade color schemes; do not hardcode Vinia burgundy as brand
- No emojis in defaults or shipped UI chrome
- No Vinia images/fonts
- Commerce: variants + quantity + Add to cart + Buy it now only (no subscriptions, no multi-product format grid, no bundle/people savings tiers)
- Header / announcement / footer out of scope
- Do not break Locksmith hooks in `layout/theme.liquid`
- Prefer editor-editable settings/blocks for all copy, images, links
- This workspace may not be a git repo; skip commit steps if `git rev-parse` fails, or `git init` only if the user asks
- Verify with Shopify theme-check when CLI is available; otherwise schema/JSON validity + visual QA against Vinia desktop/mobile

## File structure (create / replace / delete)

| Path | Action | Responsibility |
|---|---|---|
| `templates/product.glocket.json` | Replace | Wire Glocket sections in approved order |
| `sections/glocket-product.liquid` | Create | Buy box section |
| `snippets/glocket-gallery.liquid` | Create | Gallery + thumbnails |
| `snippets/glocket-variant-tiles.liquid` | Create | Image-tile variant picker |
| `snippets/glocket-accordion.liquid` | Create | Accordion under gallery |
| `assets/glocket-product.css` | Create | Buy box styles |
| `assets/glocket-product.js` | Create | Gallery, tiles, accordion, variant sync |
| `sections/glocket-rich-text-media.liquid` | Create | Story block |
| `sections/glocket-benefits-grid.liquid` | Create | Benefits cards |
| `sections/glocket-stats-proof.liquid` | Create | Stats / proof + CTA |
| `sections/glocket-feature-split.liquid` | Create | Split feature + CTA |
| `sections/glocket-process-steps.liquid` | Create | Process steps |
| `sections/glocket-icon-row.liquid` | Create | Icon / cert strip |
| `sections/glocket-comparison-or-proof.liquid` | Create | Proof / claim block |
| `sections/glocket-guarantee.liquid` | Create | Guarantee block |
| `sections/glocket-reviews.liquid` | Replace (rewrite) | Editable reviews |
| `sections/glocket-faq.liquid` | Replace (rewrite) | FAQ accordion |
| `sections/glocket-cta-banner.liquid` | Create | CTA strips |
| `assets/glocket-sections.css` | Create | Shared below-fold styles |
| `sections/glocket-product-main.liquid` | Delete after cutover | Legacy incomplete buy box |
| `sections/glocket-benefits.liquid` | Delete after cutover | Replaced by benefits-grid |
| `sections/glocket-stats.liquid` | Delete after cutover | Replaced by stats-proof |
| `sections/glocket-features.liquid` | Delete after cutover | Replaced by feature-split |
| `sections/glocket-how-made.liquid` | Delete after cutover | Replaced by process-steps |

---

### Task 1: Shared CSS foundation + remove legacy wiring risk

**Files:**
- Create: `trade/assets/glocket-sections.css`
- Create: `trade/assets/glocket-product.css` (stub with layout tokens only; filled in Task 3–5)
- Modify: none yet

**Interfaces:**
- Produces: CSS custom properties and shared utility classes used by all Glocket sections:
  - `.glocket-section`, `.glocket-section__inner`, `.glocket-heading`, `.glocket-subheading`, `.glocket-body`, `.glocket-btn`, `.glocket-grid`, breakpoints `750px` / `990px` aligned with Trade

- [ ] **Step 1: Create shared section CSS**

Write `trade/assets/glocket-sections.css`:

```css
.glocket-section {
  padding-top: var(--glocket-pad-top, 36px);
  padding-bottom: var(--glocket-pad-bottom, 36px);
}

.glocket-section__inner {
  max-width: var(--page-width, 1200px);
  margin: 0 auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.glocket-heading {
  margin: 0 0 1rem;
  letter-spacing: 0.02em;
}

.glocket-subheading {
  margin: 0 0 1rem;
  opacity: 0.9;
}

.glocket-body {
  margin: 0 0 1.5rem;
  line-height: 1.6;
}

.glocket-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0.9rem 1.75rem;
  border: 1px solid transparent;
  text-decoration: none;
  cursor: pointer;
}

.glocket-btn--primary {
  width: 100%;
}

.glocket-grid {
  display: grid;
  gap: 1.5rem;
}

@media screen and (max-width: 749px) {
  .glocket-section {
    padding-top: calc(var(--glocket-pad-top, 36px) * 0.75);
    padding-bottom: calc(var(--glocket-pad-bottom, 36px) * 0.75);
  }
}
```

- [ ] **Step 2: Create buy-box CSS stub**

Write `trade/assets/glocket-product.css` with only:

```css
.glocket-product {
  --glocket-tile-radius: 8px;
  --glocket-border: rgba(var(--color-foreground), 0.15);
  --glocket-border-selected: rgba(var(--color-foreground), 0.85);
}

.glocket-product__layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: start;
}

@media screen and (min-width: 990px) {
  .glocket-product__layout {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }
}
```

- [ ] **Step 3: Verify files exist**

Run: `ls -la trade/assets/glocket-sections.css trade/assets/glocket-product.css`  
Expected: both files listed

- [ ] **Step 4: Commit (if git available)**

```bash
git add trade/assets/glocket-sections.css trade/assets/glocket-product.css
git commit -m "feat(glocket): add shared CSS foundation for Vinia-style PDP"
```

---

### Task 2: Accordion snippet

**Files:**
- Create: `trade/snippets/glocket-accordion.liquid`

**Interfaces:**
- Consumes: `section` (or `blocks` array of type `accordion_item` with `heading`, `content`)
- Produces: markup with classes `.glocket-accordion`, `.glocket-accordion__item`, trigger button + panel; uses `<details>`/`<summary>` for accessibility

- [ ] **Step 1: Create snippet with LiquidDoc**

```liquid
{% doc %}
  Renders Glocket buy-box accordions under the gallery.
  @param {object} blocks - Section blocks to filter for accordion_item
  @example
  {% render 'glocket-accordion', blocks: section.blocks %}
{% enddoc %}

<div class="glocket-accordion">
  {% for block in blocks %}
    {% if block.type == 'accordion_item' %}
      <details class="glocket-accordion__item" {{ block.shopify_attributes }}>
        <summary class="glocket-accordion__trigger">
          <span class="glocket-accordion__heading">{{ block.settings.heading }}</span>
          <span class="glocket-accordion__chevron" aria-hidden="true"></span>
        </summary>
        <div class="glocket-accordion__panel rte">
          {{ block.settings.content }}
        </div>
      </details>
    {% endif %}
  {% endfor %}
</div>
```

- [ ] **Step 2: Add accordion CSS to `glocket-product.css`**

```css
.glocket-accordion {
  margin-top: 1.5rem;
  border-top: 1px solid var(--glocket-border);
}

.glocket-accordion__item {
  border-bottom: 1px solid var(--glocket-border);
}

.glocket-accordion__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  padding: 1rem 0;
  list-style: none;
  cursor: pointer;
  font-weight: 600;
}

.glocket-accordion__trigger::-webkit-details-marker {
  display: none;
}

.glocket-accordion__chevron {
  width: 0.6rem;
  height: 0.6rem;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(45deg);
  transition: transform 0.2s ease;
}

.glocket-accordion__item[open] .glocket-accordion__chevron {
  transform: rotate(-135deg);
}

.glocket-accordion__panel {
  padding: 0 0 1rem;
}
```

- [ ] **Step 3: Smoke-check snippet renders only accordion blocks**

Manually confirm the `if block.type == 'accordion_item'` guard is present (other buy-box blocks must not appear here).

- [ ] **Step 4: Commit (if git available)**

```bash
git add trade/snippets/glocket-accordion.liquid trade/assets/glocket-product.css
git commit -m "feat(glocket): add gallery accordion snippet"
```

---

### Task 3: Gallery snippet

**Files:**
- Create: `trade/snippets/glocket-gallery.liquid`
- Modify: `trade/assets/glocket-product.css`
- Modify: `trade/assets/glocket-product.js` (create stub handlers)

**Interfaces:**
- Consumes: `product`, `section`
- Produces: `#GlocketGallery-{{ section.id }}` with main image stage + thumbnail list; thumbnails vertical on desktop (`min-width: 990px`), horizontal on mobile; `data-media-id` on thumbs

- [ ] **Step 1: Create gallery snippet**

```liquid
{% doc %}
  Glocket product gallery with main media and thumbnails.
  @param {object} product - Product object
  @param {object} section - Section object
  @example
  {% render 'glocket-gallery', product: product, section: section %}
{% enddoc %}

{% assign featured_media = product.selected_or_first_available_variant.featured_media | default: product.featured_media %}

<div
  id="GlocketGallery-{{ section.id }}"
  class="glocket-gallery"
  data-gallery
>
  <div class="glocket-gallery__stage">
    {% if featured_media %}
      {{
        featured_media
        | image_url: width: 1500
        | image_tag:
          class: 'glocket-gallery__image',
          id: 'GlocketGalleryImage-' | append: section.id,
          widths: '400, 600, 800, 1000, 1200, 1500',
          sizes: '(min-width: 990px) 45vw, 100vw',
          loading: 'eager'
      }}
    {% else %}
      {{ 'product-1' | placeholder_svg_tag: 'glocket-gallery__placeholder' }}
    {% endif %}
  </div>

  {% if product.media.size > 1 %}
    <ul class="glocket-gallery__thumbs" role="list">
      {% for media in product.media %}
        <li class="glocket-gallery__thumb-item">
          <button
            type="button"
            class="glocket-gallery__thumb{% if media.id == featured_media.id %} is-active{% endif %}"
            data-media-id="{{ media.id }}"
            data-media-src="{{ media | image_url: width: 1500 }}"
            aria-label="View image {{ forloop.index }}"
          >
            {{
              media
              | image_url: width: 200
              | image_tag: loading: 'lazy', widths: '100,150,200', sizes: '72px'
            }}
          </button>
        </li>
      {% endfor %}
    </ul>
  {% endif %}
</div>
```

- [ ] **Step 2: Add gallery CSS (Vinia-like: thumbs beside main on desktop)**

Append to `glocket-product.css`:

```css
.glocket-gallery {
  display: grid;
  gap: 0.75rem;
}

.glocket-gallery__stage {
  aspect-ratio: 1 / 1;
  background: rgba(var(--color-foreground), 0.04);
  overflow: hidden;
}

.glocket-gallery__image,
.glocket-gallery__placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.glocket-gallery__thumbs {
  display: flex;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-x: auto;
}

.glocket-gallery__thumb {
  display: block;
  width: 72px;
  height: 72px;
  padding: 0;
  border: 2px solid transparent;
  background: transparent;
  cursor: pointer;
}

.glocket-gallery__thumb.is-active {
  border-color: var(--glocket-border-selected);
}

.glocket-gallery__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

@media screen and (min-width: 990px) {
  .glocket-gallery {
    grid-template-columns: 72px 1fr;
    align-items: start;
  }

  .glocket-gallery__thumbs {
    flex-direction: column;
    max-height: 520px;
    overflow-y: auto;
    overflow-x: hidden;
    order: -1;
  }
}
```

- [ ] **Step 3: Create JS for thumb switching**

Write `trade/assets/glocket-product.js`:

```js
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
```

- [ ] **Step 4: Verify**

Run: `test -f trade/snippets/glocket-gallery.liquid && test -f trade/assets/glocket-product.js && echo OK`  
Expected: `OK`

- [ ] **Step 5: Commit (if git available)**

```bash
git add trade/snippets/glocket-gallery.liquid trade/assets/glocket-product.css trade/assets/glocket-product.js
git commit -m "feat(glocket): add product gallery snippet and interactions"
```

---

### Task 4: Variant image tiles snippet

**Files:**
- Create: `trade/snippets/glocket-variant-tiles.liquid`
- Modify: `trade/assets/glocket-product.css`
- Modify: `trade/assets/glocket-product.js`

**Interfaces:**
- Consumes: `product`, `product_form_id`, `section`
- Produces: radio inputs named `id` for the product form OR buttons that set a hidden `input[name=id]` inside the form; tiles show variant image + title; selected thick border; unavailable disabled
- Must work with native `{% form 'product' %}` in Task 5

- [ ] **Step 1: Create variant tiles snippet**

```liquid
{% doc %}
  Vinia-style image tiles for product variants.
  @param {object} product
  @param {string} product_form_id
  @example
  {% render 'glocket-variant-tiles', product: product, product_form_id: product_form_id %}
{% enddoc %}

{% unless product.has_only_default_variant %}
  <fieldset class="glocket-variant-tiles" data-variant-tiles>
    <legend class="glocket-variant-tiles__legend">
      {{ 'products.product.color' | t | default: 'Choose option' }}
    </legend>
    <div class="glocket-variant-tiles__list">
      {% for variant in product.variants %}
        {% assign tile_image = variant.featured_image | default: product.featured_image %}
        <label
          class="glocket-variant-tiles__tile{% if variant == product.selected_or_first_available_variant %} is-selected{% endif %}{% unless variant.available %} is-unavailable{% endunless %}"
        >
          <input
            type="radio"
            name="id"
            form="{{ product_form_id }}"
            value="{{ variant.id }}"
            {% if variant == product.selected_or_first_available_variant %}checked{% endif %}
            {% unless variant.available %}disabled{% endunless %}
            data-variant-id="{{ variant.id }}"
            data-variant-price="{{ variant.price }}"
            data-variant-compare="{{ variant.compare_at_price }}"
            data-variant-available="{{ variant.available }}"
            {% if variant.featured_media %}
              data-media-id="{{ variant.featured_media.id }}"
              data-media-src="{{ variant.featured_media | image_url: width: 1500 }}"
            {% endif %}
          >
          <span class="glocket-variant-tiles__media">
            {% if tile_image %}
              {{ tile_image | image_url: width: 240 | image_tag: loading: 'lazy', widths: '120,180,240', sizes: '100px' }}
            {% endif %}
          </span>
          <span class="glocket-variant-tiles__label">{{ variant.title }}</span>
        </label>
      {% endfor %}
    </div>
  </fieldset>
{% endunless %}
```

Note: If `'products.product.color' | t` is missing in locales, use a section setting `variant_picker_heading` passed into the snippet instead (preferred for editor control). Implementer should prefer section setting over translation key.

- [ ] **Step 2: Tile CSS**

```css
.glocket-variant-tiles {
  border: 0;
  margin: 0 0 1.25rem;
  padding: 0;
}

.glocket-variant-tiles__legend {
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.glocket-variant-tiles__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: 0.75rem;
}

.glocket-variant-tiles__tile {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.4rem;
  border: 2px solid var(--glocket-border);
  border-radius: var(--glocket-tile-radius);
  cursor: pointer;
  text-align: center;
}

.glocket-variant-tiles__tile input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.glocket-variant-tiles__tile.is-selected {
  border-color: var(--glocket-border-selected);
}

.glocket-variant-tiles__tile.is-unavailable {
  opacity: 0.45;
  cursor: not-allowed;
}

.glocket-variant-tiles__media {
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: rgba(var(--color-foreground), 0.04);
}

.glocket-variant-tiles__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.glocket-variant-tiles__label {
  font-size: 0.85rem;
  line-height: 1.2;
}
```

- [ ] **Step 3: Extend JS to sync selected class + gallery + price hooks**

Append to `glocket-product.js` an `initVariantTiles(root)` that:

1. On `change` of radios inside `[data-variant-tiles]`, toggles `.is-selected` on labels  
2. If `data-media-src` present, updates nearest `[data-gallery] .glocket-gallery__image`  
3. Dispatches `CustomEvent('glocket:variant-change', { detail: { price, compare, available, id } })` for the buy box price/ATC listeners in Task 5

- [ ] **Step 4: Commit (if git available)**

```bash
git add trade/snippets/glocket-variant-tiles.liquid trade/assets/glocket-product.css trade/assets/glocket-product.js
git commit -m "feat(glocket): add image-tile variant picker"
```

---

### Task 5: Buy box section `glocket-product`

**Files:**
- Create: `trade/sections/glocket-product.liquid`
- Modify: `trade/assets/glocket-product.css`
- Modify: `trade/assets/glocket-product.js`

**Interfaces:**
- Consumes: snippets from Tasks 2–4; Trade `product-form.js` / dynamic checkout if needed
- Produces: section type `glocket-product` with blocks: `social_proof`, `trust_badge`, `bullet`, `accordion_item`, `trust_item`; settings for description mode, button labels, sticky info, paddings, color scheme
- Form: `{% form 'product', product, id: product_form_id %}` including quantity, ATC, `{{ form | payment_button }}`

- [ ] **Step 1: Implement section Liquid structure**

Required DOM order (right column):

1. Social proof (from first `social_proof` block or settings)  
2. `h1` product title  
3. Trust badge block  
4. Description (setting richtext and/or `product.description` toggle)  
5. Bullet blocks  
6. Variant tiles snippet  
7. Quantity  
8. Price (`price` / `compare_at` spans with `data-glocket-price`)  
9. ATC + payment button  
10. Trust row blocks  

Left column: gallery snippet + accordion snippet.

Load assets:

```liquid
{{ 'glocket-product.css' | asset_url | stylesheet_tag }}
{{ 'component-price.css' | asset_url | stylesheet_tag }}
<script src="{{ 'glocket-product.js' | asset_url }}" defer></script>
<script src="{{ 'product-form.js' | asset_url }}" defer></script>
```

Use `color-{{ section.settings.color_scheme }}` and Trade padding pattern via `{% style %}` setting `--glocket-pad-*`.

- [ ] **Step 2: Schema (complete)**

Include at minimum:

```json
{
  "name": "Glocket product",
  "tag": "section",
  "class": "section-glocket-product",
  "settings": [
    { "type": "color_scheme", "id": "color_scheme", "label": "Color scheme", "default": "scheme-1" },
    { "type": "checkbox", "id": "enable_sticky_info", "label": "Sticky product info on desktop", "default": true },
    { "type": "checkbox", "id": "use_product_description", "label": "Use product description", "default": true },
    { "type": "richtext", "id": "description_override", "label": "Description override" },
    { "type": "text", "id": "variant_heading", "label": "Variant picker heading", "default": "Choose your color" },
    { "type": "text", "id": "add_to_cart_label", "label": "Add to cart label", "default": "Add to cart" },
    { "type": "checkbox", "id": "show_dynamic_checkout", "label": "Show Buy it now", "default": true },
    { "type": "range", "id": "padding_top", "min": 0, "max": 100, "step": 4, "unit": "px", "label": "Padding top", "default": 36 },
    { "type": "range", "id": "padding_bottom", "min": 0, "max": 100, "step": 4, "unit": "px", "label": "Padding bottom", "default": 36 }
  ],
  "blocks": [
    {
      "type": "social_proof",
      "name": "Social proof",
      "limit": 1,
      "settings": [
        { "type": "text", "id": "rating_text", "label": "Rating text", "default": "4.7/5.0" },
        { "type": "text", "id": "reviews_text", "label": "Reviews text", "default": "0 Reviews" },
        { "type": "text", "id": "customers_text", "label": "Customers text" },
        { "type": "url", "id": "link", "label": "Link" }
      ]
    },
    {
      "type": "trust_badge",
      "name": "Trust badge",
      "limit": 1,
      "settings": [
        { "type": "image_picker", "id": "icon", "label": "Icon" },
        { "type": "text", "id": "heading", "label": "Heading", "default": "Trusted quality" },
        { "type": "text", "id": "text", "label": "Text", "default": "Add your proof claim here." },
        { "type": "text", "id": "link_label", "label": "Link label" },
        { "type": "url", "id": "link", "label": "Link" }
      ]
    },
    {
      "type": "bullet",
      "name": "Bullet",
      "settings": [
        { "type": "image_picker", "id": "icon", "label": "Icon" },
        { "type": "text", "id": "text", "label": "Text", "default": "Benefit point" }
      ]
    },
    {
      "type": "accordion_item",
      "name": "Accordion row",
      "settings": [
        { "type": "text", "id": "heading", "label": "Heading", "default": "Details" },
        { "type": "richtext", "id": "content", "label": "Content", "default": "<p>Add details here.</p>" }
      ]
    },
    {
      "type": "trust_item",
      "name": "Trust row item",
      "settings": [
        { "type": "image_picker", "id": "icon", "label": "Icon" },
        { "type": "text", "id": "label", "label": "Label", "default": "Free shipping" }
      ]
    }
  ],
  "presets": [{ "name": "Glocket product" }]
}
```

- [ ] **Step 3: Wire price + ATC availability on variant change**

In `glocket-product.js`, listen for `glocket:variant-change` and update `[data-glocket-price]`, compare-at, and disable ATC when `available === false`. Format money using Shopify’s `theme.routes` / `window.Shopify.formatMoney` if present; otherwise render Liquid-initialized `data-money-format` on the section root.

- [ ] **Step 4: Explicitly exclude out-of-scope UI**

Do not implement: bundle picker, subscribe & save, “how many people”, format links to other products (legacy `glocket-product-main` had bundle logic — do not port it).

- [ ] **Step 5: Static validation**

Run if available: `shopify theme check -p trade/sections/glocket-product.liquid`  
Or validate JSON schema block parses (no trailing commas).

- [ ] **Step 6: Commit (if git available)**

```bash
git add trade/sections/glocket-product.liquid trade/assets/glocket-product.css trade/assets/glocket-product.js trade/snippets/glocket-*.liquid
git commit -m "feat(glocket): add Vinia-style buy box section"
```

---

### Task 6: Below-fold content sections (batch A — story + benefits + stats)

**Files:**
- Create: `trade/sections/glocket-rich-text-media.liquid`
- Create: `trade/sections/glocket-benefits-grid.liquid`
- Create: `trade/sections/glocket-stats-proof.liquid`
- Modify: `trade/assets/glocket-sections.css`

**Interfaces:**
- Each section: `color_scheme`, `padding_top`, `padding_bottom`, loads `glocket-sections.css`
- No emojis in defaults

- [ ] **Step 1: `glocket-rich-text-media`**

Settings: `heading`, `subheading`, `body` (richtext), `image`, `video_url` (optional text/url), `cta_label`, `cta_link`, `media_position` (left/right), color scheme, paddings.  
Markup: `.glocket-section` inner grid; media + text; optional CTA `.glocket-btn`.

- [ ] **Step 2: `glocket-benefits-grid`**

Settings: `heading`, `columns_desktop` (2/3), color scheme, paddings.  
Blocks `benefit`: `icon` (image), `title`, `text`.  
CSS grid; 1 col mobile.

- [ ] **Step 3: `glocket-stats-proof`**

Settings: `heading`, `body`, `image`, `cta_label`, `cta_link`, color scheme, paddings.  
Blocks `stat`: `value`, `label`, `text`.  
Large heading treatment; stats as secondary grid.

- [ ] **Step 4: Add CSS rules for these three layouts in `glocket-sections.css`**

Include split layout, benefits grid, and stats callout spacing matching Vinia rhythm (generous vertical padding, clear heading hierarchy).

- [ ] **Step 5: Commit (if git available)**

```bash
git add trade/sections/glocket-rich-text-media.liquid trade/sections/glocket-benefits-grid.liquid trade/sections/glocket-stats-proof.liquid trade/assets/glocket-sections.css
git commit -m "feat(glocket): add story, benefits, and stats sections"
```

---

### Task 7: Below-fold content sections (batch B — feature, process, icons, proof, guarantee)

**Files:**
- Create: `trade/sections/glocket-feature-split.liquid`
- Create: `trade/sections/glocket-process-steps.liquid`
- Create: `trade/sections/glocket-icon-row.liquid`
- Create: `trade/sections/glocket-comparison-or-proof.liquid`
- Create: `trade/sections/glocket-guarantee.liquid`
- Modify: `trade/assets/glocket-sections.css`

- [ ] **Step 1: `glocket-feature-split`**

Settings: `heading`, `body`, `image`, `cta_label`, `cta_link`, `media_position`, color scheme, paddings. Preset enabled (reusable twice in template).

- [ ] **Step 2: `glocket-process-steps`**

Settings: `heading`, color scheme, paddings.  
Blocks `step`: `image`, `title`, `text`.  
Number steps via `forloop.index` in markup (no emoji numerals required).

- [ ] **Step 3: `glocket-icon-row`**

Blocks `icon_item`: `image`, `label`. Horizontal flex wrap; scroll on small screens if needed.

- [ ] **Step 4: `glocket-comparison-or-proof`**

Settings: `heading`, `body`, `image`, color scheme, paddings.  
Blocks `claim`: `value`, `text` (for preference/proof lines).

- [ ] **Step 5: `glocket-guarantee`**

Settings: `badge_image`, `heading`, `body`, `cta_label`, `cta_link`, color scheme, paddings.

- [ ] **Step 6: Commit (if git available)**

```bash
git add trade/sections/glocket-feature-split.liquid trade/sections/glocket-process-steps.liquid trade/sections/glocket-icon-row.liquid trade/sections/glocket-comparison-or-proof.liquid trade/sections/glocket-guarantee.liquid trade/assets/glocket-sections.css
git commit -m "feat(glocket): add feature, process, icon, proof, guarantee sections"
```

---

### Task 8: Reviews, FAQ, CTA banner

**Files:**
- Create/Replace: `trade/sections/glocket-reviews.liquid`
- Create/Replace: `trade/sections/glocket-faq.liquid`
- Create: `trade/sections/glocket-cta-banner.liquid`
- Modify: `trade/assets/glocket-sections.css`

- [ ] **Step 1: Rewrite `glocket-reviews`**

Settings: `heading`, `rating_summary` (e.g. `4.8 Stars out of 5`), `supporting_text`, color scheme, paddings.  
Blocks `review`: `quote`, `author`, `rating_text`, `avatar`.  
No third-party app snippets.

- [ ] **Step 2: Rewrite `glocket-faq`**

Settings: `heading`, color scheme, paddings.  
Blocks `faq_item`: `question`, `answer` (richtext).  
Use `<details>`/`<summary>` accordion. Defaults: empty or neutral placeholder Q/A without Vinia copy and without emojis.

- [ ] **Step 3: Create `glocket-cta-banner`**

Settings: `heading`, `text`, `button_label`, `button_link`, `image`, color scheme, paddings.  
Full-width band; button can link to `#MainProduct` / buy box section id — expose setting `button_link`.

- [ ] **Step 4: Commit (if git available)**

```bash
git add trade/sections/glocket-reviews.liquid trade/sections/glocket-faq.liquid trade/sections/glocket-cta-banner.liquid trade/assets/glocket-sections.css
git commit -m "feat(glocket): add reviews, FAQ, and CTA banner sections"
```

---

### Task 9: Rebuild `product.glocket.json` and remove legacy sections

**Files:**
- Replace: `trade/templates/product.glocket.json`
- Delete: `trade/sections/glocket-product-main.liquid`
- Delete: `trade/sections/glocket-benefits.liquid`
- Delete: `trade/sections/glocket-stats.liquid`
- Delete: `trade/sections/glocket-features.liquid`
- Delete: `trade/sections/glocket-how-made.liquid`

**Interfaces:**
- Template order must match spec §5.1
- Do not reference deleted section types

- [ ] **Step 1: Write new template JSON**

```json
{
  "sections": {
    "main": {
      "type": "glocket-product",
      "blocks": {
        "social": {
          "type": "social_proof",
          "settings": {
            "rating_text": "4.7/5.0",
            "reviews_text": "0 Reviews",
            "customers_text": ""
          }
        },
        "badge": {
          "type": "trust_badge",
          "settings": {
            "heading": "Trusted quality",
            "text": "Add your proof claim here."
          }
        },
        "bullet_1": {
          "type": "bullet",
          "settings": { "text": "Benefit point one" }
        },
        "bullet_2": {
          "type": "bullet",
          "settings": { "text": "Benefit point two" }
        },
        "acc_1": {
          "type": "accordion_item",
          "settings": {
            "heading": "Details",
            "content": "<p>Add details here.</p>"
          }
        },
        "acc_2": {
          "type": "accordion_item",
          "settings": {
            "heading": "How to use",
            "content": "<p>Add usage instructions here.</p>"
          }
        },
        "acc_3": {
          "type": "accordion_item",
          "settings": {
            "heading": "Guarantee",
            "content": "<p>Add guarantee details here.</p>"
          }
        },
        "acc_4": {
          "type": "accordion_item",
          "settings": {
            "heading": "Shipping",
            "content": "<p>Add shipping details here.</p>"
          }
        },
        "trust_1": {
          "type": "trust_item",
          "settings": { "label": "Secure checkout" }
        },
        "trust_2": {
          "type": "trust_item",
          "settings": { "label": "Support available" }
        }
      },
      "block_order": [
        "social",
        "badge",
        "bullet_1",
        "bullet_2",
        "acc_1",
        "acc_2",
        "acc_3",
        "acc_4",
        "trust_1",
        "trust_2"
      ],
      "settings": {
        "enable_sticky_info": true,
        "use_product_description": true,
        "variant_heading": "Choose your color",
        "add_to_cart_label": "Add to cart",
        "show_dynamic_checkout": true,
        "padding_top": 36,
        "padding_bottom": 36
      }
    },
    "rich_1": { "type": "glocket-rich-text-media", "settings": {} },
    "benefits": { "type": "glocket-benefits-grid", "settings": {} },
    "stats": { "type": "glocket-stats-proof", "settings": {} },
    "feature_1": { "type": "glocket-feature-split", "settings": {} },
    "process": { "type": "glocket-process-steps", "settings": {} },
    "feature_2": { "type": "glocket-feature-split", "settings": {} },
    "icons": { "type": "glocket-icon-row", "settings": {} },
    "proof": { "type": "glocket-comparison-or-proof", "settings": {} },
    "guarantee": { "type": "glocket-guarantee", "settings": {} },
    "cta_1": { "type": "glocket-cta-banner", "settings": {} },
    "reviews": { "type": "glocket-reviews", "settings": {} },
    "faq": { "type": "glocket-faq", "settings": {} },
    "cta_2": { "type": "glocket-cta-banner", "settings": {} }
  },
  "order": [
    "main",
    "rich_1",
    "benefits",
    "stats",
    "feature_1",
    "process",
    "feature_2",
    "icons",
    "proof",
    "guarantee",
    "cta_1",
    "reviews",
    "faq",
    "cta_2"
  ]
}
```

Ensure valid JSON (no comments). Strip the auto-generated comment header Shopify sometimes inserts, or leave a short note outside JSON if the platform requires pure JSON — **Shopify product JSON templates must be pure JSON**; do not include the `/* ... */` comment block.

- [ ] **Step 2: Delete legacy section files listed above**

Only after the new template no longer references them.

- [ ] **Step 3: Grep for stale references**

Run: `rg "glocket-product-main|glocket-benefits\"|glocket-stats\"|glocket-features|glocket-how-made" trade -g '*.json' -g '*.liquid'`  
Expected: no matches in templates/sections still in use

- [ ] **Step 4: Commit (if git available)**

```bash
git add trade/templates/product.glocket.json
git add -u trade/sections/glocket-*.liquid
git commit -m "feat(glocket): wire Vinia-style template and remove legacy sections"
```

---

### Task 10: Visual QA checklist + merchant handoff notes

**Files:**
- Create: `docs/superpowers/plans/2026-08-03-glocket-vinia-style-pdp-qa.md` (short QA + upload checklist)

- [ ] **Step 1: Write QA checklist covering**

Desktop vs Vinia:
- [ ] Two-column buy box proportions
- [ ] Vertical thumbs left of main image
- [ ] Social proof → title → badge → bullets → tiles → qty → price → ATC/Buy it now → trust row
- [ ] Accordions under gallery with chevrons
- [ ] Below-fold section order and spacing rhythm

Mobile:
- [ ] Single column stack
- [ ] Horizontal thumbs
- [ ] Touch-friendly tiles and accordions
- [ ] CTA full width

Functional:
- [ ] Variant tile selection updates price and ATC state
- [ ] Variant image updates gallery when variant has media
- [ ] ATC adds correct variant/qty
- [ ] Buy it now appears when enabled
- [ ] Theme editor can edit all blocks/settings
- [ ] No emojis in defaults
- [ ] Other product templates still use `main-product`

Merchant steps:
1. Upload/sync `trade` theme to Shopify  
2. Products → POV Glocket → Theme template → `glocket`  
3. Customize theme → fill images/copy  
4. Assign variant images for tile picker  

- [ ] **Step 2: Commit docs (if git available)**

```bash
git add docs/superpowers/plans/2026-08-03-glocket-vinia-style-pdp-qa.md
git commit -m "docs(glocket): add QA and merchant handoff checklist"
```

---

## Plan self-review

**Spec coverage**
- Buy box architecture → Tasks 2–5  
- Below-fold section types → Tasks 6–8  
- Template rebuild + file names → Task 9  
- Editor editability → schemas in Tasks 5–8  
- Simple commerce / no subscriptions / image tiles → Tasks 4–5  
- Color schemes / no Vinia assets / no emojis → Global Constraints + schemas  
- Header/footer out of scope → not tasked  
- QA / handoff → Task 10  

**Placeholder scan:** No TBD steps; legacy deletion explicitly gated after cutover.

**Consistency:** Section type names match spec file map (`glocket-product`, `glocket-benefits-grid`, etc.). Legacy alternate names deleted in Task 9.

**Note on TDD:** Shopify Liquid sections are validated via theme-check, JSON schema validity, and visual/functional QA (Task 10), not unit tests.
