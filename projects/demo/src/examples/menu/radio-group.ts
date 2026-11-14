import { Component } from "@angular/core"
import {
  UiMenu,
  UiMenuContent,
  UiMenuGroupLabel,
  UiMenuItemIndicator,
  UiMenuRadioGroup,
  UiMenuRadioItem,
  UiMenuSeparator,
  UiMenuTrigger,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiMenu,
    UiMenuContent,
    UiMenuGroupLabel,
    UiMenuItemIndicator,
    UiMenuRadioGroup,
    UiMenuRadioItem,
    UiMenuSeparator,
    UiMenuTrigger,
  ],
  template: `
    <ng-container uiMenu>
      <button uiMenuTrigger>Panel</button>
      <div *uiMenuContent="let state">
        <div
          uiMenuRadioGroup
          name="position"
          defaultValue="bottom"
          (valueChange)="log('Panel at the ' + $event)"
        >
          <div uiMenuGroupLabel>Position</div>
          @for (option of positions; track option) {
            <div uiMenuRadioItem [value]="option.toLowerCase()">
              <span *uiMenuItemIndicator></span>
              {{ option }}
            </div>
          }
        </div>
        <div uiMenuSeparator></div>
        <div
          uiMenuRadioGroup
          defaultValue="comfortable"
          (valueChange)="log($event + ' density')"
        >
          <div uiMenuGroupLabel>Density</div>
          @for (option of densities; track option) {
            <div uiMenuRadioItem [value]="option.toLowerCase()">
              <span *uiMenuItemIndicator></span>
              {{ option }}
            </div>
          }
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly positions = ["Top", "Bottom", "Right"]
  protected readonly densities = ["Compact", "Comfortable"]
}

export { Example }
