# Escape artists: recreating an Economist chart with D3 and React

A recreation of The Economist's bar chart *"Escape artists"* (number of laboratory-acquired infections, 1970–2021), built with React and D3 scales.

**Live demo:** https://araupontones.github.io/scales/

This is my exercise for the **Scales** module of the *D3 & React* course taught by Yan Holtz.

## What the exercise covers

- **Scales:** `scaleLinear` maps infection counts to bar lengths, and `scaleBand` gives each pathogen a row of equal height with padding between bars.
- **Gridlines and tick labels:** values come from `xScale.ticks()`. The gridlines are drawn before the bars so they sit behind them, because SVG has no `z-index`.
- **Margin convention:** the SVG is a panel with margins. The plot is drawn inside a `<g transform="translate(...)">`, which leaves room above it for the title, subtitle and tick labels and below it for the source caption.
- **Economist styling:**
  - the red rule and tag at the top
  - the title, subtitle and source line
  - bar labels placed inside long bars and outside short ones
- **Fitting the screen:** the chart is drawn once at a fixed design size and scaled as a whole with `viewBox`, like a photo, so it keeps its look on mobile.

## Project structure

| File | Contents |
| --- | --- |
| `src/App.jsx` | The chart: scales, gridlines, bars, labels and the panel layout |
| `src/style.jsx` | Chart styles: font sizes, colours, and the size of the red rule and tag |
| `src/data.js` | The data: infections per pathogen |
| `src/App.css`, `src/index.css` | Page layout and chart scaling |

## Run it locally

```bash
npm install
npm run dev
```

## Deployment

Every push to `main` builds the app and publishes it to GitHub Pages using the workflow in `.github/workflows/deploy.yml`.

## Credits

- Original chart: The Economist. Sources: Laboratory-Acquired Infection Database; American Biological Safety Association.
- Course: *D3 & React*, by Yan Holtz.
