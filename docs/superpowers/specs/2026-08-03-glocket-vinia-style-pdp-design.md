# POV Glocket Vinia-Style PDP — Design Spec

**Date:** 2026-08-03  
**Product:** POV Glocket (`https://pov-worldwide.com/products/pov-glocket`)  
**Reference layout:** `https://vinia.com/products/vinia-coffee`  
**Theme:** Shopify Trade, local path `trade/`  
**Template:** Rebuild `trade/templates/product.glocket.json` (Theme template name: `glocket`)

---

## 1. Goal

Rebuild the Glocket product template so its layout, spacing hierarchy, badges, gallery treatment, accordions, and below-the-fold section rhythm closely match the Vinia coffee PDP (desktop and mobile), while:

- Using the merchant’s own images and fonts (Trade theme fonts / existing brand setup)
- Using Trade theme color schemes (not Vinia’s burgundy as hard-coded brand)
- Making every section editable in Shopify Online Store theme editor
- Not copying Vinia assets or fonts
- Not using emojis in defaults or UI chrome we ship

“Pixel-perfect” means structural and spacing fidelity to Vinia’s conversion-oriented layout, not a clone of their creative assets.

---

## 2. Decisions (locked)

| Topic | Decision |
|---|---|
| Scope | Full page: buy box + all Vinia-like below-the-fold section types |
| Template | Rebuild existing `product.glocket.json` only |
| Other templates | Unchanged |
| Header / announcement / footer | Out of scope; keep Trade globals |
| Commerce | Simple: variants + quantity + Add to cart + Buy it now |
| Not included | Subscriptions, multi-product format grid, “people/savings” tiers |
| Colors | Trade color schemes |
| Reviews | Editable theme content only (no reviews app) |
| Variant UI | Vinia-style image tiles (image + label; selected thick border) |
| Below-fold content | Same section *types* as Vinia; placeholder copy/images for Glocket |
| Architecture | Custom dedicated sections (Approach 1) |
| Reference visuals | Live Glocket URL + Vinia page as layout reference |

---

## 3. Architecture

### 3.1 Approach

Custom Glocket-only sections and snippets. Do not modify shared `main-product.liquid` in ways that affect other product templates. Wire everything through `product.glocket.json`.

### 3.2 File map

All paths relative to `trade/`.

#### Template

| File | Role |
|---|---|
| `templates/product.glocket.json` | Section order and default settings for Glocket PDP |

#### Buy box

| File | Role |
|---|---|
| `sections/glocket-product.liquid` | Main product gallery + info column + product form |
| `snippets/glocket-gallery.liquid` | Main media + thumbnails |
| `snippets/glocket-variant-tiles.liquid` | Image-tile variant picker |
| `snippets/glocket-accordion.liquid` | Collapsible rows under gallery |

#### Below-the-fold sections

| File | Vinia-like role |
|---|---|
| `sections/glocket-rich-text-media.liquid` | Headline + body + media story block |
| `sections/glocket-benefits-grid.liquid` | Benefit icon/title/text cards |
| `sections/glocket-stats-proof.liquid` | Large claim / clinical-style stats + CTA |
| `sections/glocket-feature-split.liquid` | Text + media split + CTA (reusable) |
| `sections/glocket-process-steps.liquid` | How it works / process steps |
| `sections/glocket-icon-row.liquid` | Certification / feature icon strip |
| `sections/glocket-comparison-or-proof.liquid` | Proof / preference / claim block |
| `sections/glocket-guarantee.liquid` | Guarantee badge + copy |
| `sections/glocket-reviews.liquid` | Editable rating summary + review cards |
| `sections/glocket-faq.liquid` | FAQ accordion |
| `sections/glocket-cta-banner.liquid` | Mid/end page CTA strips |

#### CSS / JS

Prefer `{% stylesheet %}` and `{% javascript %}` inside sections/snippets. Add `assets/glocket-*.css` / `assets/glocket-*.js` only if a component becomes too large for inline tags.

### 3.3 Out of scope

- Trade header, announcement bar, footer restyles
- Changes to other `product.*.json` templates
- GemPages / EComposer page-builder implementations for this PDP
- Review app integrations
- Selling plans / subscriptions
- Removing Locksmith (or other layout-injected apps) from `theme.liquid`

---

## 4. Buy box design (`glocket-product`)

### 4.1 Layout

Two columns on desktop (Vinia-like):

- **Left:** Gallery (main image + vertical thumbnails) and accordion stack beneath gallery
- **Right:** Social proof → title → trust badge → description → bullets → variant tiles → quantity → price → ATC + Buy it now → trust icons row

Mobile: gallery first, then info stack; accordions follow Vinia mobile order (configurable if needed). Optional sticky info column on desktop via section setting.

### 4.2 Gallery

- Product media from Shopify product media
- Desktop: vertical thumbnail strip beside main image
- Mobile: horizontal thumbnails
- Respect media types Trade already supports where practical (images; video if product has video media)

### 4.3 Right column blocks / settings

