import { Component } from "@angular/core"
import {
  LucideBold,
  LucideItalic,
  LucideLink,
  LucideUnderline,
} from "@lucide/angular"
import { UiToggle, UiToggleIcon } from "ngx-ui-sdk/toggle"
import {
  UiToolbar,
  UiToolbarButton,
  UiToolbarSeparator,
} from "ngx-ui-sdk/toolbar"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideBold,
    LucideItalic,
    LucideLink,
    LucideUnderline,
    UiToggle,
    UiToggleIcon,
    UiToolbar,
    UiToolbarButton,
    UiToolbarSeparator,
  ],
  template: `
    <div uiToolbar aria-label="Formatting">
      @for (style of styles; track style.label) {
        <button
          uiToggle
          [attr.aria-label]="style.label"
          (pressedChange)="log(style.label + ' ' + ($event ? 'on' : 'off'))"
        >
          <span uiToggleIcon>
            @switch (style.icon) {
              @case ("bold") {
                <svg lucideBold></svg>
              }
              @case ("italic") {
                <svg lucideItalic></svg>
              }
              @case ("underline") {
                <svg lucideUnderline></svg>
              }
            }
          </span>
        </button>
      }
      <div uiToolbarSeparator></div>
      <button
        uiToolbarButton
        aria-label="Insert link"
        (click)="log('Insert link')"
      >
        <svg lucideLink aria-hidden="true"></svg>
      </button>
    </div>
  `,
})
class Example {
  protected readonly styles = [
    { label: "Bold", icon: "bold" },
    { label: "Italic", icon: "italic" },
    { label: "Underline", icon: "underline" },
  ]

  protected readonly log = injectLog()
}

export { Example }
