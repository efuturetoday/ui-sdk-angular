import { Component, signal } from "@angular/core"
import {
  createRadioGroupController,
  UiField,
  UiFieldLabel,
  UiRadio,
  UiRadioInput,
  UiRadioGroup,
  UiRadioIndicator,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiRadioInput,
    UiField,
    UiFieldLabel,
    UiRadio,
    UiRadioGroup,
    UiRadioIndicator,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="planGroup.setValue('team')">
          Choose Team
        </button>
      </div>
      <div uiField>
        <label uiFieldLabel>Plan</label>
        <div
          uiRadioGroup
          [(value)]="value"
          [controller]="planGroup"
          (beforeValueChange)="onValueChange($event.value, $event.details)"
        >
          @for (plan of plans; track plan.value) {
            <label data-slot="label">
              <button uiRadio #radio="uiRadio" [value]="plan.value">
                <span *uiRadioIndicator></span>
              </button>
              <input [uiRadioInput]="radio" />
              {{ plan.label }}
            </label>
          }
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly plans = [
    { value: "starter", label: "Starter" },
    { value: "pro", label: "Pro" },
    { value: "team", label: "Team" },
  ]
  protected readonly log = injectLog()
  protected readonly planGroup = createRadioGroupController()
  protected readonly value = signal<string | null>("pro")

  protected onValueChange(next: string | null, details: { reason: string }) {
    this.log(
      `${this.plans.find((plan) => plan.value === next)?.label ?? "None"} (${details.reason})`
    )
  }
}

export { Example }
