# POV Glocket Nomad-Style PDP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a second editable Glocket product template that matches the Nomad Goods PDP card layout (buy box + below-fold), packaged as a separate full Trade theme zip.

**Architecture:** Dedicated `nomad-*` sections/snippets/assets under `trade/`, wired only through `templates/product.nomad.json`. Do not modify `glocket-*` files or shared `main-product.liquid`. Deliver `trade-nomad-theme.zip` as a full Trade upload.

**Tech Stack:** Shopify Trade (Liquid OS 2.0), section schemas, native product form + dynamic checkout, Trade color schemes (section + card), ClashDisplay-Medium via CSS, `assets/nomad-*.css|js`.

**Spec:** `docs/superpowers/specs/2026-08-06-glocket-nomad-style-pdp-design.md`  
**Reference:** https://nomadgoods.com/products/tracking-card-pro-stellar-orange

## Global Constraints

- Paths under `trade/` unless noted
- `font-family: "ClashDisplay-Medium", sans-serif` on all Nomad PDP wrappers
- Section color scheme = page/gap background; card color scheme = rounded containers
- No grey fills behind images (`background: transparent` on media stages)
- No emojis in defaults, UI chrome, schema labels, or placeholder copy
- Mobile-first: stack at ≤749px; full-width CTAs; wrapping pills; horizontal thumb/cross-sell scroll with peek; no page horizontal overflow; min ~44px touch targets
- Commerce: variants + quantity + Add to cart + Buy it now only
- Variant UI setting: `pills` (default) | `tiles`
- Header / footer out of scope
- Do not break Locksmith hooks in `layout/theme.liquid`
- Do not edit `glocket-*` files
- Frequent commits after each task when git is available

## File structure

| Path | Action | Responsibility |
|---|---|---|
| `assets/nomad-sections.css` | Create | Shared tokens, cards, below-fold, mobile |
| `assets/nomad-product.css` | Create | Buy box, gallery, pills, tiles, ATC |
| `assets/nomad-product.js` | Create | Gallery, pills, tiles, accordion, price sync |
| `snippets/nomad-gallery.liquid` | Create | Main media + thumbs |
| `snippets/nomad-variant-pills.liquid` | Create | Option pills + color swatches |
| `snippets/nomad-variant-tiles.liquid` | Create | Image-tile picker (alt mode) |
| `snippets/nomad-accordion.liquid` | Create | Accordion row UI |
| `sections/nomad-product.liquid` | Create | Buy box + overview + optional near cross-sell |
| `sections/nomad-feature-split.liquid` | Create | Text + media rounded card |
| `sections/nomad-story-banner.liquid` | Create | Limited-edition / story card |
| `sections/nomad-cross-sell.liquid` | Create | Keep Exploring cards |
| `sections/nomad-specs.liquid` | Create | More Info / Design / Technical accordions |
| `sections/nomad-faq.liquid` | Create | FAQ accordion |
| `sections/nomad-reviews.liquid` | Create | Editable reviews |
| `templates/product.nomad.json` | Create | Default section order + placeholders |
| `trade-nomad-theme.zip` | Create (repo root) | Full Trade theme zip for upload |

---

### Task 1: Shared Nomad CSS foundation

**Files:**
- Create: `trade/assets/nomad-sections.css`
- Create: `trade/assets/nomad-product.css` (tokens + layout stubs only; buy-box detail in Task 4)

**Interfaces:**
- Produces classes/tokens used by all Nomad sections:
  - `.nomad-page`, `.nomad-section`, `.nomad-section__inner`, `.nomad-card`, `.nomad-heading`, `.nomad-body`, `.nomad-btn`, `.nomad-media`
  - `--nomad-radius` (~24px), `--nomad-gap`, padding vars
  - Breakpoints: `750px`, `990px` (Trade-aligned)

- [ ] **Step 1: Create `trade/assets/nomad-sections.css`**

