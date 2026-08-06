# POV Glocket Nomad-Style PDP — Design Spec

**Date:** 2026-08-06  
**Product:** POV Glocket (same product; second template)  
**Reference layout:** `https://nomadgoods.com/products/tracking-card-pro-stellar-orange`  
**Theme base:** Shopify Trade (full theme copy for a separate zip)  
**Template:** `templates/product.nomad.json` (Theme template name: `nomad`)  
**Deliverable zip:** `trade-nomad-theme.zip` (separate from `trade-glocket-theme.zip`)

---

## 1. Goal

Build a second editable product template for POV Glocket that matches the Nomad Goods Tracking Card Pro PDP structure and visual system (rounded white cards on a soft page background, gallery + buy box, feature splits, story banner, cross-sell, specs, FAQ, reviews), while:

- Using merchant images and existing store fonts (ClashDisplay already in theme settings)
- Applying `font-family: "ClashDisplay-Medium"` across all Nomad PDP section CSS
- Using Trade color schemes (section background scheme + card scheme)
- Making every section editable in the Shopify theme editor
- Not copying Nomad assets, brand marks, or proprietary copy as defaults
- Not using grey fills behind product/content images
- Not modifying the existing Glocket Vinia-style template or its sections

“Match Nomad” means structural and component fidelity (layout, radii, card containers, option pills/swatches, section rhythm), not a clone of Nomad creative assets.

---

## 2. Decisions (locked)

| Topic | Decision |
|---|---|
| Product assignment | Same POV Glocket product; assign template **nomad** |
| Zip packaging | **A** — Full Trade theme copy with Nomad template/sections only added as new files |
| Font | Use `font-family: "ClashDisplay-Medium"` everywhere in Nomad section CSS; font already in Shopify theme settings |
| Commerce | **A** — Variants + quantity + Add to cart + Buy it now |
| Variant UI | **C** — Both: Nomad pills/swatches (default) and Glocket-style image tiles via section setting |
| Page scope | **A** — Full page: buy box + overview + feature splits + story + cross-sell + specs + FAQ + reviews |
| Color / cards | **A** — Section color scheme for page/gap background; separate card color scheme for white rounded containers |
| Architecture | Dedicated `nomad-*` sections (Approach 1) |
| Image backgrounds | Transparent — no grey behind images |
| Reviews | Editable theme content only (no reviews app) |
| Header / announcement / footer | Out of scope; keep Trade globals |
| Not included | Nomad gift popup, geo shipping banner, subscriptions, review apps, Nomad brand assets |
| Emojis | None in defaults, UI chrome, section labels, or placeholder copy |
| Mobile | First-class: stacked cards, touch targets, horizontal thumb/cross-sell scroll, readable type at ≤749px |

---

## 3. Architecture

### 3.1 Approach

Custom Nomad-only sections and snippets. Do not modify shared `main-product.liquid` or any `glocket-*` files. Wire everything through `product.nomad.json`.

Implementation may live in a dedicated theme folder copy (e.g. `trade-nomad/`) or be built as additive files then zipped from a full Trade tree — final zip must be a complete uploadable Trade theme containing the Nomad template. Existing Glocket work remains available in its own zip and must not be broken.

### 3.2 File map

Paths relative to theme root.

#### Template

| File | Role |
|---|---|
| `templates/product.nomad.json` | Section order and default settings for Nomad-style Glocket PDP |

#### Buy box

| File | Role |
|---|---|
| `sections/nomad-product.liquid` | Gallery + info column + product form + overview/cross-sell near buy box |
| `snippets/nomad-gallery.liquid` | Main media + thumbnails |
| `snippets/nomad-variant-pills.liquid` | Nomad-style option pills + color swatches |
| `snippets/nomad-variant-tiles.liquid` | Optional image-tile variant picker |
| `snippets/nomad-accordion.liquid` | Collapsible rows (Overview / More Info style) |

#### Below-the-fold sections

