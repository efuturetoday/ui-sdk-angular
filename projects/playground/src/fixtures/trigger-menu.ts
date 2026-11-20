import { UiText } from "@ngx-ui-sdk/core"
import {
  Component,
  input,
  output,
  signal,
} from "@angular/core"
import {
  fixtureTriggers,
  selectAction,
  triggerMenuFixture as f,
  triggerMenuOptions,
} from "tests/fixtures/trigger-menu"
import {
  UiTextarea,
} from "@ngx-ui-sdk/core/input"
import {
  UiTriggerMenu,
  UiTriggerMenuContent,
  UiTriggerMenuEmpty,
  UiTriggerMenuHint,
  UiTriggerMenuInput,
  UiTriggerMenuItem,
  UiTriggerMenuList,
  UiTriggerMenuStatus,
  type TriggerMenuDataItem,
} from "@ngx-ui-sdk/core/trigger-menu"

let ids = 0

// One composer: a field and the trigger menu that suggests into it. Its field
// is a textarea, or with ?input an input, or with ?textarea the Textarea
// component on the same element.
@Component({
  selector: "app-composer",
  imports: [
    UiText,
    UiTextarea,
    UiTriggerMenu,
    UiTriggerMenuContent,
    UiTriggerMenuEmpty,
    UiTriggerMenuHint,
    UiTriggerMenuInput,
    UiTriggerMenuItem,
    UiTriggerMenuList,
    UiTriggerMenuStatus,
  ],
  template: `
    <ng-container
      uiTriggerMenu
      [triggers]="triggers"
      [autoHighlight]="o.autoHighlight"
      [onSelect]="onSelect"
      (beforeOpenChange)="opened.emit($event.open + ':' + $event.details.reason)"
    >
      <label class="label" [for]="id">{{ name() }}</label>
      @if (o.input) {
        <input uiTriggerMenuInput [id]="id" name="message" class="input" />
      } @else if (o.textarea) {
        <textarea
          uiTriggerMenuInput
          uiTextarea
          [id]="id"
          name="message"
          class="input"
        ></textarea>
      } @else {
        <textarea
          uiTriggerMenuInput
          [id]="id"
          name="message"
          class="input"
        ></textarea>
      }
      <span uiTriggerMenuHint class="hint" uiText></span>
      <div uiTriggerMenuStatus class="status" uiText></div>
      <div *uiTriggerMenuContent class="popup list-popup">
        @if (o.empty) {
          <div uiTriggerMenuEmpty class="empty">{{ f.empty }}</div>
        }
        <div uiTriggerMenuList #list="uiTriggerMenuList">
          @for (item of itemsOf(list.state().items); track item.value) {
            <div
              uiTriggerMenuItem
              class="item"
              [value]="item.value"
              [label]="item.label"
              [disabled]="item.disabled"
            >{{ item.label }}</div
                  >
          }
        </div>
      </div>
    </ng-container>
  `,
})
class Composer {
  readonly name = input.required<string>()
  readonly action = output<string>()
  readonly opened = output<string>()
  protected readonly f = f
  protected readonly o = triggerMenuOptions()
  protected readonly triggers = fixtureTriggers()
  protected readonly id = `composer-${++ids}`
  protected readonly onSelect = (
    value: unknown,
    details: { arguments: Record<string, string> }
  ) => this.action.emit(selectAction(value, details.arguments))

  protected itemsOf(items: unknown) {
    return items as TriggerMenuDataItem[]
  }
}

@Component({
  selector: "app-fixture",
  imports: [Composer],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form
        class="composer"
        [attr.aria-label]="f.formLabel"
        (submit)="onSubmit($event)"
      >
        <app-composer
          [name]="f.label"
          (action)="action.set($event)"
          (opened)="open.set($event)"
        />
        @if (o.twice) {
          <app-composer
            name="Second"
            (action)="action.set($event)"
            (opened)="open.set($event)"
          />
        }
        <button type="submit">{{ f.submit }}</button>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Open">{{ open() }}</output>
      <output role="status" aria-label="Submitted">{{ submitted() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly o = triggerMenuOptions()
  protected readonly action = signal("")
  protected readonly open = signal("")
  protected readonly submitted = signal("")

  protected onSubmit(event: Event) {
    event.preventDefault()
    this.submitted.set(
      String(new FormData(event.currentTarget as HTMLFormElement).get("message"))
    )
  }
}

export { Fixture }
