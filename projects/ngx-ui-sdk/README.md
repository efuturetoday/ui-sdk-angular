# ngx-ui-sdk

> Built on `@ui-sdk/core` **0.1.0-beta.1** (Angular 22)

**[Live demo and examples →](https://efuturetoday.github.io/ui-sdk-angular/)** · [ui-sdk documentation](https://ui-sdk.dev/docs) · [npm](https://www.npmjs.com/package/ngx-ui-sdk)

This package adds Angular support for [ui-sdk](https://github.com/vercel-labs/ui). You get all the behavior: keyboard navigation, focus handling, dismissal, popups and the right ARIA attributes. You keep full control of your markup and styles. Every part of a component is a directive that you put on your own elements, so there are no wrapper components and nothing to override.

## Tested with upstream's own specs

This isn't an official part of ui-sdk, so it has to prove that it behaves exactly like the official adapters. It does that with ui-sdk's own end-to-end suite: **268 Playwright spec files and more than 4,000 tests**, run unchanged against Angular versions of upstream's test fixtures, on every push. They're the same specs React, Vue, Svelte, Solid and web components pass, and they cover:

- **Behavior:** keyboard, pointer and touch, focus, dismissal, forms and controllers.
- **Accessibility:** axe audits, screen reader announcements and WAI-ARIA patterns.
- **Right to left**, for every component.
- **Memory:** open, close, mount and unmount hundreds of times, and nothing is left behind.

Upstream's server rendering specs and kitchen sinks don't run yet, since they need a server-rendered playground. On top of that, the demo's examples have end-to-end tests of their own, including real iOS taps in WebKit, and the adapter's wiring has unit tests in Vitest.

## Getting started

> The package is experimental, so expect breaking changes until 1.0.

Install the package together with `@ui-sdk/core`, which holds the actual behavior:

```bash
npm install ngx-ui-sdk @ui-sdk/core
```

You need Angular 22 or newer. There's nothing to configure and no providers to add. Each component has its own entry point, like `ngx-ui-sdk/dialog`, so your app only bundles what it imports. Import the directives you need into your standalone component and put them on your elements:

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
} from "ngx-ui-sdk/dialog"

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

The directives don't add any styles. Style the elements however you like, and use the `data-*` attributes they set, like `data-open`, for states and animations.

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

## Source

The code, the demo and how to contribute are on [GitHub](https://github.com/efuturetoday/ui-sdk-angular). There's also a [live demo](https://efuturetoday.github.io/ui-sdk-angular/).
