# /public/supply — supply deck images

Vertical brochure-style images shown in the right column of `/supply`.
Mirrors the `/services` deck pattern; same `<ServiceImageDeck>` component
with `hrefPrefix="/supply/category/"` and `readMoreLabel="Browse category"`.

## Required files (filename ↔ supply category slug)

| Filename | Category slug | Card label (EN) |
|---|---|---|
| `cableconnectsupply.png` | `cables-glands` | Cables & Glands |
| `cranesupply.png` | `deck-mechanical` | Crane & Deck Hardware |
| `enginesupply.png` | `engine-room-consumables` | Engine Room Consumables |
| `mainswitchboardcomp.png` | `msb-components` | MSB / ESB Components |
| `motorsupply.png` | `motors-drives` | Motors & Drives (VFD) |
| `navisupply.png` | `radar-navigation` | Radar & Bridge Navigation |
| `plcsupply.png` | `automation-plc` | PLC & Automation |
| `sensorsupply.png` | `marine-sensors` | Marine Sensors & Transmitters |

Mapping + labels live in `app/supply/page.tsx` → `SUPPLY_DECK`.

## Format

Same as `/public/services/README.md` — portrait, ~1080×1920, 200–500 KB
PNG. Captions on the artwork itself; deck overlays a navy→transparent
gradient and a one-line headline+kicker at the bottom.