```css
.nomad-page,
.nomad-section,
.nomad-card,
.nomad-heading,
.nomad-body,
.nomad-btn {
  font-family: "ClashDisplay-Medium", sans-serif;
}

.nomad-section {
  --nomad-radius: 24px;
  --nomad-gap: 1rem;
  padding-top: var(--nomad-pad-top, 16px);
  padding-bottom: var(--nomad-pad-bottom, 16px);
}

.nomad-section__inner {
  max-width: var(--page-width, 1200px);
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

.nomad-card {
  border-radius: var(--nomad-radius);
  overflow: hidden;
  background: rgb(var(--color-background));
  color: rgb(var(--color-foreground));
}

.nomad-heading {
  margin: 0 0 1rem;
  line-height: 1.15;
  letter-spacing: 0.01em;
}

.nomad-body {
  margin: 0 0 1.25rem;
  line-height: 1.55;
}

.nomad-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0.9rem 1.5rem;
  border-radius: 999px;
  border: none;
  text-decoration: none;
  cursor: pointer;
  background: rgb(var(--color-button));
  color: rgb(var(--color-button-text));
}

.nomad-media {
  background: transparent;
  overflow: hidden;
}

.nomad-media img,
.nomad-media .placeholder-svg {
  display: block;
  width: 100%;
  height: auto;
  background: transparent;
}

.nomad-media-fit--cover img,
.nomad-media-fit--cover .placeholder-svg {
  width: 100%;
  height: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

.nomad-media-fit--contain img,
.nomad-media-fit--contain .placeholder-svg {
  width: 100%;
  height: 100%;
  aspect-ratio: 4 / 5;
  object-fit: contain;
  background: transparent;
}

.nomad-media-fit--fill img,
.nomad-media-fit--fill .placeholder-svg {
  width: 100%;
  height: 100%;
  aspect-ratio: 4 / 5;
  object-fit: fill;
}

.nomad-media-fit--extend img,
.nomad-media-fit--extend .placeholder-svg {
  width: 100%;
  height: auto;
  aspect-ratio: auto;
  object-fit: contain;
}

/* Feature split shell (filled in Task 5) */
.nomad-feature-split__grid {
  display: grid;
  gap: 0;
}

@media screen and (min-width: 750px) {
  .nomad-feature-split__grid {
    grid-template-columns: 1fr 1fr;
    align-items: stretch;
  }
}

@media screen and (max-width: 749px) {
  .nomad-section__inner {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .nomad-btn {
    width: 100%;
  }
}
```

- [ ] **Step 2: Create stub `trade/assets/nomad-product.css`**

```css
.nomad-product,
.nomad-product * {
  font-family: "ClashDisplay-Medium", sans-serif;
}

.nomad-product {
  --nomad-radius: 24px;
}

.nomad-product__layout {
  display: grid;
  gap: 1rem;
}

@media screen and (min-width: 990px) {
  .nomad-product__layout {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: 1rem;
    align-items: start;
  }
}
```

- [ ] **Step 3: Verify no emoji / no grey fills**

Run: `rg -n "emoji|rgba\\(var\\(--color-foreground\\), 0\\.0[0-9]\\)" trade/assets/nomad-*.css || true`  
Expected: no matches for grey stage fills; no emoji characters in these new files.

- [ ] **Step 4: Commit**

```bash
git add trade/assets/nomad-sections.css trade/assets/nomad-product.css
git commit -m "feat(nomad): add shared CSS tokens and card foundation"
```

---

### Task 2: Gallery + variant snippets

**Files:**
- Create: `trade/snippets/nomad-gallery.liquid`
- Create: `trade/snippets/nomad-variant-pills.liquid`
- Create: `trade/snippets/nomad-variant-tiles.liquid`
- Create: `trade/snippets/nomad-accordion.liquid`
- Modify: `trade/assets/nomad-product.css` (gallery + pill + tile styles)

**Interfaces:**
- Consumes: `product`, `section`, `product_form_id` (string)
- Produces markup hooks:
  - `[data-gallery]`, `.nomad-gallery__image`, `.nomad-gallery__thumb[data-media-src]`
  - Pills: `input[type=radio][data-variant-id][data-variant-price][data-media-src]`
  - Tiles: same data attributes on radios inside `.nomad-variant-tiles__tile`
  - Accordion: `.nomad-accordion__item` / `button.nomad-accordion__trigger`

- [ ] **Step 1: Create `trade/snippets/nomad-gallery.liquid`**

Mirror `glocket-gallery.liquid` with `nomad-` class names, `{% doc %}`, transparent stage, `aria-label` without emoji. Vertical thumbs desktop / horizontal mobile via CSS in product CSS.

- [ ] **Step 2: Create `trade/snippets/nomad-variant-pills.liquid`**

