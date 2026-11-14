# ngx-ui-sdk

> Built on `@ui-sdk/core` **0.1.0-beta.1** (Angular 22)

**[Live demo and examples →](https://efuturetoday.github.io/ui-sdk-angular/)** · [ui-sdk documentation](https://ui-sdk.dev/docs) · [npm](https://www.npmjs.com/package/@ngx-ui-sdk/core)

This package adds Angular support for [ui-sdk](https://github.com/vercel-labs/ui). You get all the behavior: keyboard navigation, focus handling, dismissal, popups and the right ARIA attributes. You keep full control of your markup and styles. Every part of a component is a directive that you put on your own elements, so there are no wrapper components and nothing to override.

## Getting started

> The package is experimental, so expect breaking changes until 1.0.

Install the package together with `@ui-sdk/core`, which holds the actual behavior:

```bash
npm install @ngx-ui-sdk/core @ui-sdk/core
```

You need Angular 22 or newer. There's nothing to configure and no providers to add. Each component has its own entry point, like `@ngx-ui-sdk/core/dialog`, so your app only bundles what it imports. Import the directives you need into your standalone component and put them on your elements:

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

## Styling

Everything is unstyled. The directives set behavior and ARIA, never a color or a margin, so what you see is your own CSS. They give you three things to style with:

- **Data attributes** for state, like `data-open`, `data-highlighted`, `data-selected` and `data-disabled`, and `data-starting-style` and `data-ending-style` while a part animates in and out.
- **`data-slot`** on every part, like `data-slot="dialog-content"`, so one stylesheet can style a component wherever it's used.
- **CSS variables** for what only the browser knows, like `--anchor-width` and `--available-height` on a popup.

```css
[data-slot="dialog-content"] {
  transition: opacity 150ms;
}

[data-slot="dialog-content"][data-starting-style],
[data-slot="dialog-content"][data-ending-style] {
  opacity: 0;
}
```

The look of the [demo](https://efuturetoday.github.io/ui-sdk-angular/) is ui-sdk's own example styling, unchanged: [`tokens.css`](https://github.com/vercel-labs/ui/blob/main/examples/styles/tokens.css), [`base.css`](https://github.com/vercel-labs/ui/blob/main/examples/styles/base.css) and one stylesheet per component in [`examples/components`](https://github.com/vercel-labs/ui/tree/main/examples/components). It's a good starting point: copy the files for the components you use and change them from there.

The components, their parts and options work the same way as in every other ui-sdk framework. The [ui-sdk documentation](https://ui-sdk.dev/docs) explains them in detail. Its [Vue guide](https://ui-sdk.dev/docs/vue) is the closest to how things work here.

## Status

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

## Tested with upstream's own specs

This isn't an official part of ui-sdk, so it has to prove that it behaves exactly like the official adapters. It does that with ui-sdk's own end-to-end suite: **268 Playwright spec files and more than 4,000 tests**, run unchanged against Angular versions of upstream's test fixtures, on every push. They're the same specs React, Vue, Svelte, Solid and web components pass, and they cover:

- **Behavior:** keyboard, pointer and touch, focus, dismissal, forms and controllers.
- **Accessibility:** axe audits, screen reader announcements and WAI-ARIA patterns.
- **Right to left**, for every component.
- **Memory:** open, close, mount and unmount hundreds of times, and nothing is left behind.

Upstream's server rendering specs and kitchen sinks don't run yet, since they need a server-rendered playground. On top of that, the demo's examples have end-to-end tests of their own, including real iOS taps in WebKit, and the adapter's wiring has unit tests in Vitest.

## Develop

Start with [AGENTS.md](AGENTS.md), then read [contributing/design.md](contributing/design.md) and [contributing/code.md](contributing/code.md).

```bash
git submodule update --init
npm install
npm start               # the demo
npm run test:upstream   # upstream's specs against the playground
npm run lint
```
