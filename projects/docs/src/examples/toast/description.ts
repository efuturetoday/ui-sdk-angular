import { UiText } from "@ngx-ui-sdk/core"
import { Component, DestroyRef, inject } from "@angular/core"
import {
  createToaster,
  UiToast,
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
    UiToastDescription,
    UiToastList,
    UiToastRegion,
    UiToastTitle,
  ],
  template: `
    <button
      (click)="
        toast({
          title: 'Event has been created',
          description: 'Monday, January 3rd at 6:00pm',
        })
      ">
      Show toast
    </button>
    <section uiToastRegion #region="uiToastRegion" [toaster]="toast">
      <ol uiToastList>
        @for (item of region.state().toasts; track item.toast.id) {
          <li [uiToast]="item.toast">
            <div data-slot="stack">
              <div *uiToastTitle uiText></div>
              <div *uiToastDescription uiText></div>
            </div>
          </li>
        }
      </ol>
    </section>
  `,
})
class Example {
  protected readonly toast = createToaster()
}

export { Example }
