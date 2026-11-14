import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  UiField,
  UiFieldLabel,
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectTrigger,
  UiSelectValue,
} from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideChevronDown,
    UiField,
    UiFieldLabel,
    UiSelect,
    UiSelectContent,
    UiSelectItem,
    UiSelectItemIndicator,
    UiSelectTrigger,
    UiSelectValue,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Languages</label
      ><ng-container
        uiSelect
        multiple
        [defaultValue]="['en', 'ja']"
        placeholder="Select languages"
        (valueChange)="log('value: ' + json($event))"
        ><button uiSelectTrigger>
          <span uiSelectValue #current="uiSelectValue">{{
            current.state().placeholder
              ? "Select languages"
              : current.state().labels.length > 2
                ? current.state().labels[0] +
                  " and " +
                  (current.state().labels.length - 1) +
                  " more"
                : current.state().label
          }}</span><svg lucideChevronDown aria-hidden="true"></svg>
        </button>
        <div *uiSelectContent>
          @for (language of languages; track language.value) {
            <div uiSelectItem [value]="language.value">
              {{ language.label }}
              <span *uiSelectItemIndicator
                ><svg lucideCheck aria-hidden="true"></svg
              ></span>
            </div>
          }</div
      ></ng-container>
    </div>
  `,
})
class Example {
  protected readonly languages = [
    { value: "en", label: "English" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "ja", label: "Japanese" },
    { value: "pt", label: "Portuguese" },
    { value: "es", label: "Spanish" },
  ]
  protected readonly log = injectLog()
  protected readonly json = JSON.stringify
}

export { Example }
