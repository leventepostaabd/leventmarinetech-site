# /public/services — service deck images

Vertical brochure-style images shown in the right column of `/services` and
`/service-wizard`. Captions sit on the artwork itself; the page only adds
a small headline + kicker overlay at the bottom.

## Required files (filename ↔ service slug)

| Filename | Service slug | Card label (EN) |
|---|---|---|
| `bwts.webp` | `bwts` | BWTS |
| `condition.webp` | `engine-room-alarm` | Engine Room Alarm / Monitoring |
| `cranes.webp` | `crane-deck-machinery` | Crane & Deck Machinery |
| `firealarm.webp` | `fire-alarm` | Fire Alarm & Detection |
| `gensyc.webp` | `generator` | Generator (Diesel · Shaft · Emergency · AVR) |
| `motor.webp` | `ac-dc-motor` | AC/DC Motor |
| `plc.webp` | `plc-automation` | PLC & Automation / IAS |
| `thermal.webp` | `switchboard` | Switchboard (MSB / ESB / PMS) |

If a filename in this list is missing, the corresponding slug is skipped from
the deck. The mapping lives in:

- `app/services/page.tsx` → `SERVICE_IMAGE`
- `app/service-wizard/page.tsx` → `SERVICE_IMAGE`

Keep the two maps in sync when adding new slugs.

## Format

- **Aspect:** vertical / portrait (~3:4 to 9:16); fills `~30%` of viewport
  width on `lg+` screens.
- **Size:** target 1080×1920 max, 200–500 KB per file after compression.
  PNG is fine for brochure art; convert to optimized PNG via `pngquant`
  (e.g. `pngquant --quality=70-85 *.webp`) or WebP at quality 80 if file
  size is an issue.
- **Safe zone:** keep critical text within the centre 80% — the bottom
  is overlaid by a navy→transparent gradient + headline.
- **No transparent background** — the deck cycles on a solid navy fallback;
  transparency leaks the fallback through.

## Legacy horizontal photos

The old landscape JPGs (`01-generator.jpg`, `04-fire-alarm.jpg`, etc.) are
no longer referenced by the deck mapping. They can stay for any future
reuse (service detail page hero, blog post artwork) or be removed once the
vertical set is confirmed.
