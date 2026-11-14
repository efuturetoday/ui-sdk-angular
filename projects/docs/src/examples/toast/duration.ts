import { UiText } from "@ngx-ui-sdk/core"
import { Component, DestroyRef, inject } from "@angular/core"
import {
  createToaster,
  UiToast,
  UiToastClose,
  UiToastList,
  UiToastRegion,
  UiToastTitle,
} from "@ngx-ui-sdk/core/toast"

@Component({
  selector: "app-example",
  imports: [
    UiText,
    UiToast,
    UiToastClose,
    UiToastList,
    UiToastRegion,
    UiToastTitle,
  ],
  template: `
    <div data-slot="row">
      <button (click)="toast('Link copied', { duration: 1000 })">
        1 Second
      </button>
      <button (click)="toast('Changes saved')">5 Seconds</button>
      <button (click)="untilDismissed()">Until Dismissed</button>
    </div>
    <section uiToastRegion #region="uiToastRegion" [toaster]="toast">
      <ol uiToastList>
        @for (item of region.state().toasts; track item.toast.id) {
          <li [uiToast]="item.toast">
            <div *uiToastTitle uiText></div>
            @if (item.toast.cancel; as cancel) {
              <button
                uiToastClose
                data-variant="solid"
                [action]="cancel.onCancel">
                {{ cancel.label }}
              </button>
            }
          </li>
        }
      </ol>
    </section>
  `,
})
class Example {
  protected readonly toast = createToaster()

  constructor() {
    inject(DestroyRef).onDestroy(() => this.toast.dismiss())
  }

  protected untilDismissed() {
    this.toast("Your session expires in 5 minutes", {
      duration: Infinity,
      dismissible: false,
      cancel: { label: "Got It" },
    })
  }
}

export { Example }