```liquid
{% doc %}
  Nomad-style option pills and color swatches.
  @param {object} product
  @param {string} product_form_id
{% enddoc %}
<div class="nomad-variant-pills" data-nomad-variant-pills>
  {% for option in product.options_with_values %}
    {% assign option_downcase = option.name | downcase %}
    {% assign is_color = false %}
    {% if option_downcase contains 'color' or option_downcase contains 'colour' %}
      {% assign is_color = true %}
    {% endif %}
    <fieldset class="nomad-variant-pills__group">
      <legend class="nomad-variant-pills__legend">{{ option.name | escape }}</legend>
      <div class="nomad-variant-pills__options{% if is_color %} nomad-variant-pills__options--swatches{% endif %}">
        {% for value in option.values %}
          {% assign input_id = product_form_id | append: '-opt-' | append: option.position | append: '-' | append: forloop.index %}
          <label class="nomad-variant-pills__label{% if is_color %} nomad-variant-pills__label--swatch{% endif %}{% if value.selected %} is-selected{% endif %}">
            <input
              form="{{ product_form_id }}"
              type="radio"
              name="options[{{ option.name | escape }}]"
              value="{{ value | escape }}"
              id="{{ input_id }}"
              {% if value.selected %}checked{% endif %}
              data-option-position="{{ option.position }}"
              data-option-value="{{ value | escape }}"
            >
            {% if is_color %}
              <span class="nomad-variant-pills__swatch" title="{{ value | escape }}"></span>
              <span class="visually-hidden">{{ value | escape }}</span>
            {% else %}
              <span class="nomad-variant-pills__text">{{ value | escape }}</span>
            {% endif %}
          </label>
        {% endfor %}
      </div>
    </fieldset>
  {% endfor %}
</div>
```

Note: JS maps selected option values → matching variant id (see Task 4). Optionally enhance swatches later with `value.swatch` when available on the storefront API version in Trade.

- [ ] **Step 3: Create `trade/snippets/nomad-variant-tiles.liquid`**

Copy structure from `glocket-variant-tiles.liquid`, rename classes to `nomad-variant-tiles`, keep `data-variant-id`, `data-variant-price`, `data-media-src`. Strip HTML from money in JS later (same bugfix as Glocket).

- [ ] **Step 4: Create `trade/snippets/nomad-accordion.liquid`**

```liquid
{% doc %}
  @param {string} heading
  @param {string} content - HTML richtext
  @param {boolean} [open]
{% enddoc %}
<details class="nomad-accordion__item"{% if open %} open{% endif %}>
  <summary class="nomad-accordion__trigger">
    <span>{{ heading | escape }}</span>
  </summary>
  <div class="nomad-accordion__panel rte">{{ content }}</div>
</details>
```

- [ ] **Step 5: Add gallery / pills / tiles / accordion CSS to `nomad-product.css`**

Requirements:
- Gallery stage `background: transparent`
- Thumbs: desktop vertical beside stage; mobile horizontal scroll, hide scrollbar, peek next thumb
- Pills: wrap; selected filled; min-height 44px; swatches ~28–36px circles with selected ring
- Tiles: selected border; transparent media bg
- Accordion: full rounded card border; comfortable padding on mobile

- [ ] **Step 6: Commit**

```bash
git add trade/snippets/nomad-*.liquid trade/assets/nomad-product.css
git commit -m "feat(nomad): add gallery, variant, and accordion snippets"
```

---

### Task 3: Buy box section (`nomad-product`)

**Files:**
- Create: `trade/sections/nomad-product.liquid`
- Modify: `trade/assets/nomad-product.css`

**Interfaces:**
- Consumes snippets from Task 2
- Loads `nomad-product.css`, `nomad-product.js`, Trade `product-form.js`, `component-price.css`
- Root: `.nomad-product.color-{{ section.settings.color_scheme }}`
- Info card: nested `.nomad-card.color-{{ section.settings.card_color_scheme }}`
- Hidden `input[name=id][data-nomad-variant-id]`
- Price node: `[data-nomad-price]`
- Setting `variant_style`: `pills` | `tiles` (default `pills`)

- [ ] **Step 1: Scaffold section markup**

Structure:

