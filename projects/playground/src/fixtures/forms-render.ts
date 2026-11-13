import { Component, signal } from "@angular/core"
import {
  UiCheckbox,
  UiCheckboxIndicator,
  UiCheckboxInput,
  UiField,
  UiFieldControl,
  UiFieldLabel,
  UiRadio,
  UiRadioGroup,
  UiRadioInput,
  UiSwitch,
  UiSwitchInput,
  UiSwitchThumb,
} from "ui-sdk-angular"

@Component({
  selector: "app-fixture",
  imports: [
    UiCheckbox,
    UiCheckboxIndicator,
    UiCheckboxInput,
  UiCheckboxInput,
    UiField,
    UiFieldControl,
    UiFieldLabel,
    UiRadio,
    UiRadioGroup,
    UiRadioInput,
  UiRadioInput,
    UiSwitch,
    UiSwitchInput,
    UiSwitchThumb,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form class="form" aria-label="Rendering" (submit)="$event.preventDefault()">
        <label>
          <span uiCheckbox #span="uiCheckbox" class="checkbox" (checkedChange)="action.set('span:' + $event)">
            <span *uiCheckboxIndicator class="checkbox-indicator"></span>
          </span>
          <input [uiCheckboxInput]="span" />
          Rendered as a span
        </label>
        <button uiCheckbox #fn="uiCheckbox" aria-label="Render function">{{ fn.state().checked ? "On" : "Off" }}</button>
        <input [uiCheckboxInput]="fn" />
        <button uiCheckbox #cls="uiCheckbox" aria-label="Class from state">
          <span hidden [attr.data-class]="cls.state().checked"></span>
        </button>
        <input [uiCheckboxInput]="cls" />
        <label>
          <button uiSwitch #toggle="uiSwitch" class="switch" defaultChecked>
            <span uiSwitchThumb #thumb="uiSwitchThumb">{{ thumb.state().checked ? "I" : "O" }}</span>
          </button>
          <input [uiSwitchInput]="toggle" />
          Labelled thumb
        </label>
        <div uiRadioGroup aria-label="Size" defaultValue="small" (valueChange)="action.set('size:' + $event)">
          @for (value of ["small", "large"]; track value) {
            <label>
              <span uiRadio #radio="uiRadio" class="radio" [value]="value"></span>
              <input [uiRadioInput]="radio" />
              {{ value === "small" ? "Small" : "Large" }}
            </label>
          }
        </div>
        <div uiField>
          <label uiFieldLabel>Nickname</label>
          <input uiFieldControl [value]="nickname()" (input)="onNickname($event)" />
        </div>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly action = signal("")
  protected readonly nickname = signal("")

  protected onNickname(event: Event) {
    this.nickname.set((event.target as HTMLInputElement).value)
  }
}

export { Fixture }