| File | Nomad-like role |
|---|---|
| `sections/nomad-feature-split.liquid` | Reusable text + media rounded card (story features) |
| `sections/nomad-story-banner.liquid` | Limited-edition / collection story card |
| `sections/nomad-cross-sell.liquid` | Keep Exploring product card row |
| `sections/nomad-specs.liquid` | More Info / Design / Technical accordion groups |
| `sections/nomad-faq.liquid` | FAQ accordion |
| `sections/nomad-reviews.liquid` | Editable rating summary + review cards |

#### CSS / JS

| File | Role |
|---|---|
| `assets/nomad-product.css` | Buy box, gallery, pills, ATC |
| `assets/nomad-product.js` | Gallery, variants, money formatting, ATC helpers |
| `assets/nomad-sections.css` | Shared card tokens, feature split, story, cross-sell, specs, FAQ, reviews |

Prefer section-scoped assets. Shared tokens (radius, font, card padding, gap) live in `nomad-sections.css` and are reused by product CSS.

### 3.3 Shared visual tokens

- **Font:** `font-family: "ClashDisplay-Medium", sans-serif` on Nomad PDP wrappers
- **Card radius:** Large Nomad-like radius (target ~20–28px); use a CSS custom property e.g. `--nomad-radius`
- **Buttons:** Pill / highly rounded primary CTA matching Nomad feel; colors from color scheme
- **Cards:** Background/text from **card color scheme**; no forced `#fff` hard-code when scheme is set
- **Section shell:** Background from **section color scheme**; vertical gaps between cards
- **Media:** `background: transparent` on image stages; no `rgba(foreground, 0.04)` fills

### 3.4 Out of scope

- Restyling Trade header, announcement bar, footer
- Changes to `product.glocket.json` or `glocket-*` assets/sections
- Nomad gift/email modal
- Shipping geo / locale disclaimer bars
- Review app integrations (Okendo, etc.)
- Selling plans / subscriptions
- Copying Nomad product photography or logo

---

## 4. Buy box design (`nomad-product`)

### 4.1 Layout

Two columns on desktop:

- **Left:** Gallery (main image + vertical thumbnails)
- **Right:** Rounded **info card** (card color scheme) with social proof → title/price → description → variants → badge → quantity → ATC + Buy it now

Below / under the buy stack:

- Overview accordion as its own rounded card
- Optional “Others Like You Also Bought” cross-sell card (can also be a separate section instance; default near buy box)

Mobile: gallery first, then info card, then overview, then near-buy-box cross-sell.

Optional sticky info or gallery on desktop via section setting.

### 4.2 Gallery

- Product media from Shopify product media
- Desktop: vertical thumbnail strip beside main image
- Mobile: horizontal thumbnails
- Rounded media corners; transparent stage (no grey)
- Support images; video if product has video media where practical

### 4.3 Right column blocks / settings

1. **Social proof** — editable stars/rating text, review-count text, optional URL  
2. **Title** — product title (toggle custom heading override)  
3. **Price** — live variant price  
4. **Description** — richtext (default short placeholder for Glocket)  
5. **Variant picker mode** — `pills` (default) | `tiles`  
6. **Badge** — optional editable pill (e.g. duties/taxes note)  
7. **Quantity** — show/hide  
8. **ATC + Buy it now** — Trade dynamic checkout; style to scheme; rounded/pill  
9. **Trust note** — optional text under CTAs  

### 4.4 Variant UI

**Pills mode (default):**

- One row per product option
- Option name label
- Unselected: outlined / soft pill; selected: filled using scheme foreground/background inversion
- Color-like options: round swatches (use swatch from Shopify when available; else label pills)

**Tiles mode:**

- Image + label tiles (same idea as Glocket); selected thick border
- Uses variant featured image / option image when available

JS updates price, media (when variant has image), and availability.

### 4.5 Overview accordion

- Rounded card under buy box
- Blocks: heading + richtext or bullet list
- Default one “Overview” block with Glocket placeholder bullets

---

