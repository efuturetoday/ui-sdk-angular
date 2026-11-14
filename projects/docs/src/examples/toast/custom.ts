import { UiText } from "@ngx-ui-sdk/core"
import { Component, DestroyRef, inject } from "@angular/core"
import { LucideX } from "@lucide/angular"
import {
  createToaster,
  UiToast,
  UiToastAction,
  UiToastClose,
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
    LucideX,
    UiToast,
    UiToastAction,
    UiToastClose,
    UiToastDescription,
    UiToastList,
    UiToastRegion,
    UiToastTitle,
  ],
  template: `
    <button (click)="newMessage()">New Message</button>
    <section
      uiToastRegion
      #region="uiToastRegion"
      [toaster]="toast"
      aria-label="Messages"
    >
      <ol uiToastList>
        @for (item of region.state().toasts; track item.toast.id) {
          <li
            [uiToast]="item.toast"
            #entry="uiToast"
            [attr.inert]="
              entry.state().leaving ||
              (!entry.state().expanded && entry.state().index > 0)
                ? ''
                : null
            "
          >
            <span data-slot="media">{{ initials(item.toast.data) }}</span>
            <div data-slot="stack">
              <div *uiToastTitle uiText></div>
              <div *uiToastDescription uiText></div>
            </div>
            <button *uiToastAction data-variant="solid" uiText></button>
            <button uiToastClose aria-label="Close">
              <svg lucideX aria-hidden="true"></svg>
            </button>
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

  protected initials(data: unknown) {
    return (data as { initials: string }).initials
  }

  protected newMessage() {
    this.toast({
      title: "Hollis Grant",
      description: "Can you review the draft?",
      data: { initials: "HG" },
      action: {
        label: "Reply",
        onAction: () => this.log("Replying to Hollis Grant"),
      },
    })
  }
}

export { Example }