```liquid
{{ 'nomad-product.css' | asset_url | stylesheet_tag }}
{{ 'nomad-sections.css' | asset_url | stylesheet_tag }}
{{ 'component-price.css' | asset_url | stylesheet_tag }}
<script src="{{ 'nomad-product.js' | asset_url }}" defer></script>
<script src="{{ 'product-form.js' | asset_url }}" defer></script>

{% assign product_form_id = 'NomadProductForm-' | append: section.id %}

<section
  id="NomadProduct-{{ section.id }}"
  class="nomad-section nomad-product color-{{ section.settings.color_scheme }} gradient"
  data-nomad-product
  data-product-id="{{ product.id }}"
  data-variants="{{ product.variants | json | escape }}"
>
  <div class="nomad-section__inner nomad-product__layout">
    <div class="nomad-product__gallery nomad-card color-{{ section.settings.card_color_scheme }}">
      {% render 'nomad-gallery', product: product, section: section %}
    </div>

    <div class="nomad-product__info nomad-card color-{{ section.settings.card_color_scheme }}{% if section.settings.enable_sticky_info %} nomad-product__info--sticky{% endif %}">
      <!-- social proof blocks, title, price, description -->
      <!-- variant pills or tiles -->
      <!-- badge blocks -->
      {% form 'product', product, id: product_form_id, class: 'nomad-product__form', novalidate: 'novalidate', data-type: 'add-to-cart-form' %}
        <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}" data-nomad-variant-id>
        <!-- qty, ATC, {% render 'buy-buttons' %} or Trade dynamic checkout pattern from glocket-product -->
      {% endform %}
    </div>
  </div>

  <div class="nomad-section__inner">
    <div class="nomad-card color-{{ section.settings.card_color_scheme }} nomad-product__overview">
      <!-- accordion_item blocks via nomad-accordion -->
    </div>
  </div>

  {% if section.settings.show_also_bought %}
    <div class="nomad-section__inner">
      <div class="nomad-card color-{{ section.settings.card_color_scheme }} nomad-product__also-bought">
        <!-- also_bought blocks: image, title, meta, price_text, link -->
      </div>
    </div>
  {% endif %}
</section>
```

Copy ATC / Buy it now patterns from `trade/sections/glocket-product.liquid` (product-form, `button[name=add]`, dynamic checkout styling via scheme). Style dynamic checkout buttons to match pill radius; no blue override leftovers.

- [ ] **Step 2: Schema**

Include at minimum:
- `color_scheme`, `card_color_scheme`
- `enable_sticky_info` (checkbox)
- `variant_style` select: pills / tiles
- `use_product_description` checkbox
- `custom_description` richtext
- `show_quantity` checkbox
- `show_also_bought` checkbox + heading text
- `padding_top` / `padding_bottom` ranges
- Blocks: `social_proof`, `badge`, `accordion_item`, `also_bought`, `trust_note`
- Defaults: Glocket placeholder copy, **no emojis**
- `disabled_on: { "groups": ["header", "footer"] }`
- `"name": "Nomad product"`

- [ ] **Step 3: Mobile CSS for buy box**

In `nomad-product.css`:
- ≤749px single column; card padding ~1rem
- Full-width ATC + dynamic checkout
- Pills wrap; also-bought horizontal scroll with peek
- Sticky disabled on mobile

- [ ] **Step 4: Commit**

```bash
git add trade/sections/nomad-product.liquid trade/assets/nomad-product.css
git commit -m "feat(nomad): add Nomad product buy box section"
```

---

### Task 4: Product JS (gallery, variants, price)

**Files:**
- Create: `trade/assets/nomad-product.js`

**Interfaces:**
- Consumes: `[data-nomad-product]`, `data-variants` JSON, gallery/pills/tiles hooks from Tasks 2–3
- Produces: updates `[data-nomad-variant-id]`, `[data-nomad-price]` (plain text; strip HTML from money), gallery image src, selected classes, ATC disabled when unavailable
- Event: `nomad:variant-change` bubbled with `{ variantId, price, available }`

- [ ] **Step 1: Implement `nomad-product.js`**

Include functions:
1. `initGallery(root)` — thumb click → main image (same as Glocket)
2. `initVariantTiles(root)` — radio → hidden id + price + media (strip money HTML with temporary DOM or regex)
3. `initVariantPills(productRoot)` — on option radio change, find matching variant from `JSON.parse(productRoot.dataset.variants)` by option values; set hidden id; update price/availability/media
4. `initAccordions` — optional; native `<details>` is enough
5. `DOMContentLoaded` + `shopify:section:load` re-init

Money strip helper:

