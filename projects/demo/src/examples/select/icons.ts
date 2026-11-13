import { Component } from "@angular/core"
import {
  LucideCheck,
  LucideChevronDown,
  LucideTextAlignCenter,
  LucideTextAlignEnd,
  LucideTextAlignStart,
} from "@lucide/angular"
import {
  UiField,
  UiFieldLabel,
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectItemIcon,
  UiSelectItemIndicator,
  UiSelectTrigger,
  UiSelectValue,
  UiSelectValueIcon,
} from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideChevronDown,
    LucideTextAlignCenter,
    LucideTextAlignEnd,
    LucideTextAlignStart,
    UiField,
    UiFieldLabel,
    UiSelect,
    UiSelectContent,
    UiSelectItem,
    UiSelectItemIcon,
    UiSelectItemIndicator,
    UiSelectTrigger,
    UiSelectValue,
    UiSelectValueIcon,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Text alignment</label
      ><ng-container uiSelect defaultValue="start"
        ><button uiSelectTrigger>
          <span uiSelectValueIcon></span><span uiSelectValue></span
          ><svg lucideChevronDown aria-hidden="true"></svg>
        </button>
        <div *uiSelectContent>
          <div uiSelectItem value="start">
            <span uiSelectItemIcon mirror
              ><svg lucideTextAlignStart aria-hidden="true"></svg></span
            >Start
            <span *uiSelectItemIndicator
              ><svg lucideCheck aria-hidden="true"></svg
            ></span>
          </div>
          <div uiSelectItem value="center">
            <span uiSelectItemIcon
              ><svg lucideTextAlignCenter aria-hidden="true"></svg></span
            >Center
            <span *uiSelectItemIndicator
              ><svg lucideCheck aria-hidden="true"></svg
            ></span>
          </div>
          <div uiSelectItem value="end">
            <span uiSelectItemIcon mirror
              ><svg lucideTextAlignEnd aria-hidden="true"></svg></span
            >End
            <span *uiSelectItemIndicator
              ><svg lucideCheck aria-hidden="true"></svg
            ></span>
          </div></div
      ></ng-container>
    </div>
  `,
})
class Example {}

export { Example }
