import { Component, signal } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  UiCheckbox,
  UiCheckboxInput,
  UiCheckboxIndicator,
} from "@ngx-ui-sdk/core/checkbox"
import {
  type DialogOpenChangeDetails,
  UiDialog,
  UiDialogBackdrop,
  UiDialogClose,
  UiDialogContent,
  UiDialogDescription,
  UiDialogTitle,
  UiDialogTrigger,
} from "@ngx-ui-sdk/core/dialog"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    UiCheckbox,
    UiCheckboxInput,
    UiCheckboxIndicator,
    UiDialog,
    UiDialogBackdrop,
    UiDialogClose,
    UiDialogContent,
    UiDialogDescription,
    UiDialogTitle,
    UiDialogTrigger,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <label data-slot="label">
          <button
            uiCheckbox
            #box="uiCheckbox"
            [checked]="open()"
            (checkedChange)="open.set($event === true)"
          >
            <span *uiCheckboxIndicator>
              <svg lucideCheck aria-hidden="true"></svg>
            </span>
          </button>
          <input [uiCheckboxInput]="box" />
          Open
        </label>
      </div>
      <ng-container
        uiDialog
        [(open)]="open"
        (beforeOpenChange)="onOpenChange($event.open, $event.details)"
        (openChangeComplete)="
          log($event ? 'Finished opening' : 'Finished closing')
        "
      >
        <button uiDialogTrigger>Notification Settings</button>
        <div *uiDialogBackdrop></div>
        <div *uiDialogContent>
          <div data-slot="stack">
            <h2 uiDialogTitle>Notification settings</h2>
            <p uiDialogDescription>Choose what we email you about.</p>
          </div>
          <div data-slot="stack">
            @for (topic of topics; track topic.label) {
              <label data-slot="label">
                <button
                  uiCheckbox
                  #box2="uiCheckbox"
                  [defaultChecked]="topic.checked"
                >
                  <span *uiCheckboxIndicator>
                    <svg lucideCheck aria-hidden="true"></svg>
                  </span>
                </button>
                <input [uiCheckboxInput]="box2" />
                {{ topic.label }}
              </label>
            }
          </div>
          <div data-slot="row">
            <button uiDialogClose data-variant="solid">Done</button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly topics = [
    { label: "Product updates", checked: true },
    { label: "Security alerts", checked: true },
    { label: "Weekly digest", checked: false },
  ]
  protected readonly log = injectLog()
  protected readonly open = signal(false)

  protected onOpenChange(next: boolean, details: DialogOpenChangeDetails) {
    this.log(`${next ? "Opened" : "Closed"} (${details.reason})`)
  }
}

export { Example }