```javascript
function plainMoney(value) {
  if (!value) return '';
  var el = document.createElement('div');
  el.innerHTML = value;
  return (el.textContent || el.innerText || '').trim();
}
```

- [ ] **Step 2: Smoke-check in browser / theme editor**

Expected: changing pills updates price and variant id; tiles mode works when setting flipped; no console errors.

- [ ] **Step 3: Commit**

```bash
git add trade/assets/nomad-product.js
git commit -m "feat(nomad): add product gallery and variant JS"
```

---

### Task 5: Feature split section

**Files:**
- Create: `trade/sections/nomad-feature-split.liquid`
- Modify: `trade/assets/nomad-sections.css` (complete feature-split + mobile)

**Interfaces:**
- Settings: heading, body, image, media_position (`left`|`right`), image_fit, cta_label, cta_link, color_scheme, card_color_scheme, padding
- Markup: outer section scheme → inner `.nomad-card` with scheme → grid text/media
- Media half: `.nomad-media.nomad-media-fit--{{ image_fit }}` with `background: transparent`

- [ ] **Step 1: Write section liquid + schema** (defaults without emoji; Glocket placeholder copy)

- [ ] **Step 2: CSS**

Desktop 2-col inside card; media edge-to-edge within its half; text padded.  
Mobile: stack (media above or below per position); center text optional; full-width CTA.

- [ ] **Step 3: Commit**

```bash
git add trade/sections/nomad-feature-split.liquid trade/assets/nomad-sections.css
git commit -m "feat(nomad): add feature split story card section"
```

---

### Task 6: Story banner + cross-sell

**Files:**
- Create: `trade/sections/nomad-story-banner.liquid`
- Create: `trade/sections/nomad-cross-sell.liquid`
- Modify: `trade/assets/nomad-sections.css`

**Interfaces:**
- Story: eyebrow, heading, body, link_label, link, image, schemes, padding
- Cross-sell: heading; blocks `product_card` with image, title, subtitle, price_text, link
- Mobile: cross-sell horizontal scroll, hide scrollbar, peek next card; story stacks image/text

- [ ] **Step 1: Implement both sections with schemas and default placeholder content (no emoji)**

- [ ] **Step 2: Add CSS for story + cross-sell cards**

- [ ] **Step 3: Commit**

```bash
git add trade/sections/nomad-story-banner.liquid trade/sections/nomad-cross-sell.liquid trade/assets/nomad-sections.css
git commit -m "feat(nomad): add story banner and cross-sell sections"
```

---

### Task 7: Specs + FAQ

**Files:**
- Create: `trade/sections/nomad-specs.liquid`
- Create: `trade/sections/nomad-faq.liquid`
- Modify: `trade/assets/nomad-sections.css`
- Reuse: `snippets/nomad-accordion.liquid`

**Interfaces:**
- Specs blocks: `group` with heading + richtext/list content
- FAQ blocks: `question` with question + answer richtext
- Both wrapped in `.nomad-card` with card scheme; section scheme outside

- [ ] **Step 1: Implement specs section** (defaults: Design / Technical placeholder groups for Glocket)

- [ ] **Step 2: Implement FAQ section** (3–5 Glocket placeholder Q&As, no emoji)

- [ ] **Step 3: Accordion CSS polish (full box border, mobile tap area)**

- [ ] **Step 4: Commit**

```bash
git add trade/sections/nomad-specs.liquid trade/sections/nomad-faq.liquid trade/assets/nomad-sections.css
git commit -m "feat(nomad): add specs and FAQ accordion sections"
```

---

### Task 8: Reviews section

**Files:**
- Create: `trade/sections/nomad-reviews.liquid`
- Modify: `trade/assets/nomad-sections.css`

**Interfaces:**
- Settings: heading, rating_text, reviews_count_text, schemes, padding
- Blocks: `review` — author, rating_text, title, body, optional image
- Editable only (no app)

- [ ] **Step 1: Implement section + schema with 2–3 placeholder reviews (no emoji)**

- [ ] **Step 2: CSS** — summary + stacked/grid cards; mobile single column

- [ ] **Step 3: Commit**

```bash
git add trade/sections/nomad-reviews.liquid trade/assets/nomad-sections.css
git commit -m "feat(nomad): add editable reviews section"
```

---

### Task 9: Template JSON + zip package

