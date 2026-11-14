import { UiText } from "@ngx-ui-sdk/core"
import { Component, DestroyRef, inject } from "@angular/core"
import {
  createToaster,
  UiToast,
  UiToastAction,
  UiToastDescription,
  UiToastList,
  UiToastRegion,
  UiToastTitle,
} from "@ngx-ui-sdk/core/toast"

@Component({
  selector: "app-example",
  imports: [
    UiText,
    UiToast,
    UiToastAction,
    UiToastDescription,
    UiToastList,
    UiToastRegion,
    UiToastTitle,
  ],
  template: `
    <button (click)="sendInvoice()">Send Invoice</button>
    <section uiToastRegion #region="uiToastRegion" [toaster]="toast">
      <ol uiToastList>
        @for (item of region.state().toasts; track item.toast.id) {
          <li [uiToast]="item.toast">
            <div data-slot="stack">
              <div *uiToastTitle uiText></div>
              <div *uiToastDescription uiText></div>
            </div>
            <button *uiToastAction data-variant="solid" uiText></button>
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

  protected sendInvoice() {
    this.toast("Invoice sent", {
      description: "Hollis Grant · $240.00",
      action: { label: "View", href: "#" },
    })
  }
}

export { Example }
