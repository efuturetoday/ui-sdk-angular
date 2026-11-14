import { Component, DestroyRef, inject } from "@angular/core"
import { LucideSave } from "@lucide/angular"
import { registerShortcut } from "@ui-sdk/core/shortcuts"
import {
  UiTooltip,
  UiTooltipContent,
  UiTooltipShortcut,
  UiTooltipTrigger,
} from "ngx-ui-sdk/tooltip"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideSave,
    UiTooltip,
    UiTooltipContent,
    UiTooltipShortcut,
    UiTooltipTrigger,
  ],
  template: `
    <div data-slot="row">
      <ng-container uiTooltip shortcut="mod+s">
        <button uiTooltipTrigger aria-label="Save" (click)="log('Saved')">
          <svg lucideSave aria-hidden="true"></svg>
        </button>
        <div *uiTooltipContent>
          Save
          <span uiTooltipShortcut></span>
        </div>
      </ng-container>
      <ng-container uiTooltip shortcut="mod+shift+e">
        <button uiTooltipTrigger (click)="log('Shared')">Share</button>
        <div *uiTooltipContent>
          Share with your team
          <span uiTooltipShortcut></span>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()

  constructor() {
    const offs = [
      registerShortcut("mod+s", () => this.log("Saved")),
      registerShortcut("mod+shift+e", () => this.log("Shared")),
    ]
    inject(DestroyRef).onDestroy(() => offs.forEach((off) => off()))
  }
}

export { Example }
