import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { UiListbox, UiListboxItem, UiListboxItemIndicator } from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [LucideCheck, UiListbox, UiListboxItem, UiListboxItemIndicator],
  template: `
    <div
      uiListbox
      defaultValue="utc9"
      aria-label="Time zone"
      (highlight)="onHighlight($event.value, $event.details)"
    >
      @for (zone of timezones; track zone.value; let index = $index) {
        <div uiListboxItem [value]="zone.value" [index]="index">
          {{ zone.label }}
          <span *uiListboxItemIndicator
            ><svg lucideCheck aria-hidden="true"></svg
          ></span>
        </div>
      }
    </div>
  `,
})
class Example {
  protected readonly timezones = Array.from({ length: 27 }, (_, index) => {
    const offset = index - 12
    const label = `UTC${offset < 0 ? "−" : "+"}${String(Math.abs(offset)).padStart(2, "0")}:00`
    return { value: `utc${offset}`, label }
  })
  protected readonly log = injectLog()

  protected onHighlight(value: unknown, details: { index: number }) {
    if (value) {
      this.log(
        `Focused ${this.timezones[details.index]!.label} (${details.index + 1} of ${this.timezones.length})`
      )
    }
  }
}

export { Example }
