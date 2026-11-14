import { Component } from "@angular/core"
import { CodeBlock } from "./code"

@Component({
  selector: "app-guide",
  imports: [CodeBlock],
  styleUrl: "./guide.css",
  template: `
    <p>
      Every control can take part in a form. Give it a
      <code>name</code>
      and the form submits its value. The controls also work with Angular's
      <code>ngModel</code>
      and reactive forms.
    </p>

    <section id="submit" data-title="Submit a Value">
      <h3>Submit a Value</h3>
      <app-code [code]="submit" />
      <p>
        When the box is checked, the form sends
        <code>updates=yes</code>
        . The Reset button brings back the default.
      </p>
      <p>
        A checkbox needs a hidden native input right after it. The input is what
        the form submits. Switches and radios need one too. Selects, comboboxes
        and the other lists create theirs on their own.
      </p>
    </section>

    <section id="reset" data-title="Reset a Bound Value">
      <h3>Reset a Bound Value</h3>
      <p>
        A reset also changes a bound value. Keep
        <code>[(checked)]</code>
        in place and your signal stays in sync. The reason of the change is
        <code>"reset"</code>
        .
      </p>
      <app-code [code]="reset" />
      <p>
        The reset goes back to
        <code>defaultChecked</code>
        . If the value is already the default, nothing is emitted.
      </p>
    </section>

    <section id="field" data-title="Label and Validate a Field">
      <h3>Label and Validate a Field</h3>
      <p>
        Wrap a control in
        <code>uiField</code>
        to connect it to a label, a description and an error message. The
        control gets its
        <code>name</code>
        and
        <code>disabled</code>
        from the field.
      </p>
      <app-code [code]="field" />
      <p>
        The error appears when the value is invalid. With
        <code>uiText</code>
        it shows the browser's message. You can also write your own message for
        each problem:
      </p>
      <app-code [code]="match" />
      <p>
        <code>required</code>
        ,
        <code>disabled</code>
        ,
        <code>readOnly</code>
        and
        <code>form</code>
        work like on native inputs. A disabled control is not submitted. A
        read-only control can still be focused and is submitted.
      </p>
    </section>

    <section id="server" data-title="Errors From Your Server">
      <h3>Errors From Your Server</h3>
      <p>
        The browser checks rules like
        <code>required</code>
        before the form is sent. Your server can still reject a value. In that
        case, set
        <code>invalid</code>
        on the field and show the server's message. Clear it when the user edits
        the value.
      </p>
      <app-code [code]="server" />
    </section>

    <section id="angular" data-title="Angular's Forms">
      <h3>Angular's Forms</h3>
      <p>
        These controls work with
        <code>ngModel</code>
        ,
        <code>formControl</code>
        and
        <code>formControlName</code>
        : Checkbox, Switch, Radio, Select, Combobox, Autocomplete, Listbox,
        Segmented Control, Toggle, Date Input and Time Input. Import the
        control's value accessor next to it.
      </p>
      <app-code [code]="angular" />
      <p>
        When you disable the form control, the control is disabled too. When the
        user leaves it, it is marked as touched.
      </p>
    </section>
  `,
})
class Page {
  protected readonly submit = `<form action="/preferences" method="post">
  <label>
    <button uiCheckbox #updates="uiCheckbox" name="updates" value="yes" defaultChecked></button>
    <input [uiCheckboxInput]="updates" />
    Email me updates
  </label>
  <button type="submit">Save</button>
  <button type="reset">Reset</button>
</form>`
  protected readonly reset = `<form>
  <label>
    <button
      uiCheckbox
      #updates="uiCheckbox"
      name="updates"
      defaultChecked
      [(checked)]="checked"
      (beforeCheckedChange)="reason.set($event.details.reason)"
    ></button>
    <input [uiCheckboxInput]="updates" />
    Email me updates
  </label>
  <button type="reset">Reset</button>
  <output>{{ reason() }}</output>
</form>`
  protected readonly field = `<div uiField name="email">
  <label uiFieldLabel>Email</label>
  <input uiInput type="email" required />
  <p uiFieldDescription>We'll only use it for receipts.</p>
  <p *uiFieldError uiText></p>
</div>`
  protected readonly match = `<p *uiFieldError="let state; match: 'valueMissing'">Enter your email.</p>
<p *uiFieldError="let state; match: 'typeMismatch'">That isn't an email.</p>`
  protected readonly server = `<form (submit)="save($event)">
  <div uiField name="email" [invalid]="error() ? true : undefined">
    <label uiFieldLabel>Email</label>
    <input uiInput type="email" required (input)="error.set('')" />
    <p *uiFieldError="let state; match: true">{{ error() }}</p>
  </div>
  <button type="submit">Save</button>
</form>

readonly error = signal("")

async save(event: SubmitEvent) {
  event.preventDefault()
  const body = new FormData(event.target as HTMLFormElement)
  const response = await fetch("/api/preferences", { method: "POST", body })
  this.error.set(response.ok ? "" : "That email is already taken.")
}`
  protected readonly angular = `import { FormsModule } from "@angular/forms"
import { UiSwitch, UiSwitchValueAccessor } from "@ngx-ui-sdk/core/switch"

@Component({
  imports: [FormsModule, UiSwitch, UiSwitchValueAccessor],
  template: \`
    <button uiSwitch [(ngModel)]="notifications" aria-label="Notifications"></button>
  \`,
})
class Settings {
  notifications = true
}`
}

export { Page }
