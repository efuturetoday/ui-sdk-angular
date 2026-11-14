import { Component, signal } from "@angular/core"
import { LucideLoaderCircle } from "@lucide/angular"
import {
  createSwitchController,
  type SwitchCheckedChangeReason,
  UiSwitch,
  UiSwitchInput,
  UiSwitchThumb,
} from "ngx-ui-sdk/switch"
import { injectLog } from "../../shared/log"

const save = (_checked: boolean) =>
  new Promise((resolve) => setTimeout(resolve, 800))

@Component({
  selector: "app-example",
  imports: [UiSwitchInput, LucideLoaderCircle, UiSwitch, UiSwitchThumb],
  template: `
    <label data-slot="label">
      Automatic backups
      <button
        uiSwitch
        #toggle="uiSwitch"
        [controller]="backups"
        [attr.aria-busy]="saving()"
        (beforeCheckedChange)="onCheckedChange($event.checked, $event.details)"
      >
        <span uiSwitchThumb>
          @if (saving()) {
            <svg
              lucideLoaderCircle
              data-slot="spinner"
              aria-hidden="true"
            ></svg>
          }
        </span>
      </button>
      <input [uiSwitchInput]="toggle" />
    </label>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly backups = createSwitchController()
  protected readonly saving = signal(false)

  protected onCheckedChange(
    next: boolean,
    details: { reason: SwitchCheckedChangeReason; cancel: () => void }
  ) {
    if (details.reason === "imperative") {
      return
    }
    details.cancel()
    if (this.saving()) {
      return
    }
    this.saving.set(true)
    this.log("Saving…")
    save(next).then(() => {
      this.backups.setChecked(next, { reason: "imperative" })
      this.saving.set(false)
      this.log(`Saved: ${next ? "on" : "off"}`)
    })
  }
}

export { Example }
