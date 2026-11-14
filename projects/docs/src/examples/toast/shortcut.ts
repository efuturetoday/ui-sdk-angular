import { UiText } from "@ngx-ui-sdk/core"
import { Component, DestroyRef, inject } from "@angular/core"
import {
  createToaster,
  UiToast,
  UiToastAction,
  UiToastList,
  UiToastRegion,
  UiToastTitle,
} from "@ngx-ui-sdk/core/toast"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiText,
    UiToast,
    UiToastAction,
    UiToastList,
    UiToastRegion,
    UiToastTitle,
  ],
  template: `
    <button (click)="sendMessage()">Send Message</button>
    <section
      uiToastRegion
      #region="uiToastRegion"
      [toaster]="toast"
      shortcut="alt+t"
      aria-label="Alerts">
      <ol uiToastList>
        @for (item of region.state().toasts; track item.toast.id) {
          <li [uiToast]="item.toast">
            <div *uiToastTitle uiText></div>
            <button *uiToastAction data-variant="solid" uiText></button>
          </li>
        }
      </ol>
    </section>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly toast = createToaster({ duration: 10000 })

  constructor() {
    inject(DestroyRef).onDestroy(() => this.toast.dismiss())
  }

  protected sendMessage() {
    this.toast("Message sent", {
      action: { label: "Undo", onAction: () => this.log("Message unsent") },
    })
  }
}

export { Example }