1. **Social proof** — editable rating text, review-count text, optional customers text, optional URL  
2. **Title** — `product.title` with Vinia-like size/weight treatment using theme type scale  
3. **Trust / claim badge** — optional icon/image, headline, body, optional link (slot equivalent to Vinia “Clinically Proven”)  
4. **Description** — richtext setting and/or toggle to use `product.description`  
5. **Bullets** — blocks: optional icon image + text  
6. **Variant tiles** — one tile per variant; image from variant image (fallback featured); label = variant title; selected = thick border using scheme accent; unavailable = disabled styling  
7. **Quantity** — standard quantity input  
8. **Price** — selected variant price (compare-at if present)  
9. **Buttons** — Add to cart + Buy it now (dynamic checkout); labels editable  
10. **Trust row** — 2–4 blocks: icon/image + short label  

### 4.4 Accordions (under gallery)

Blocks with heading + richtext (and optional page link if useful). Default placeholder headings only (no emoji). Style: hairline separators, chevron, Vinia-like density.

### 4.5 Commerce behavior

- Native Shopify product form
- No selling plans UI
- Sold-out product: disable ATC appropriately; still show Buy it now only when Shopify allows
- Variant tile click updates selected variant, price, and gallery featured image when variant has an image

---

## 5. Below-the-fold sections

All content is merchant-editable. Defaults are empty or neutral placeholders (no Vinia copy, no emojis).

### 5.1 Default order in `product.glocket.json`

1. `glocket-product` (buy box)  
2. `glocket-rich-text-media`  
3. `glocket-benefits-grid`  
4. `glocket-stats-proof`  
5. `glocket-feature-split`  
6. `glocket-process-steps`  
7. `glocket-feature-split` (second instance for deep-dive)  
8. `glocket-icon-row`  
9. `glocket-comparison-or-proof`  
10. `glocket-guarantee`  
11. `glocket-cta-banner`  
12. `glocket-reviews`  
13. `glocket-faq`  
14. `glocket-cta-banner` (closing CTA)  

Merchant may reorder, hide, or add more instances via **Add section**.

### 5.2 Section responsibilities

**glocket-rich-text-media**  
Heading, subheading, body, media (image or video URL/file), optional CTA, color scheme, alignment.

**glocket-benefits-grid**  
Section heading; blocks with icon/image, title, text; columns responsive (e.g. 2–3 desktop, 1 mobile).

**glocket-stats-proof**  
Large headline, supporting body, optional media, primary CTA; blocks for stat callouts (value + label + short text).

**glocket-feature-split**  
Left/right media vs text, heading, body, CTA, image; setting for media side.

**glocket-process-steps**  
Heading; ordered blocks: image, title, text.

**glocket-icon-row**  
Blocks: image + optional label; horizontal wrap / scroll on mobile as needed to match Vinia density.

**glocket-comparison-or-proof**  
Headline, supporting claims, optional media, optional stat callouts or quote-style lines (all settings/blocks).

**glocket-guarantee**  
Badge image, title, body, optional CTA.

**glocket-reviews**  
Summary rating + count text; blocks: quote, author name, optional star value, optional avatar image. No app API.

**glocket-faq**  
Heading; blocks: question + answer (`details`/`summary` or equivalent accessible accordion).

**glocket-cta-banner**  
Heading/subtext, button label + link (or scroll-to-product), background/scheme, optional image.

### 5.3 Shared section settings pattern

Where useful, each section supports:

- Color scheme (Trade schemes)
- Padding top / bottom
- Optional max-width / page-width alignment
- Heading size or style select when it materially affects Vinia-like hierarchy

---

## 6. Theme editor workflow

1. Upload/sync the `trade` theme (or changed files) to the Shopify store.  
2. In Admin → Products → POV Glocket → set Theme template to **glocket**.  
3. Online Store → Themes → Customize → open POV Glocket.  
4. Edit **Glocket product** for buy-box content; ensure each variant has an image for tiles.  
5. Fill below-fold sections with Glocket copy and images; reorder/hide as needed.  

---

## 7. Success criteria

- Desktop and mobile layout closely match Vinia’s PDP structure (gallery, badges, accordions, section rhythm, spacing hierarchy)
- ATC and Buy it now work with real variants and quantity
- All merchant-facing copy, images, and links editable in the theme editor
- Other product templates and global header/footer unchanged
- No emojis in shipped defaults
- No dependency on GemPages/EComposer for this template

---

## 8. Risks and notes

- Exact pixel match depends on measuring Vinia spacing during implementation; adjust CSS against screenshots/live reference
- Manual reviews mean rating numbers can drift unless merchant updates them
- Theme contains Locksmith and page-builder leftovers; keep Locksmith intact; do not route Glocket PDP through page builders
- Fonts: inherit Trade / merchant font setup; do not load Vinia fonts

---

## 9. Implementation follow-up

After this spec is approved:

1. Write an implementation plan (`writing-plans` skill)  
2. Implement files under `trade/`  
3. Merchant syncs theme and fills editor content  
4. Visual QA against Vinia desktop + mobile and live Glocket URL  

---

## 10. Spec self-review checklist

- [x] No TBD/placeholder requirements left unresolved for architecture decisions  
- [x] File names and locations explicit  
- [x] Commerce scope matches “simple ATC + Buy it now”  
- [x] Below-fold list matches “same types, placeholder content”  
- [x] Out of scope clearly excludes header/footer and other templates  
- [x] Scope is one product template — suitable for a single implementation plan  
