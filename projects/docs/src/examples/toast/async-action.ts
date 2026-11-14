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
import { injectLog } from "../../shared/log"

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
    <button (click)="deleteFile()">Delete File</button>
    <section uiToastRegion #region="uiToastRegion" [toaster]="toast">
      <ol uiToastList>
        @for (item of region.state().toasts; track item.toast.id) {
          <li [uiToast]="item.toast">
            <div data-slot="stack">
              <div *uiToastTitle uiText></div>
              <div *uiToastDescription uiText></div>
            </div>
            <button *uiToastAction="let state" data-variant="solid">
              {{
                state().pending
                  ? "Restoring…"
                  : state().error
                    ? "Retry"
                    : "Undo"
              }}
            </button>
          </li>
        }
      </ol>
    </section>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly toast = createToaster({ duration: 6000 })

  constructor() {
    inject(DestroyRef).onDestroy(() => this.toast.dismiss())
  }

  protected restore() {
    return new Promise((resolve) => setTimeout(resolve, 1500))
  }

  protected deleteFile() {
    this.toast("File deleted", {
      description: "Q3 report.pdf",
      action: {
        label: "Undo",
        onAction: async () => {
          await this.restore()
          this.log("Q3 report.pdf restored")
        },
      },
    })
  }
}

export { Example }
