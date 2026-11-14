import { Component } from "@angular/core"
import { LucideInfo } from "@lucide/angular"
import {
  UiField,
  UiFieldLabel,
  UiInput,
  UiTooltip,
  UiTooltipContent,
  UiTooltipTrigger,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    LucideInfo,
    UiField,
    UiFieldLabel,
    UiInput,
    UiTooltip,
    UiTooltipContent,
    UiTooltipTrigger,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Webhook URL</label>
      <div #field data-slot="row">
        <input uiInput placeholder="https://" />
        <ng-container uiTooltip>
          <button uiTooltipTrigger aria-label="About webhooks">
            <svg lucideInfo aria-hidden="true"></svg>
          </button>
          <div
            *uiTooltipContent="
              let state;
              anchor: field;
              side: 'bottom';
              align: 'start'
            "
          >
            We send a POST request here for every new order.
          </div>
        </ng-container>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
