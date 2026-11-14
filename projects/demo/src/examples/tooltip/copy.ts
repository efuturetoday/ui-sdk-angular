import { Component, signal } from "@angular/core"
import { LucideCheck, LucideCopy } from "@lucide/angular"
import { UiTooltip, UiTooltipContent, UiTooltipTrigger } from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideCopy,
    UiTooltip,
    UiTooltipContent,
    UiTooltipTrigger,
  ],
  template: `
    <div data-slot="row">
      <code>{{ command }}</code>
      <ng-container
        uiTooltip
        [closeOnPress]="false"
        (openChangeComplete)="!$event && copied.set(false)"
      >
        <button
          uiTooltipTrigger
          [attr.aria-label]="copied() ? 'Copied' : 'Copy'"
          (click)="copy()"
        >
          @if (copied()) {
            <svg lucideCheck aria-hidden="true"></svg>
          } @else {
            <svg lucideCopy aria-hidden="true"></svg>
          }
        </button>
        <div *uiTooltipContent>{{ copied() ? "Copied" : "Copy" }}</div>
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly command = "npm install ngx-ui-sdk"
  protected readonly copied = signal(false)

  protected copy() {
    navigator.clipboard?.writeText(this.command).catch(() => {})
    this.copied.set(true)
  }
}

export { Example }
