import { Component } from "@angular/core"
import { CodeBlock } from "./code"

@Component({
  selector: "app-guide",
  imports: [CodeBlock],
  styleUrl: "./guide.css",
  template: `
    <p>
      Dialogs, popovers, menus, tooltips and hover cards are popups. So are the
      lists of selects and comboboxes. Their content is a structural part with a
      <code>*</code>
      . It only exists while the popup is open.
    </p>

    <section id="place" data-title="Place It">
      <h3>Place It</h3>
      <p>
        A popup sits next to its trigger. It moves to the other side when there
        is not enough room. You choose the position on its content.
      </p>
      <app-code [code]="place" />
      <p>
        The options are
        <code>side</code>
        ,
        <code>align</code>
        ,
        <code>sideOffset</code>
        ,
        <code>alignOffset</code>
        and
        <code>collisionPadding</code>
        . With
        <code>anchor</code>
        , it sits next to another element.
      </p>
    </section>

    <section id="container" data-title="Render It Elsewhere">
      <h3>Render It Elsewhere</h3>
      <p>
        A popup renders where you write it. The browser shows it in the top
        layer above the page, so you don't need a portal. To render it into
        another element, pass a
        <code>container</code>
        .
      </p>
      <app-code [code]="container" />
    </section>

    <section id="sheet" data-title="Sheets on Phones">
      <h3>Sheets on Phones</h3>
      <p>
        On small touch screens, menus, selects, comboboxes, popovers and dialogs
        open as a sheet from the bottom. People can swipe it away. This is
        <code>presentation="auto"</code>
        , the default. Use
        <code>"sheet"</code>
        to always show a sheet. Use the popup's own kind, like
        <code>"popover"</code>
        , to never show one.
      </p>
      <app-code [code]="sheet" />
    </section>

    <section id="overlays" data-title="Toasts and Confirmations">
      <h3>Toasts and Confirmations</h3>
      <p>
        <code>toast()</code>
        and
        <code>confirm()</code>
        work from anywhere, like a service. Add the overlay host once, at the
        end of your app's template. It renders them.
      </p>
      <app-code [code]="overlays" />
      <p>
        You style them like other parts, through the
        <code>data-slot</code>
        of the toast and the alert dialog.
      </p>
    </section>
  `,
})
class Page {
  protected readonly place = `<div *uiPopoverContent="let state; side: 'top'; align: 'start'; sideOffset: 8">
  …
</div>`
  protected readonly container = `<div *uiPopoverContent="container: dialogElement">…</div>`
  protected readonly sheet = `<ng-container uiPopover presentation="sheet">…</ng-container>`
  protected readonly overlays = `import { UiOverlayHost } from "@ngx-ui-sdk/core/overlays"
import { toast } from "@ngx-ui-sdk/core/toast"
import { confirm } from "@ngx-ui-sdk/core/alert-dialog"

// app.ts: imports: [UiOverlayHost]
// template: <ui-overlay-host />

toast({ title: "Saved" })

if (await confirm({ title: "Delete this project?" })) {
  …
}`
}

export { Page }
