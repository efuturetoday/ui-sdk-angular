import { Component } from "@angular/core"
import {
  LucideTextAlignCenter,
  LucideTextAlignEnd,
  LucideTextAlignStart,
} from "@lucide/angular"
import { UiToggle, UiToggleGroup, UiToggleIcon } from "@ngx-ui-sdk/core/toggle"

@Component({
  selector: "app-example",
  imports: [
    LucideTextAlignCenter,
    LucideTextAlignEnd,
    LucideTextAlignStart,
    UiToggle,
    UiToggleGroup,
    UiToggleIcon,
  ],
  template: `
    <div
      uiToggleGroup
      [defaultValue]="['start']"
      [deselectable]="false"
      aria-label="Text alignment"
    >
      @for (item of alignments; track item.value) {
        <button uiToggle [value]="item.value" [attr.aria-label]="item.label">
          <span uiToggleIcon [mirror]="item.mirror">
            @switch (item.value) {
              @case ("start") {
                <svg lucideTextAlignStart></svg>
              }
              @case ("center") {
                <svg lucideTextAlignCenter></svg>
              }
              @case ("end") {
                <svg lucideTextAlignEnd></svg>
              }
            }
          </span>
        </button>
      }
    </div>
  `,
})
class Example {
  protected readonly alignments = [
    { value: "start", label: "Align start", mirror: true },
    { value: "center", label: "Align center", mirror: false },
    { value: "end", label: "Align end", mirror: true },
  ]
}

export { Example }
