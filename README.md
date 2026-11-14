# ui-sdk-angular

> Built on `@ui-sdk/core` **0.1.0-beta.1** (Angular 22)

This package adds Angular support for [ui-sdk](https://github.com/vercel-labs/ui). You get all the behavior: keyboard navigation, focus handling, dismissal, popups and the right ARIA attributes. You keep full control of your markup and styles. Every part of a component is a directive that you put on your own elements, so there are no wrapper components and nothing to override.

This isn't an official part of ui-sdk. To make sure it behaves the same way, it runs upstream's own Playwright specs, unchanged, against Angular versions of upstream's test fixtures.

## Getting started

> The package is experimental, so expect breaking changes until 1.0.

Install the package together with `@ui-sdk/core`, which holds the actual behavior:

```bash
npm install ui-sdk-angular @ui-sdk/core
```

You need Angular 22 or newer. There's nothing to configure and no providers to add. Import the directives you need into your standalone component and put them on your elements:

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
} from "ui-sdk-angular"

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

A few things still have known issues:

- **Pagination:** page links that use `routerLink` don't change the page yet.
- **Tree:** two accessibility checks fail while branches are expanded.
- **Command:** with a long virtualized list, holding an arrow key can lose the highlight.
- **Tabs:** memory grows when tabs are mounted and unmounted many times.

## Develop

Start with [AGENTS.md](AGENTS.md), then read [contributing/design.md](contributing/design.md) and [contributing/code.md](contributing/code.md).

```bash
git submodule update --init
npm install
npm start               # the demo
npm run test:upstream   # upstream's specs against the playground
npm run lint
```
