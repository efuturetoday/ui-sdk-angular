# @ngx-ui-sdk/theme-default

ui-sdk's own example look for [`@ngx-ui-sdk/core`](https://www.npmjs.com/package/@ngx-ui-sdk/core), as plain CSS. It's the look of the [demo](https://efuturetoday.github.io/ui-sdk-angular/): neutral, light and dark, and a good starting point for your own.

## Use it

```bash
npm install @ngx-ui-sdk/theme-default
```

Add the stylesheet in `angular.json`:

```json
"styles": ["@ngx-ui-sdk/theme-default/all.css", "src/styles.css"]
```

or import only what you use, starting with the tokens and the base:

```css
@import "@ngx-ui-sdk/theme-default/tokens.css";
@import "@ngx-ui-sdk/theme-default/base.css";
@import "@ngx-ui-sdk/theme-default/dialog.css";
@import "@ngx-ui-sdk/theme-default/select.css";
```

The styles apply inside an element with `data-ui-theme`, so they never reach the rest of your app. Put it on `<body>` to theme everything, or on one part of the page:

```html
<body data-ui-theme></body>
```

The colors use `light-dark()`, so set `color-scheme` to `light`, `dark` or `light dark`. The font is your app's.

## Change it

Every color, radius and size is a CSS variable in `tokens.css`, like `--ink`, `--paper`, `--accent` and `--radius`. Override them on the same element:

```css
[data-ui-theme] {
  --accent: #2563eb;
}
```

## Where it comes from

The files are generated from the example styles in [ui-sdk](https://github.com/vercel-labs/ui/tree/main/examples), Apache-2.0, scoped to `[data-ui-theme]` instead of ui-sdk's demo frame, without the rules for single examples.
