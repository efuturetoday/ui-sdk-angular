# ngx-ui-sdk

Angular directives for [ui-sdk](https://github.com/vercel-labs/ui). Built on `@ui-sdk/core` 0.1.0-beta.1, for Angular 22.

[Demo](https://efuturetoday.github.io/ui-sdk-angular/) · [Documentation](https://ui-sdk.dev/docs) · [npm](https://www.npmjs.com/package/@ngx-ui-sdk/core)

ui-sdk handles keyboard navigation, focus, dismissal, popups and ARIA. This package brings that to Angular. Each part of a component is a directive on your own element. You write the markup and the styles.

The package is experimental. Expect breaking changes until 1.0.

## Getting started

Install it with `@ui-sdk/core`:

```bash
npm install @ngx-ui-sdk/core @ui-sdk/core
```

Each component has its own entry point, like `@ngx-ui-sdk/core/dialog`, so your app only bundles what it imports. Import the directives into a standalone component:

```ts
import { Component, signal } from "@angular/core"
import {
  UiDialog,
  UiDialogBackdrop,
  UiDialogClose,
  UiDialogContent,
  UiDialogDescription,
  UiDialogTitle,
  UiDialogTrigger,
} from "@ngx-ui-sdk/core/dialog"

@Component({
  selector: "app-edit-profile",
  imports: [
    UiDialog,
    UiDialogBackdrop,
    UiDialogClose,
    UiDialogContent,
    UiDialogDescription,
    UiDialogTitle,
    UiDialogTrigger,
  ],
  template: `
    <ng-container uiDialog [(open)]="open">
      <button uiDialogTrigger>Edit profile</button>
      <div *uiDialogBackdrop class="backdrop"></div>
      <div *uiDialogContent class="dialog">
        <h2 uiDialogTitle>Edit profile</h2>
        <p uiDialogDescription>Make changes to your profile.</p>
        <button uiDialogClose>Close</button>
      </div>
    </ng-container>
  `,
})
export class EditProfile {
  readonly open = signal(false)
}
```

No providers or configuration needed. Parts with text of their own, like a select's value, show it when you add `uiText`: `<span uiSelectValue uiText></span>`. The [ui-sdk documentation](https://ui-sdk.dev/docs) describes every component, its parts and options. The names are the same here: `DialogTrigger` is `uiDialogTrigger`.

## Styling

The directives add no styles. Style the parts with:

- **State attributes**: `data-open`, `data-highlighted`, `data-selected`, `data-disabled`, and `data-starting-style` and `data-ending-style` for animations.
- **`data-slot`** on every part, like `data-slot="dialog-content"`.
- **CSS variables** on popups, like `--anchor-width` and `--available-height`.

```css
[data-slot="dialog-content"] {
  transition: opacity 150ms;
}

[data-slot="dialog-content"][data-starting-style],
[data-slot="dialog-content"][data-ending-style] {
  opacity: 0;
}
```

### Default theme

The demo uses ui-sdk's example styles. They're available as a separate package:

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

To load less CSS, import `tokens.css`, `base.css` and only the components you use instead of `all.css`. Colors, radii and sizes are CSS variables you can override.

## Components

| Component         | Supported |
| ----------------- | :-------: |
| Accordion         |    ✅     |
| Alert Dialog      |    ✅     |
| Autocomplete      |    ✅     |
| Avatar            |    ✅     |
| Button            |    ✅     |
| Calendar          |    ✅     |
| Carousel          |    ✅     |
| Checkbox          |    ✅     |
| Collapsible       |    ✅     |
| Color Picker      |    ✅     |
| Combobox          |    ✅     |
| Command           |    ✅     |
| Date Input        |    ✅     |
| Date Picker       |    ✅     |
| Dialog            |    ✅     |
| Drawer            |    ✅     |
| Field             |    ✅     |
| File Input        |    ✅     |
| Hover Card        |    ✅     |
| Image             |    ✅     |
| Image Cropper     |    ✅     |
| Input             |    ✅     |
| Label             |    ✅     |
| Listbox           |    ✅     |
| Menu              |    ✅     |
| Menubar           |    ✅     |
| Meter             |    ✅     |
| Navigation Menu   |    ✅     |
| Number Input      |    ✅     |
| OTP Input         |    ✅     |
| Pagination        |    ✅     |
| Password Input    |    ✅     |
| Popover           |    ✅     |
| Preferences       |    ✅     |
| Progress          |    ✅     |
| Radio             |    ✅     |
| Rating            |    ✅     |
| Resizable         |    ✅     |
| Scroll Area       |    ✅     |
| Segmented Control |    ✅     |
| Segmented Input   |    ✅     |
| Select            |    ✅     |
| Separator         |    ✅     |
| Shortcuts         |    ✅     |
| Slider            |    ✅     |
| Switch            |    ✅     |
| Tabs              |    ✅     |
| Textarea          |    ✅     |
| Time Input        |    ✅     |
| Timeline          |    ✅     |
| Toast             |    ✅     |
| Toggle            |    ✅     |
| Token Input       |    ✅     |
| Toolbar           |    ✅     |
| Tooltip           |    ✅     |
| Tree              |    ✅     |
| Trigger Menu      |    ✅     |
| Waterfall         |    ✅     |
| Agent tools       |    ❌     |

## Testing

This is not an official ui-sdk package. It runs ui-sdk's own end-to-end tests, unchanged: 268 Playwright spec files with more than 4,000 tests, the same ones the React, Vue, Svelte, Solid and web component adapters pass. They cover:

- keyboard, pointer and touch input, focus, dismissal, forms and controllers
- axe audits, screen reader announcements and WAI-ARIA patterns
- right-to-left layouts
- memory leaks across hundreds of mounts

ui-sdk's server rendering tests don't run yet. The demo examples and the adapter internals have their own tests. Everything runs in CI on every push.

## Source

[github.com/efuturetoday/ui-sdk-angular](https://github.com/efuturetoday/ui-sdk-angular)
