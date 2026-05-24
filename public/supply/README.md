# /public/supply — supply deck images

Vertical brochure-style images shown in the right column of `/supply`.
Mirrors the `/services` deck pattern; same `<ServiceImageDeck>` component
with `hrefPrefix="/supply/category/"` and `readMoreLabel="Browse category"`.

## Required files (filename ↔ supply category slug)

| Filename | Category slug | Card label (EN) |
|---|---|---|
| `cableconnectsupply.webp` | `cables-glands` | Cables & Glands |
| `cranesupply.webp` | `deck-mechanical` | Crane & Deck Hardware |
| `enginesupply.webp` | `engine-room-consumables` | Engine Room Consumables |
| `mainswitchboardcomp.webp` | `msb-components` | MSB / ESB Components |
| `motorsupply.webp` | `motors-drives` | Motors & Drives (VFD) |
| `navisupply.webp` | `radar-navigation` | Radar & Bridge Navigation |
| `plcsupply.webp` | `automation-plc` | PLC & Automation |
| `sensorsupply.webp` | `marine-sensors` | Marine Sensors & Transmitters |

Mapping + labels live in `app/supply/page.tsx` → `SUPPLY_DECK`.

## Format

Same as `/public/services/README.md` — portrait, ~1080×1920, 200–500 KB
PNG. Captions on the artwork itself; deck overlays a navy→transparent
gradient and a one-line headline+kicker at the bottom.
