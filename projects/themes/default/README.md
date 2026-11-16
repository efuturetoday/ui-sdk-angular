# @ngx-ui-sdk/theme-default

The default theme for [`@ngx-ui-sdk/core`](https://www.npmjs.com/package/@ngx-ui-sdk/core). It's ui-sdk's example styling, the same as in the [demo](https://efuturetoday.github.io/ui-sdk-angular/), with light and dark colors.

## Install

```bash
npm install @ngx-ui-sdk/theme-default
```

Add it to `angular.json`:

```json
"styles": ["@ngx-ui-sdk/theme-default/all.css", "src/styles.css"]
```

The theme only styles elements inside `data-ui-theme`. To style the whole app, add it to `<body>`:

```html
<body data-ui-theme></body>
```

Colors use `light-dark()`, so set `color-scheme` on your page. The font comes from your app.

Besides the components' parts, the theme styles plain elements inside `data-ui-theme`, like lists, tables, native inputs and buttons. A button of your own that shouldn't look like one, like an icon in a table cell, gets a `data-slot` of its own, such as `data-slot="cell-action"`.

Components take their container's width. The fixed widths in the demo, like a 20rem field, are the demo's, not the theme's.

## Load less CSS

Import `tokens.css`, `base.css` and only the components you use instead of `all.css`:

```css
@import "@ngx-ui-sdk/theme-default/tokens.css";
@import "@ngx-ui-sdk/theme-default/base.css";
@import "@ngx-ui-sdk/theme-default/dialog.css";
```

## Customize

The look comes from CSS variables in `tokens.css`, all starting with `--ui-`. Override them on the same element:

```css
[data-ui-theme] {
  --ui-primary: #2563eb;
  --ui-radius: 4px;
}
```

| Variables                                           | What they are                                                             |
| --------------------------------------------------- | ------------------------------------------------------------------------- |
| `--ui-background`, `--ui-foreground`                | The page and its text                                                     |
| `--ui-surface-1`, `-2`, `-3`                        | Controls, popups, and surfaces on popups                                  |
| `--ui-muted`, `--ui-muted-foreground`               | Quiet surfaces and secondary text                                         |
| `--ui-primary`, `--ui-ring`                         | The highlight color and the focus ring                                    |
| `--ui-input`, `--ui-border`, `--ui-border-disabled` | Borders                                                                   |
| `--ui-destructive`, `--ui-destructive-muted`        | Errors                                                                    |
| `--ui-overlay`                                      | Behind modal dialogs and drawers                                          |
| `--ui-shadow-sm`, `-md`, `-lg`, `-float`, `-drop`   | Shadows. `--ui-shadow-color-*` are their colors                           |
| `--ui-radius`                                       | Corners. `--ui-radius-row`, `-control`, `-surface` and `-popup` follow it |
| `--ui-space-*`, `--ui-size-*`, `--ui-text-*`        | Spacing, heights and font sizes                                           |
| `--ui-leading`, `--ui-font-mono`, `--ui-duration`   | Line height, code font, transitions                                       |

To use the variables in styles of your own without the theme's styles, put `data-ui-tokens` on an element instead of `data-ui-theme`.

The tokens are also in `tokens/`, in the [Design Tokens](https://www.designtokens.org/) format. Tools like Figma plugins and Style Dictionary read them. `base.json` holds what both color modes share, and `light.json` and `dark.json` hold the colors.

A few variables follow from the tokens: `--ui-ring` from `--ui-primary`, `--ui-destructive-muted` from `--ui-destructive`, and the radii from `--ui-radius`. Override the token and they change with it.

## Source

Generated from ui-sdk's [example styles](https://github.com/vercel-labs/ui/tree/main/examples) (Apache-2.0).