**Files:**
- Create: `trade/templates/product.nomad.json`
- Create: `trade-nomad-theme.zip` (repo root)

**Interfaces:**
- Template name **nomad** (Shopify: Product templates → nomad)
- Default order per spec:
  1. `nomad-product`
  2. `nomad-feature-split` ×3
  3. `nomad-story-banner`
  4. `nomad-cross-sell`
  5. `nomad-specs`
  6. `nomad-faq`
  7. `nomad-reviews`

- [ ] **Step 1: Write `product.nomad.json`** with valid section instances, block_order, and placeholder settings (no emoji strings)

Validate JSON:

```bash
python3 -c "import json; json.load(open('trade/templates/product.nomad.json')); print('ok')"
```

Expected: `ok`

- [ ] **Step 2: Ensure no emojis in Nomad files**

```bash
python3 - <<'PY'
import pathlib, re, sys
root = pathlib.Path('trade')
paths = list(root.glob('**/nomad*')) + [root/'templates'/'product.nomad.json']
# Basic emoji / symbol ranges
emoji = re.compile(r'[\U0001F300-\U0001FAFF\U00002700-\U000027BF]')
bad = []
for p in paths:
    if not p.exists() or p.is_dir():
        continue
    text = p.read_text(encoding='utf-8', errors='ignore')
    if emoji.search(text):
        bad.append(str(p))
if bad:
    print('EMOJI FOUND:', bad); sys.exit(1)
print('no emoji')
PY
```

Expected: `no emoji`

- [ ] **Step 3: Ensure no grey media fills in Nomad CSS**

```bash
rg -n "background:.*foreground.*, 0\\.0" trade/assets/nomad-*.css && exit 1 || echo 'no grey fills'
```

Expected: `no grey fills`

- [ ] **Step 4: Build zip**

```bash
rm -f trade-nomad-theme.zip
zip -r trade-nomad-theme.zip trade -x "*.DS_Store" -x "**/.DS_Store"
ls -lh trade-nomad-theme.zip
```

- [ ] **Step 5: Commit**

```bash
git add trade/templates/product.nomad.json
git commit -m "feat(nomad): wire product.nomad template and package zip"
```

(Do not commit the zip unless the user asks.)

---

### Task 10: QA checklist (mobile + desktop)

**Files:** none required (doc optional: `docs/superpowers/plans/2026-08-06-glocket-nomad-style-pdp-qa.md` if useful)

- [ ] **Step 1: Manual QA against checklist**

| Check | Pass? |
|---|---|
| Assign template **nomad** to Glocket | |
| ClashDisplay-Medium on headings/body/buttons | |
| Section vs card color schemes produce white-ish cards on softer page bg | |
| Gallery thumbs work; no grey behind images | |
| Pills mode selects variant; price updates; ATC works | |
| Tiles mode works when setting changed | |
| Buy it now present and scheme-styled | |
| Feature splits / story / cross-sell / specs / FAQ / reviews editable | |
| Mobile ≤749px: stacked buy box, no horizontal page overflow, full-width CTA, scrollable thumbs/cross-sell | |
| Touch targets ≥ ~44px on pills/ATC/accordion | |
| No emojis anywhere in defaults | |
| `product.glocket.json` / glocket sections untouched | |

- [ ] **Step 2: Commit QA doc only if created**

```bash
git add docs/superpowers/plans/2026-08-06-glocket-nomad-style-pdp-qa.md
git commit -m "docs(nomad): add merchant QA checklist"
```

---

## Spec coverage (self-review)

| Spec requirement | Task |
|---|---|
| Dedicated nomad sections + `product.nomad.json` | 1–9 |
| Full Trade zip `trade-nomad-theme.zip` | 9 |
| ClashDisplay-Medium everywhere | 1, 3, 5–8 |
| Section + card color schemes | 3, 5–8 |
| No grey image backgrounds | 1–2, 5, 9 |
| No emojis | Global + Task 9 scan |
| Mobile-friendly | 1–3, 5–8, 10 |
| ATC + Buy it now | 3–4 |
| Pills default + tiles setting | 2–4 |
| Full below-fold set | 5–8 |
| Editable reviews (no app) | 8 |
| Do not modify glocket-* | Global |
| Header/footer out of scope | Global |

## Placeholder scan

Plan contains concrete file paths, CSS/Liquid/JS skeletons, commands, and expected outputs. No TBD/TODO implementation holes remaining for core scope.
