# POV Glocket Vinia-Style PDP — Visual QA and Merchant Handoff

**Template:** `trade/templates/product.glocket.json`  
**Reference layout:** https://vinia.com/products/vinia-coffee  
**Live product:** https://pov-worldwide.com/products/pov-glocket  
**Implementation plan:** `docs/superpowers/plans/2026-08-03-glocket-vinia-style-pdp.md`

Use this checklist after uploading the `trade` theme to Shopify and assigning the `glocket` template to POV Glocket. Compare desktop against the Vinia reference; verify mobile on a real device or responsive preview.

---

## Desktop vs Vinia

- [ ] Two-column buy box proportions match the reference (gallery left, buy box right; balanced width and vertical alignment)
- [ ] Vertical thumbnails appear to the left of the main image
- [ ] Buy box block order: social proof, title, badge, bullets, variant tiles, quantity, price, Add to cart / Buy it now, trust row
- [ ] Accordions sit under the gallery with chevron indicators
- [ ] Below-fold section order and spacing rhythm match the plan:
  - [ ] Rich text / media
  - [ ] Benefits grid
  - [ ] Stats / proof
  - [ ] Feature split (1)
  - [ ] Process steps
  - [ ] Feature split (2)
  - [ ] Icon row
  - [ ] Comparison / proof
  - [ ] Guarantee
  - [ ] CTA banner (1)
  - [ ] Reviews
  - [ ] FAQ
  - [ ] CTA banner (2)

---

## Mobile

- [ ] Single-column stack order: gallery, buy box / info stack, then accordions
- [ ] Horizontal thumbnail strip (not vertical)
- [ ] Touch-friendly variant tiles and accordion targets (adequate tap size and spacing)
- [ ] Add to cart and Buy it now buttons are full width

---

## Functional

- [ ] Variant tile selection updates displayed price and Add to cart button state (enabled/disabled, sold-out messaging)
- [ ] Selecting a variant with assigned media updates the gallery main image
- [ ] Add to cart adds the correct variant and quantity to the cart
- [ ] Buy it now appears when dynamic checkout is enabled in section settings
- [ ] Theme editor exposes all blocks and settings for buy box and below-fold sections (copy, images, links, padding)
- [ ] No emojis in default placeholder copy or shipped UI chrome
- [ ] Other product templates still use `main-product` (no regression on non-Glocket products)

---

## Merchant handoff steps

1. Upload or sync the `trade` theme to the Shopify store (Theme library or CLI `shopify theme push`).
2. In **Products**, open **POV Glocket** and set **Theme template** to `glocket`.
3. Open **Customize theme**, navigate to the Glocket product page, and fill in images and copy for each section and block.
4. In **Products > POV Glocket > Variants**, assign images to each variant so the tile picker displays the correct swatches.

### Theme editor quick map

| Area | Section type | What to edit |
|---|---|---|
| Buy box | `glocket-product` | Social proof, badge, bullets, accordions, trust row, variant heading, CTA labels, dynamic checkout toggle |
| Story | `glocket-rich-text-media` | Heading, body, image, CTA |
| Benefits | `glocket-benefits-grid` | Card headings, text, icons |
| Stats | `glocket-stats-proof` | Stat values, labels, CTA |
| Features | `glocket-feature-split` | Split copy, image, CTA (two instances on template) |
| Process | `glocket-process-steps` | Step titles and descriptions |
| Icons | `glocket-icon-row` | Icon labels and cert copy |
| Proof | `glocket-comparison-or-proof` | Claim / comparison content |
| Guarantee | `glocket-guarantee` | Guarantee heading and body |
| CTAs | `glocket-cta-banner` | Banner text and button (two instances) |
| Reviews | `glocket-reviews` | Review blocks or placeholder copy |
| FAQ | `glocket-faq` | Question / answer pairs |

### Pre-launch reminders

- Replace all placeholder copy before publishing.
- Confirm variant images are assigned for every sellable option.
- Test checkout flow once on desktop and once on mobile after content is loaded.
- Header, announcement bar, and footer are unchanged; verify they still render as expected on the Glocket PDP.
