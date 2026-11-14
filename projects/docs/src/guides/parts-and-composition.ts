import { Component } from "@angular/core"
import { CodeBlock } from "./code"

@Component({
  selector: "app-guide",
  imports: [CodeBlock],
  styleUrl: "./guide.css",
  template: `
    <p>
      Most components have several parts. A popover has a root that holds the
      state. It has a trigger that opens it and content that it shows. Each part
      is a directive on an element you write.
    </p>

    <section id="put-together" data-title="Put Parts Together">
      <h3>Put Parts Together</h3>
      <p>Import the parts and nest them like on the component's page.</p>
      <app-code [code]="popover" />
      <p>
        <code>uiPopover</code>
        has no element of its own. It goes on an
        <code>ng-container</code>
        . Other roots, like
        <code>uiTabs</code>
        , sit on an element. Parts find their root through dependency injection.
        So your own components can sit between them.
      </p>
    </section>

    <section id="present" data-title="Parts That Come and Go">
      <h3>Parts That Come and Go</h3>
      <p>
        Some parts only exist while they are visible. Examples are the content
        of a popover or the backdrop of a dialog. They are structural directives
        and start with a
        <code>*</code>
        . Angular creates them when they open. It removes them after they close
        and after their exit animation. Use
        <code>keepMounted: true</code>
        to keep one in the page.
      </p>
      <app-code [code]="keepMounted" />
    </section>

    <section id="element" data-title="Choose the Element">
      <h3>Choose the Element</h3>
      <p>A part works on any element. In this example every tab is a link.</p>
      <app-code [code]="links" />
      <p>
        Your own event handlers run first. Call
        <code>event.preventDefault()</code>
        to skip the part's handler. Keep the roles, ids and ARIA attributes that
        the part sets. Your own
        <code>aria-label</code>
        ,
        <code>title</code>
        or
        <code>autocomplete</code>
        replaces the part's value.
      </p>
    </section>

    <section id="state" data-title="Read the State">
      <h3>Read the State</h3>
      <p>
        Every part has a
        <code>state</code>
        signal. You reach it through the export name of the directive.
      </p>
      <app-code [code]="exportAs" />
      <p>A structural part passes its state to its template as a signal.</p>
      <app-code [code]="letState" />
      <p>
        Keep the accessible name stable when the content changes. In the
        example,
        <code>aria-label="Mute"</code>
        names the toggle and
        <code>aria-pressed</code>
        tells if it is on.
      </p>
    </section>

    <section id="text" data-title="Show the Part's Text">
      <h3>Show the Part's Text</h3>
      <p>
        Some parts have their own text. Examples are the selected label of a
        select, the value of a meter or the title of a toast. Add
        <code>uiText</code>
        to show it.
      </p>
      <app-code [code]="uiText" />
      <p>
        Without
        <code>uiText</code>
        , the content belongs to you. Nothing writes into it. You can build your
        own text from the part's state.
      </p>
      <app-code [code]="ownText" />
      <p>
        On the item text of a command or a select,
        <code>uiText</code>
        also marks the search match with
        <code>&lt;mark&gt;</code>
        .
      </p>
    </section>

    <section id="name" data-title="Name the Control">
      <h3>Name the Control</h3>
      <p>
        Use the label or title part of the component, like
        <code>uiFieldLabel</code>
        or
        <code>uiDialogTitle</code>
        . A control without visible text needs an
        <code>aria-label</code>
        .
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
  protected readonly uiText = `<span uiSelectValue uiText></span>
<span uiMeterValue uiText></span>
<div *uiToastTitle uiText></div>`
  protected readonly ownText = `<span uiSelectValue #value="uiSelectValue">
  {{ value.state().placeholder ? "Pick a role" : value.state().label }}
</span>`
  protected readonly letState = `<div *uiPopoverContent="let state">
  Opens on the {{ state().side }} side.
</div>`
}

export { Page }
