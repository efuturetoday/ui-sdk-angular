# @ngx-ui-sdk/themes

Themes for [`@ngx-ui-sdk/core`](https://www.npmjs.com/package/@ngx-ui-sdk/core), as plain CSS, with light and dark colors. Try each one in the [demo](https://efuturetoday.github.io/ui-sdk-angular/).

| Theme      | What it looks like                                    | Palettes                          |
| ---------- | ----------------------------------------------------- | --------------------------------- |
| `default`  | ui-sdk's example styling, square as on ui-sdk.dev     |                                   |
| `shadcn`   | shadcn/ui's neutral theme                             |                                   |
| `material` | Material 3, with round buttons and filled text fields | 8, each from a seed color         |
| `daisyui`  | daisyUI 5                                             | 33, one for each of daisyUI's own |

## Install

```bash
npm install @ngx-ui-sdk/themes
```

Add a theme to `angular.json`:

```json
"styles": ["@ngx-ui-sdk/themes/material/all.css", "src/styles.css"]
```

A theme only styles elements inside `data-ui-theme`. To style the whole app, add it to `<body>`:

```html
<body data-ui-theme></body>
```

Colors use `light-dark()`, so set `color-scheme` on your page. The font comes from your app.

Besides the components' parts, a theme styles plain elements inside `data-ui-theme`, like lists, tables, native inputs and buttons. A button of your own that shouldn't look like one, like an icon in a table cell, gets a `data-slot` of its own, such as `data-slot="cell-action"`.

Components take their container's width. The fixed widths in the demo, like a 20rem field, are the demo's, not the theme's.

## Palettes

A palette changes a theme's colors and leaves its shapes. Import it after the theme and name it with `data-ui-palette`, on the theme's element or one around it:

```css
@import "@ngx-ui-sdk/themes/daisyui/all.css";
@import "@ngx-ui-sdk/themes/daisyui/palettes/dracula.css";
```

```html
<body data-ui-theme data-ui-palette="dracula"></body>
```

Material's palettes have light and dark colors. Each of daisyUI's is light or dark only, and sets that color scheme.

## Animation

Popups fade in and out, dialogs slide in, and accordions and collapsibles open and close by their height. Every animation lasts as long as `--ui-duration`, which is 0 for anyone who prefers reduced motion. To turn them off, set it to 0:

```css
[data-ui-theme] {
  --ui-duration: 0ms;
}
```

## Load less CSS

Import `tokens.css`, `base.css` and only the components you use instead of `all.css`:

```css
@import "@ngx-ui-sdk/themes/default/tokens.css";
@import "@ngx-ui-sdk/themes/default/base.css";
@import "@ngx-ui-sdk/themes/default/dialog.css";
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
| `--ui-leading`, `--ui-font-mono`, `--ui-duration`   | Line height, code font, animations                                        |

To use the variables in styles of your own without the theme's styles, put `data-ui-tokens` on an element instead of `data-ui-theme`.

Each theme's tokens are also in its `tokens/`, in the [Design Tokens](https://www.designtokens.org/) format. Tools like Figma plugins and Style Dictionary read them. `base.json` holds what both color modes share, and `light.json` and `dark.json` hold the colors.

A few variables follow from the tokens: `--ui-ring` from `--ui-primary`, `--ui-destructive-muted` from `--ui-destructive`, and the radii from `--ui-radius`. Override the token and they change with it.

## Source

Based on ui-sdk's [example styles](https://github.com/vercel-labs/ui/tree/main/examples) (Apache-2.0). The shadcn theme's colors are shadcn/ui's ([MIT](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md)), the daisyUI theme's are daisyUI's ([MIT](https://github.com/saadeghi/daisyui/blob/master/LICENSE)), and the Material theme's come from Material's [color utilities](https://github.com/material-foundation/material-color-utilities) (Apache-2.0).
