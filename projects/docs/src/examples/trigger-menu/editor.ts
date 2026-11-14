import {
  Component,
  ElementRef,
  afterNextRender,
  signal,
  viewChild,
} from "@angular/core"
import { UiField, UiFieldControl, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import { type TextEditorAdapter } from "@ngx-ui-sdk/core/token-input"
import {
  textFieldAdapter,
  type TriggerDefinition,
  type TriggerMenuDataItem,
  UiTriggerMenu,
  UiTriggerMenuContent,
  UiTriggerMenuItem,
  UiTriggerMenuList,
} from "@ngx-ui-sdk/core/trigger-menu"

@Component({
  selector: "app-example",
  imports: [
    UiField,
    UiFieldControl,
    UiFieldLabel,
    UiTriggerMenu,
    UiTriggerMenuContent,
    UiTriggerMenuItem,
    UiTriggerMenuList,
  ],
  template: `
    <ng-container uiTriggerMenu [editor]="editor()" [triggers]="triggers">
      <div uiField>
        <label uiFieldLabel>Notes</label>
        <textarea
          #notes
          uiFieldControl
          placeholder="Type @ to mention someone…"></textarea>
      </div>
      <div *uiTriggerMenuContent="let state">
        <div uiTriggerMenuList #list="uiTriggerMenuList">
          @for (item of itemsOf(list.state().items); track item.value) {
            <div uiTriggerMenuItem [value]="item.value" [label]="item.label">
              {{ item.label }}
            </div>
          }
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  protected readonly people = [
    { value: "hollis", label: "Hollis Grant" },
    { value: "ines", label: "Inès Moreau" },
    { value: "kofi", label: "Kofi Mensah" },
    { value: "wren", label: "Wren Takahashi" },
    { value: "tomasz", label: "Tomasz Wójcik" },
  ]
  protected readonly triggers: TriggerDefinition[] = [
    { char: "@", items: this.people },
  ]
  protected readonly notes =
    viewChild.required<ElementRef<HTMLTextAreaElement>>("notes")
  protected readonly editor = signal<TextEditorAdapter | undefined>(undefined)

  constructor() {
    afterNextRender(() =>
      this.editor.set(textFieldAdapter(this.notes().nativeElement))
    )
  }

  protected itemsOf(items: unknown) {
    return items as TriggerMenuDataItem[]
  }
}

export { Example }
