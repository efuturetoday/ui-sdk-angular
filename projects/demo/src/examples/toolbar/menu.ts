import { Component } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import {
  UiMenu,
  UiMenuContent,
  UiMenuItem,
  UiMenuTrigger,
  UiToolbar,
  UiToolbarButton,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideChevronDown,
    UiMenu,
    UiMenuContent,
    UiMenuItem,
    UiMenuTrigger,
    UiToolbar,
    UiToolbarButton,
  ],
  template: `
    <div uiToolbar aria-label="Document">
      <button uiToolbarButton (click)="log('Saved')">Save</button>
      <ng-container uiMenu [onAction]="shared">
        <button uiMenuTrigger uiToolbarButton>
          Share
          <svg lucideChevronDown aria-hidden="true"></svg>
        </button>
        <div *uiMenuContent="let state">
          <div uiMenuItem value="email">Email</div>
          <div uiMenuItem value="link">Copy Link</div>
        </div>
      </ng-container>
      <button uiToolbarButton (click)="log('Printed')">Print</button>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly shared = (value: string) => this.log(`Shared by ${value}`)
}

export { Example }
