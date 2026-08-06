# POV Glocket Nomad-Style PDP — QA Checklist

**Template:** `trade/templates/product.nomad.json`  
**Reference:** https://nomadgoods.com/products/tracking-card-pro-stellar-orange  
**Implementation plan:** `docs/superpowers/plans/2026-08-06-glocket-nomad-style-pdp.md`  
**Package:** `trade-nomad-theme.zip` (repo root)

Use this checklist after uploading the Trade theme zip and assigning the **nomad** template to POV Glocket. Static checks below were verified in-repo on `feat/nomad-style-pdp` (2026-08-06). Live theme-editor / storefront visual checks remain for the merchant.

**Legend:** `[x]` = Pass (static evidence in Notes) · `[ ]` = merchant / live visual check

---

## Merchant / theme-editor checks

| Check | Pass? | Notes |
|---|---|---|
| Assign template **nomad** to Glocket | [ ] | Products → POV Glocket → Theme template → `nomad` |
| ClashDisplay-Medium on headings/body/buttons | [ ] | Static: `font-family: "ClashDisplay-Medium"` on `.nomad-page` / `.nomad-section` / `.nomad-card` / `.nomad-heading` / `.nomad-body` / `.nomad-btn` in `nomad-sections.css` + `nomad-product.css`. Confirm live rendering. |
| Section vs card color schemes produce white-ish cards on softer page bg | [ ] | Static: every Nomad section exposes `color_scheme` + `card_color_scheme`. Confirm chosen schemes visually. |
| Gallery thumbs work; no grey behind images | [ ] | Static **Pass** on grey fills: media stages use `background: transparent` throughout `nomad-*.css`; grey-fill scan found no `#e5e5e5` / `#f5f5f5` / grey image backgrounds. Confirm thumbs + gallery interaction live. |
| Pills mode selects variant; price updates; ATC works | [ ] | Static: default `variant_style` = `pills`; ATC + form wired in `nomad-product.liquid` + `nomad-product.js`. Confirm storefront. |
| Tiles mode works when setting changed | [ ] | Static: schema setting `pills` \| `tiles`; tiles snippet rendered when selected. Confirm in theme editor. |
| Buy it now present and scheme-styled | [ ] | Static: `show_dynamic_checkout` default on; `{{ form \| payment_button }}` present. Confirm Shopify dynamic checkout enabled for store. |
| Feature splits / story / cross-sell / specs / FAQ / reviews editable | [ ] | Static **Pass**: `product.nomad.json` order = main → feature×3 → story → cross_sell → specs → faq → reviews; all `nomad-*` section types. Confirm blocks editable in theme editor. |
| Mobile ≤749px: stacked buy box, no horizontal page overflow, full-width CTA, scrollable thumbs/cross-sell | [ ] | Static: stack / `overflow-x: auto` thumbs & cross-sell / full-width CTA rules in CSS. Confirm on device or responsive preview. |
| Touch targets ≥ ~44px on pills/ATC/accordion | [ ] | Static **Pass**: `min-height: 44px`+ on pills, thumbs, ATC (48px), accordion triggers (44–52px) in `nomad-product.css` / `nomad-sections.css`. Confirm feel on touch device. |
| No emojis anywhere in defaults | [x] | **Pass** — Python Unicode emoji scan + glyph scan over all `trade/**/nomad*` + `product.nomad.json`: 0 hits (2026-08-06). |
| `product.glocket.json` / glocket sections untouched | [x] | **Pass** — `git log c3f2ed6^..HEAD --name-only` contains no `trade/**/glocket*` paths. Working-tree glocket edits (if any) are outside Nomad commits. |

---

## Static verification (automated / in-repo)

| Check | Result | Evidence |
|---|---|---|
| `product.nomad.json` exists | **Pass** | `trade/templates/product.nomad.json` present |
| `trade-nomad-theme.zip` exists | **Pass** | Repo-root zip present (~2.9 MB) |
| No emoji in Nomad defaults | **Pass** | Unicode + common-glyph scan = 0 hits |
| No grey image-stage fills | **Pass** | Grey-fill pattern scan empty; media `background: transparent` |
| Glocket files not modified in Nomad commits | **Pass** | No `trade/**/glocket*` in `c3f2ed6^..HEAD` |
| Template section set complete | **Pass** | `nomad-product`, 3× `nomad-feature-split`, `nomad-story-banner`, `nomad-cross-sell`, `nomad-specs`, `nomad-faq`, `nomad-reviews` |
| Overview accordion item gaps | **Pass** (code fix) | Same wrapper+:last-child bug as Task 7; spacing moved to `.nomad-product__accordion-item:not(:last-child)` |

---

## Merchant handoff steps

1. Upload `trade-nomad-theme.zip` (or sync `trade/`) to the Shopify theme library.
2. In **Products**, open **POV Glocket** and set **Theme template** to `nomad`.
3. Open **Customize theme** on the Nomad product page; set section/card color schemes and replace placeholder copy/images.
4. Toggle **Variant style** between Pills (default) and Tiles; assign variant media for tiles/swatches.
5. Confirm **Buy it now** appears (store dynamic checkout + section setting).
6. Spot-check mobile ≤749px and desktop against the Nomad Goods reference.

### Theme editor quick map

| Area | Section type | What to edit |
|---|---|---|
| Buy box + overview + near cross-sell | `nomad-product` | Gallery, social proof, pills/tiles, ATC, Buy it now, overview accordion, also-bought |
| Feature story cards | `nomad-feature-split` (×3) | Heading, body, media, CTA, media fit/side |
| Story banner | `nomad-story-banner` | Limited-edition / story copy + media |
| Keep Exploring | `nomad-cross-sell` | Product cards, links, images |
| Specs / More info | `nomad-specs` | Accordion rows |
| FAQ | `nomad-faq` | Q&A accordion rows |
| Reviews | `nomad-reviews` | Editable review cards (no app) |

### Pre-launch reminders

- Replace all placeholder copy before publishing.
- Confirm variant images for every sellable option when using tiles/swatches.
- Header and footer are out of scope; verify they still render as expected on the Nomad PDP.
- Do not edit `glocket-*` assets or `product.glocket.json` when iterating on Nomad.
