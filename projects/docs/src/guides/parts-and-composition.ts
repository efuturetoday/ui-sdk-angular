import { Component } from "@angular/core"
import { CodeBlock } from "./code"

@Component({
  selector: "app-guide",
  imports: [CodeBlock],
  styleUrl: "./guide.css",
  template: `
    <p>
      A component has several parts. A popover has a root that holds its state,
      a trigger that opens it and the content it shows. Each part is a directive
      on an element you write.
    </p>

    <section id="put-together" data-title="Put Parts Together">
      <h3>Put Parts Together</h3>
      <p>Import the parts and nest them as the component's page shows:</p>
      <app-code [code]="popover" />
      <p>
        <code>uiPopover</code> renders no element of its own, so it goes on an
        <code>ng-container</code>. Other roots, like <code>uiTabs</code>, are an
        element. Parts find their root through Angular's dependency injection,
        so your own components can sit between them.
      </p>
    </section>

    <section id="present" data-title="Parts That Come and Go">
      <h3>Parts That Come and Go</h3>
      <p>
        Parts that only exist while they're shown, like a popover's content or a
        dialog's backdrop, are structural directives, written with a
        <code>*</code>. Angular creates them as they open and removes them once
        they've closed, after any exit animation. Add
        <code>keepMounted: true</code> to keep one in the page while it's
        closed:
      </p>
      <app-code [code]="keepMounted" />
    </section>

    <section id="element" data-title="Choose the Element">
      <h3>Choose the Element</h3>
      <p>
        A part works on whatever element you put it on. Here each tab is a link:
      </p>
      <app-code [code]="links" />
      <p>
        Your own event handlers run first. Call
        <code>event.preventDefault()</code> in one to skip the part's. Keep the
        roles, ids and ARIA state the part sets. A name or typing hint you write
        yourself, like <code>aria-label</code>, <code>title</code> or
        <code>autocomplete</code>, replaces the part's own.
      </p>
    </section>

    <section id="state" data-title="Read the State">
      <h3>Read the State</h3>
      <p>
        Every part has a <code>state</code> signal. Reach it through the
        directive's export name:
      </p>
      <app-code [code]="exportAs" />
      <p>A structural part hands its state to its template, as a signal:</p>
      <app-code [code]="letState" />
      <p>
        Keep the accessible name the same when the content changes. Here,
        <code>aria-label="Mute"</code> names the toggle and
        <code>aria-pressed</code> says whether it's on.
      </p>
    </section>

    <section id="name" data-title="Name the Control">
      <h3>Name the Control</h3>
      <p>
        Use the component's label or title part, like
        <code>uiFieldLabel</code> or <code>uiDialogTitle</code>. Give a control
        without visible text an <code>aria-label</code>.
      </p>
    </section>
  `,
})
class Page {
  protected readonly popover = `import { Component } from "@angular/core"
import {
  UiPopover,
  UiPopoverClose,
  UiPopoverContent,
  UiPopoverTitle,
  UiPopoverTrigger,
} from "@ngx-ui-sdk/core/popover"

@Component({
  selector: "app-details",
  imports: [
    UiPopover,
    UiPopoverClose,
    UiPopoverContent,
    UiPopoverTitle,
    UiPopoverTrigger,
  ],
  template: \`
    <ng-container uiPopover>
      <button uiPopoverTrigger>Details</button>
      <div *uiPopoverContent>
        <h2 uiPopoverTitle>Project Details</h2>
        <p>Last updated today.</p>
        <button uiPopoverClose>Done</button>
      </div>
    </ng-container>
  \`,
})
class Details {}

export { Details }`
  protected readonly keepMounted = `<div *uiPopoverContent="let state; keepMounted: true">…</div>`
  protected readonly links = `<div uiTabs defaultValue="overview">
  <div uiTabsList aria-label="Project">
    <a uiTabsTab value="overview" href="#overview">Overview</a>
    <a uiTabsTab value="activity" href="#activity">Activity</a>
  </div>
  <div *uiTabsPanel="'overview'">…</div>
  <div *uiTabsPanel="'activity'">…</div>
</div>`
  protected readonly exportAs = `<button uiToggle #mute="uiToggle" aria-label="Mute">
  {{ mute.state().pressed ? "Mute on" : "Mute off" }}
</button>`
  protected readonly letState = `<div *uiPopoverContent="let state">
  Opens on the {{ state().side }} side.
</div>`
}

export { Page }
