import { Component } from "@angular/core"
import { CodeBlock } from "./code"

@Component({
  selector: "app-guide",
  imports: [CodeBlock],
  styleUrl: "./guide.css",
  template: `
    <p>
      Components keep their own state unless you bind it. Their outputs tell you
      about every change either way.
    </p>

    <section id="default" data-title="Set the Starting Value">
      <h3>Set the Starting Value</h3>
      <p>Use a default input to choose where it starts:</p>
      <app-code [code]="defaultPressed" />
      <p>
        The input depends on the component: <code>defaultPressed</code>,
        <code>defaultChecked</code>, <code>defaultOpen</code> or
        <code>defaultValue</code>.
      </p>
    </section>

    <section id="control" data-title="Control the Value">
      <h3>Control the Value</h3>
      <p>Bind it two ways when your component needs the current value:</p>
      <app-code [code]="twoWay" />
      <p>
        The main value depends on the component: <code>checked</code> for a
        checkbox, <code>open</code> for a popover, <code>value</code> for a
        select. Bind others the same way, like <code>[(open)]</code> on a select
        or <code>[(query)]</code> on a combobox. If you bind only
        <code>[pressed]</code>, update it yourself in
        <code>(pressedChange)</code>, or it stays where it is.
      </p>
    </section>

    <section id="forms" data-title="Forms">
      <h3>Forms</h3>
      <p>
        Form controls like Checkbox, Switch, Radio, Select, Combobox and Toggle
        work with <code>ngModel</code>, <code>formControl</code> and
        <code>formControlName</code>. Import the component's value accessor too:
      </p>
      <app-code [code]="forms" />
      <p>
        They also render a hidden native input, so a plain
        <code>&lt;form&gt;</code> submits their value.
      </p>
    </section>

    <section id="respond" data-title="Respond to a Change">
      <h3>Respond to a Change</h3>
      <p>
        Each value has an output that runs before it changes, like
        <code>(beforePressedChange)</code>. It gets the requested value and
        <code>details</code>:
      </p>
      <table>
        <thead>
          <tr>
            <th>Detail</th>
            <th>What it tells you</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>reason</code></td>
            <td>
              What asked for the change, like <code>press</code> or
              <code>outside-press</code>.
            </td>
          </tr>
          <tr>
            <td><code>event</code></td>
            <td>The DOM event, if there is one.</td>
          </tr>
          <tr>
            <td><code>source</code></td>
            <td>
              <code>keyboard</code>, <code>mouse</code>, <code>touch</code>,
              <code>pen</code>, <code>virtual</code>,
              <code>programmatic</code> or <code>agent</code>.
            </td>
          </tr>
          <tr>
            <td><code>cancel()</code></td>
            <td>Stops the change.</td>
          </tr>
        </tbody>
      </table>
      <p>For example, keep a popover open when someone clicks outside it:</p>
      <app-code [code]="keepOpen" />
      <p>
        The Done button still closes it. Add <code>debug</code> to a root to log
        every change while you work.
      </p>
    </section>

    <section id="values" data-title="Empty and Multiple Values">
      <h3>Empty and Multiple Values</h3>
      <p>
        Select, Tabs and Radio Group give <code>null</code> when nothing is
        selected. A multiple Select or Combobox uses an array. Accordion and
        Toggle Group always use arrays.
      </p>
    </section>

    <section id="controllers" data-title="Controllers">
      <h3>Controllers</h3>
      <p>
        To change a component from outside its parts, create a controller and
        pass it in:
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
  protected readonly forms = `import { FormsModule } from "@angular/forms"
import { UiCheckbox, UiCheckboxValueAccessor } from "@ngx-ui-sdk/core/checkbox"

// imports: [FormsModule, UiCheckbox, UiCheckboxValueAccessor]
<button uiCheckbox [(ngModel)]="terms">Accept the terms</button>`
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
