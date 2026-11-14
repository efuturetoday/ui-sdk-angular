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

## Load less CSS

Import `tokens.css`, `base.css` and only the components you use instead of `all.css`:

```css
@import "@ngx-ui-sdk/theme-default/tokens.css";
@import "@ngx-ui-sdk/theme-default/base.css";
@import "@ngx-ui-sdk/theme-default/dialog.css";
```

## Customize

Colors, radii and sizes are CSS variables in `tokens.css`. Override them on the same element:

```css
[data-ui-theme] {
  --accent: #2563eb;
}
```

## Source

Generated from ui-sdk's [example styles](https://github.com/vercel-labs/ui/tree/main/examples) (Apache-2.0).
