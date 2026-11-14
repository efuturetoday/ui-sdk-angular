import { Component } from "@angular/core"
import { LucideCornerDownLeft } from "@lucide/angular"
import {
  UiCommand,
  UiCommandInput,
  UiCommandItem,
  UiCommandItemText,
  UiCommandList,
} from "@ngx-ui-sdk/core/command"

@Component({
  selector: "app-example",
  imports: [
    LucideCornerDownLeft,
    UiCommand,
    UiCommandInput,
    UiCommandItem,
    UiCommandItemText,
    UiCommandList,
  ],
  template: `
    <div uiCommand>
      <input
        uiCommandInput
        aria-label="Search docs"
        placeholder="Search docs…"
      />
      <div uiCommandList>
        @for (page of pages; track page) {
          <a
            uiCommandItem
            #item="uiCommandItem"
            [value]="page"
            [href]="'#' + page.toLowerCase()"
          >
            <span uiCommandItemText #text="uiCommandItemText">
              @for (segment of text.state().segments; track $index) {
                @if (segment.match) {
                  <strong>{{ segment.text }}</strong>
                } @else {
                  {{ segment.text }}
                }
              }
            </span>
            @if (item.state().highlighted) {
              <svg lucideCornerDownLeft aria-hidden="true"></svg>
            }
          </a>
        }
      </div>
    </div>
  `,
})
class Example {
  protected readonly pages = ["Composition", "Installation", "Styling"]
}

export { Example }
