# ui-sdk-angular

[ui-sdk](https://github.com/vercel-labs/ui)'s behaviors for Angular: keyboard navigation, focus, dismissal, popups and the ARIA they need, from `@ui-sdk/core`, as directives on your own elements.

```html
<ng-container uiDialog [(open)]="open">
  <button uiDialogTrigger>Edit profile</button>
  <div *uiDialogBackdrop class="backdrop"></div>
  <div *uiDialogContent class="dialog">
    <h2 uiDialogTitle>Edit profile</h2>
    <p uiDialogDescription>Make changes to your profile.</p>
    <button uiDialogClose>Close</button>
  </div>
</ng-container>
```

It isn't part of the ui-sdk repo. Upstream's own Playwright specs run against it, unchanged.

## Status

Experimental. Separator, Collapsible, Dialog, Alert Dialog, Field, Checkbox, Switch and Radio pass upstream's specs for them in Chromium.

## Develop

Read [AGENTS.md](AGENTS.md), then [contributing/design.md](contributing/design.md) and [contributing/code.md](contributing/code.md).

```bash
git submodule update --init
npm install
npm run test:upstream
npm run lint
```