## 5. Below-the-fold sections

### 5.1 `nomad-feature-split`

- Single rounded card spanning content width
- Grid: text | media (or media | text)
- Settings: heading, body, optional CTA label/link, image, media position, color schemes, image fit (cover/contain/fill/extend; default cover for Nomad edge-to-edge look)
- No grey behind image; image clipped to card radius on media half
- Reused 3× in default template with Glocket placeholder copy

### 5.2 `nomad-story-banner`

- Rounded card for limited-edition / collection story
- Eyebrow, heading, body, optional link, image or background image
- Card + section schemes

### 5.3 `nomad-cross-sell`

- Heading (e.g. “Keep Exploring”)
- Blocks: image, title, subtitle, price text, URL
- Horizontal scroll or grid of rounded product-style cards
- Manual/editable only (no dependency on recommendation apps)

### 5.4 `nomad-specs`

- Accordion groups in a rounded card
- Blocks: group heading + list items (or richtext)
- Defaults: Design / Technical style placeholder groups for Glocket

### 5.5 `nomad-faq`

- Rounded FAQ accordion
- Blocks: question + answer richtext
- Glocket-oriented placeholder FAQs

### 5.6 `nomad-reviews`

- Editable overall rating, review count text
- Blocks: author, rating, title, body, optional avatar image
- No third-party reviews app required

---

## 6. Default template order

`product.nomad.json` default section order:

1. `nomad-product` (gallery, buy box, overview, optional near-ATC cross-sell)
2. `nomad-feature-split` × 3 (feature stories)
3. `nomad-story-banner`
4. `nomad-cross-sell` (Keep Exploring)
5. `nomad-specs`
6. `nomad-faq`
7. `nomad-reviews`

Merchants can reorder/remove/add instances in the theme editor.

---

## 7. Content & compliance rules

- Defaults are Glocket placeholders, not Nomad product copy or images
- No emojis anywhere in shipped defaults, UI chrome, schema labels, or placeholder copy
- Mobile-first breakpoints: buy box stacks; cards full-width with comfortable padding; pills wrap; thumbs and cross-sell scroll horizontally with peek; CTAs full-width; no horizontal page overflow
- No grey image stage backgrounds
- All merchant-facing strings editable via section/block settings
- Color via Trade color schemes only (section + card), not hard-coded Nomad brand colors
- ClashDisplay-Medium applied via Nomad CSS; do not ship or require new font files in this zip for that family

---

## 8. Packaging & QA

### 8.1 Zip

- Produce `trade-nomad-theme.zip` as a full Trade theme upload
- Keep `trade-glocket-theme.zip` / Glocket files intact for the other template workflow
- Nomad zip must include `product.nomad.json` and all `nomad-*` dependencies

### 8.2 Merchant steps

1. Upload `trade-nomad-theme.zip` as a new theme (or merge files into an existing Trade theme carefully)
2. Assign product template **nomad** to POV Glocket
3. Confirm ClashDisplay-Medium is available in theme typography settings
4. Set section vs card color schemes so cards read as light panels on the page background
5. Replace placeholder images/copy

### 8.3 QA checklist

- Desktop + mobile layout of buy box and cards (no horizontal overflow; usable touch targets)
- Pill and tile variant modes both work; price/media update
- ATC + Buy it now work
- No grey behind gallery or feature images
- No emojis in any default content or chrome
- Font renders as ClashDisplay-Medium on Nomad sections
- Accordion overview / specs / FAQ open-close
- Theme editor can edit all sections/blocks
- Glocket template (`product.glocket.json`) unaffected when both exist in same theme tree

---

## 9. Success criteria

- Glocket can use template **nomad** and visually read as a Nomad-like card PDP
- Everything is theme-editor editable
- Separate zip does not replace or break the Vinia-style Glocket deliverable
- No grey image backgrounds; ClashDisplay-Medium used throughout Nomad sections
- Commerce matches Glocket guidelines (variants + qty + ATC + Buy it now)
