import { Component, DestroyRef, inject } from "@angular/core"
import {
  createToaster,
  UiToast,
  UiToastAction,
  UiToastDescription,
  UiToastList,
  UiToastRegion,
  UiToastTitle,
} from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiToast,
    UiToastAction,
    UiToastDescription,
    UiToastList,
    UiToastRegion,
    UiToastTitle,
  ],
  template: `
    <button (click)="createEvent()">Create Event</button>
    <section uiToastRegion #region="uiToastRegion" [toaster]="toast">
      <ol uiToastList>
        @for (item of region.state().toasts; track item.toast.id) {
          <li [uiToast]="item.toast">
            <div data-slot="stack">
              <div *uiToastTitle></div>
              <div *uiToastDescription></div>
            </div>
            <button *uiToastAction data-variant="solid"></button>
          </li>
        }
      </ol>
    </section>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly toast = createToaster()

  constructor() {
    inject(DestroyRef).onDestroy(() => this.toast.dismiss())
  }

  protected createEvent() {
    this.toast("Event created", {
      description: "Friday, June 12 at 10:00 AM",
      action: { label: "Undo", onAction: () => this.log("Event removed") },
    })
  }
}

export { Example }
