import { Component } from "@angular/core"
import { LucideArrowDownToLine, LucideLoaderCircle } from "@lucide/angular"
import { UiButton } from "ui-sdk-angular"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

@Component({
  selector: "app-example",
  imports: [LucideArrowDownToLine, LucideLoaderCircle, UiButton],
  template: `
    <button uiButton [action]="save" pendingAnnouncement="Saving">
      <svg lucideArrowDownToLine data-show="idle" aria-hidden="true"></svg>
      <svg
        lucideLoaderCircle
        data-show="pending"
        data-slot="spinner"
        aria-hidden="true"
      ></svg>
      Save
    </button>
  `,
})
class Example {
  protected readonly save = () => wait(1500)
}

export { Example }
