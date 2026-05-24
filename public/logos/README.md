# /public/logos — repeat-customer brand marks

LogoStrip.tsx auto-detects SVG files in this directory and renders them
instead of the typography fallback. Files must match the exact `key` used
in `components/LogoStrip.tsx`:

| key     | filename       | shows as                       |
|---------|----------------|--------------------------------|
| msc     | `msc.svg`      | MEDLOG (MSC Group)             |
| tp      | `tp.svg`       | TP Offshore                    |
| polaris | `polaris.svg`  | Polaris Denizcilik             |
| bright  | `bright.svg`   | Bright Denizcilik              |
| cebi    | `cebi.svg`     | Çebi Kaptan                    |
| nord    | `nord.svg`     | Reederei NORD                  |

## Format

- **Type:** SVG, optimized (run through SVGO or similar)
- **Aspect ratio:** roughly 3.3:1 to fit the 140×42 render box
- **viewBox:** include it; do not hard-code px on the root `<svg>`
- **fill:** use `currentColor` where possible so the greyscale/hover
  recolour from the parent stays consistent
- **Background:** transparent, no rectangle behind the mark

## Permission tracking

Each logo dropped here must be cleared with the fleet first (per decision P5
in DECISIONS.md). Keep a one-line permission note in a `permissions.md`
alongside this README — date, contact, scope of use. Do not add a logo here
without that note.

## Falling back to typography

If a file is missing or removed, LogoStrip silently falls back to the
styled wordmark for that customer — no broken-image state. Useful when a
fleet renames or rebrands and the new SVG is not in yet.
