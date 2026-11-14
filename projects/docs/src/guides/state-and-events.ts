import { Component } from "@angular/core"
import { CodeBlock } from "./code"

@Component({
  selector: "app-guide",
  imports: [CodeBlock],
  styleUrl: "./guide.css",
  template: `
    <p>
      A component keeps its own state until you bind it. Its outputs tell you
      about every change.
    </p>

    <section id="default" data-title="Set the Starting Value">
      <h3>Set the Starting Value</h3>
      <p>A default input sets where it starts.</p>
      <app-code [code]="defaultPressed" />
      <p>
        The name depends on the component:
        <code>defaultPressed</code>
        ,
        <code>defaultChecked</code>
        ,
        <code>defaultOpen</code>
        or
        <code>defaultValue</code>
        .
      </p>
    </section>

    <section id="control" data-title="Control the Value">
      <h3>Control the Value</h3>
      <p>Use two-way binding when your component needs the current value.</p>
      <app-code [code]="twoWay" />
      <p>
        The main value depends on the component. It is
        <code>checked</code>
        for a checkbox,
        <code>open</code>
        for a popover and
        <code>value</code>
        for a select. Other values bind the same way, for example
        <code>[(open)]</code>
        on a select or
        <code>[(query)]</code>
        on a combobox.
      </p>
      <p>
        If you only bind
        <code>[pressed]</code>
        , you must update it yourself in
        <code>(pressedChange)</code>
        . Otherwise it doesn't change. For
        <code>ngModel</code>
        and reactive forms, see
        <a href="?doc=forms">Forms</a>
        .
      </p>
    </section>

    <section id="respond" data-title="Respond to a Change">
      <h3>Respond to a Change</h3>
      <p>
        Every value has an output that runs before the change, for example
        <code>(beforePressedChange)</code>
        . It gets the new value and
        <code>details</code>
        .
      </p>
      <table>
        <thead>
          <tr>
            <th>Detail</th>
            <th>Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>reason</code></td>
            <td>
              What caused the change, like
              <code>press</code>
              or
              <code>outside-press</code>
              .
            </td>
          </tr>
          <tr>
            <td><code>event</code></td>
            <td>The DOM event, if there is one.</td>
          </tr>
          <tr>
            <td><code>source</code></td>
            <td>
              <code>keyboard</code>
              ,
              <code>mouse</code>
              ,
              <code>touch</code>
              ,
              <code>pen</code>
              ,
              <code>virtual</code>
              ,
              <code>programmatic</code>
              or
              <code>agent</code>
              .
            </td>
          </tr>
          <tr>
            <td><code>cancel()</code></td>
            <td>Stops the change.</td>
          </tr>
        </tbody>
      </table>
      <p>This popover stays open when someone clicks outside of it:</p>
      <app-code [code]="keepOpen" />
      <p>
        The Done button still closes it. Add
        <code>debug</code>
        to a root to log every change in the console.
      </p>
    </section>

    <section id="values" data-title="Empty and Multiple Values">
      <h3>Empty and Multiple Values</h3>
      <p>
        Select, Tabs and Radio Group use
        <code>null</code>
        when nothing is selected. A select or combobox with
        <code>multiple</code>
        uses an array. Accordion and Toggle Group always use arrays.
      </p>
    </section>

    <section id="controllers" data-title="Controllers">
      <h3>Controllers</h3>
      <p>
        A controller changes a component from outside its parts. Create one and
        pass it in.
      </p>
      <app-code [code]="controller" />
    </section>
  `,
})
class Page {
  protected readonly defaultPressed = `<button uiToggle defaultPressed>Bold</button>`
  protected readonly twoWay = `import { Component, signal } from "@angular/core"
import { UiToggle } from "@ngx-ui-sdk/core/toggle"

@Component({
  selector: "app-bold",
  imports: [UiToggle],
  template: \`
    <button uiToggle [(pressed)]="bold">Bold</button>
    <output>{{ bold() ? "On" : "Off" }}</output>
  \`,
})
class Bold {
  readonly bold = signal(false)
}

export { Bold }`
  protected readonly keepOpen = `<ng-container uiPopover (beforeOpenChange)="keepOpen($event)">
  <button uiPopoverTrigger>Details</button>
  <div *uiPopoverContent>
    <h2 uiPopoverTitle>Project Details</h2>
    <button uiPopoverClose>Done</button>
  </div>
</ng-container>

keepOpen({ open, details }: { open: boolean; details: PopoverOpenChangeDetails }) {
  if (!open && details.reason === "outside-press") {
    details.cancel()
  }
}`
  protected readonly controller = `import { createPopoverController } from "@ngx-ui-sdk/core/popover"

readonly help = createPopoverController()

// <ng-container uiPopover [controller]="help">…</ng-container>
// <button (click)="help.open()">Show help</button>`
}

export { Page }
