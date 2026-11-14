import { Component, signal } from "@angular/core"
import {
  pendingSelect,
  tokenInputFixture as f,
  tokenInputOptions,
  tokenTriggers,
} from "tests/fixtures/token-input"
import {
  fromText,
  toText,
  UiTokenInput,
  UiTokenInputEditor,
  UiTokenInputToken,
  UiTokenInputTokenRemove,
  UiTokenInputTokens,
  UiTriggerMenu,
  UiTriggerMenuContent,
  UiTriggerMenuHint,
  UiTriggerMenuItem,
  UiTriggerMenuList,
  type TokenInputValue,
  type TriggerMenuDataItem,
  type TriggerMenuSelectDetails,
} from "ngx-ui-sdk"

@Component({
  selector: "app-fixture",
  imports: [
    UiTokenInput,
    UiTokenInputEditor,
    UiTokenInputToken,
    UiTokenInputTokenRemove,
    UiTokenInputTokens,
    UiTriggerMenu,
    UiTriggerMenuContent,
    UiTriggerMenuHint,
    UiTriggerMenuItem,
    UiTriggerMenuList,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form
        class="composer"
        [attr.aria-label]="f.formLabel"
        (submit)="onSubmit($event)"
      >
        <ng-container
          uiTokenInput
          [name]="f.name"
          [form]="o.otherForm ? 'other' : undefined"
          [defaultValue]="o.controlled ? undefined : initial"
          [value]="o.controlled ? current() : undefined"
          [tokenDeletion]="o.tokenDeletion"
          [submitShortcut]="o.submitShortcut"
          [copy]="o.copy"
          [disabled]="o.disabled"
          [readOnly]="o.readOnly"
          [onSubmit]="o.form ? undefined : onTokenSubmit"
          (beforeValueChange)="onValueChange($event.value, $event.details)"
        >
          <label class="label" id="prompt-label">{{ f.label }}</label>
          <div
            uiTokenInputEditor
            aria-labelledby="prompt-label"
            class="editor"
            [placeholder]="f.placeholder"
          ></div>
          <ng-template uiTokenInputTokens let-token>
            <span uiTokenInputToken class="token"
              >{{ token.label }}<span uiTokenInputTokenRemove> ×</span></span
            >
          </ng-template>
          <ng-container
            uiTriggerMenu
            [triggers]="triggers"
            [onSelect]="onSelect"
          >
            <span uiTriggerMenuHint class="hint"></span>
            <div *uiTriggerMenuContent class="popup list-popup">
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
        </ng-container>
        <button type="submit">{{ f.submit }}</button>
      </form>
      @if (o.otherForm) {
        <form id="other" aria-label="Other" (submit)="onOtherSubmit($event)"></form>
      }
      <textarea [attr.aria-label]="f.scratch"></textarea>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Submitted">{{ submitted() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly o = tokenInputOptions()
  protected readonly triggers = tokenTriggers()
  protected readonly initial = fromText(this.o.value)
  protected readonly current = signal<TokenInputValue>(this.initial)
  protected readonly action = signal("")
  protected readonly submitted = signal("")
  protected readonly onTokenSubmit = (next: TokenInputValue) =>
    this.submitted.set(toText(next))
  protected readonly onSelect = (
    _selected: unknown,
    details: TriggerMenuSelectDetails<unknown>
  ) =>
    this.o.pending && details.trigger === "@"
      ? pendingSelect({ fail: this.o.fail })
      : undefined

  protected itemsOf(items: unknown) {
    return items as TriggerMenuDataItem[]
  }

  protected onValueChange(next: TokenInputValue, details: { reason: string }) {
    this.current.set(next)
    this.action.set(`${details.reason}:${toText(next)}`)
  }

  protected onSubmit(event: Event) {
    event.preventDefault()
    this.submitted.set(
      String(new FormData(event.currentTarget as HTMLFormElement).get(f.name))
    )
  }

  protected onOtherSubmit(event: Event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget as HTMLFormElement)
    this.submitted.set(`other:${data.get(f.name)}`)
  }
}

export { Fixture }
