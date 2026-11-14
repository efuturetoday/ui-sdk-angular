import { Component, DestroyRef, inject, signal } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  UiCheckbox,
  UiCheckboxIndicator,
  UiCheckboxInput,
} from "ngx-ui-sdk/checkbox"
import {
  createToaster,
  UiToast,
  UiToastDescription,
  UiToastList,
  UiToastRegion,
  UiToastTitle,
} from "ngx-ui-sdk/toast"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    UiCheckbox,
    UiCheckboxIndicator,
    UiCheckboxInput,
    UiToast,
    UiToastDescription,
    UiToastList,
    UiToastRegion,
    UiToastTitle,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <label data-slot="label">
          <button
            uiCheckbox
            #box="uiCheckbox"
            [checked]="expanded()"
            (checkedChange)="expanded.set($event === true)"
          >
            <span *uiCheckboxIndicator>
              <svg lucideCheck aria-hidden="true"></svg>
            </span>
          </button>
          <input [uiCheckboxInput]="box" />
          Always expanded
        </label>
      </div>
      <button (click)="add()">Add Toast</button>
      <section
        uiToastRegion
        #region="uiToastRegion"
        [toaster]="toast"
        [maxVisible]="4"
        [expanded]="expanded()"
      >
        <ol uiToastList>
          @for (item of region.state().toasts; track item.toast.id) {
            <li [uiToast]="item.toast">
              <div data-slot="stack">
                <div *uiToastTitle></div>
                <div *uiToastDescription></div>
              </div>
            </li>
          }
        </ol>
      </section>
    </div>
  `,
})
class Example {
  protected readonly notifications: { title: string; description?: string }[] =
    [
      { title: "Event created", description: "Friday, June 12 at 10:00 AM" },
      { title: "Message sent" },
      {
        title: "Hollis Grant joined",
        description: "They can now edit the Launch plan and see its comments.",
      },
      { title: "Changes saved" },
      { title: "Invoice sent", description: "Inès Moreau · $240.00" },
      {
        title: "Photos uploaded",
        description: "12 photos added to Summer trip",
      },
    ]
  protected readonly toast = createToaster()
  protected readonly expanded = signal(false)
  #count = 0

  constructor() {
    inject(DestroyRef).onDestroy(() => this.toast.dismiss())
  }

  protected add() {
    this.toast(this.notifications[this.#count++ % this.notifications.length])
  }
}

export { Example }
