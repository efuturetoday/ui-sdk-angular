import { Component, computed, signal } from "@angular/core"
import {
  UiField,
  UiFieldLabel,
  UiInput,
  UiTooltip,
  UiTooltipContent,
  UiTooltipTrigger,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiField,
    UiFieldLabel,
    UiInput,
    UiTooltip,
    UiTooltipContent,
    UiTooltipTrigger,
  ],
  template: `
    <div data-slot="stack">
      <div uiField>
        <label uiFieldLabel>Post title</label>
        <input uiInput [(value)]="title" />
      </div>
      <ng-container uiTooltip [disabled]="!blocked()">
        <button
          uiTooltipTrigger
          data-variant="solid"
          [attr.aria-disabled]="blocked() || undefined"
          (click)="publish()"
        >
          Publish
        </button>
        <div *uiTooltipContent="let state; side: 'right'">
          Add a title to publish
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly title = signal("")
  protected readonly blocked = computed(() => !this.title().trim())

  protected publish() {
    if (!this.blocked()) {
      this.log(`Published “${this.title().trim()}”`)
    }
  }
}

export { Example }
