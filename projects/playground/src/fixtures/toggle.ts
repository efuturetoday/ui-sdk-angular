import { Component, signal } from "@angular/core"
import { changedValue, toggleOptions } from "tests/fixtures/page"
import { toggleAction, toggleFixture } from "tests/fixtures/toggle"
import {
  createToggleGroupController,
  UiButton,
  UiSeparator,
  UiToggle,
  UiToggleGroup,
  type ButtonActionDetails,
  type TogglePressedChangeReason,
  type ToggleGroupValueChangeReason,
} from "ngx-ui-sdk"
import type { ChangeDetails } from "@ui-sdk/core"

// A Promise and the buttons that settle it.
function gate() {
  let settle:
    | { resolve: () => void; reject: (reason: Error) => void }
    | undefined
  return {
    wait: () =>
      new Promise<void>((resolve, reject) => (settle = { resolve, reject })),
    resolve: () => settle?.resolve(),
    reject: () => settle?.reject(new Error("Offline")),
  }
}

@Component({
  selector: "app-fixture",
  imports: [UiButton, UiSeparator, UiToggle, UiToggleGroup],
  template: `
    <div class="fixture">
      <button>Before</button>
      <button
        uiToggle
        class="toggle"
        [defaultPressed]="options.defaultPressed"
        (beforePressedChange)="onPressedChange($event)"
      >
        {{ fixture.toggle.label }}
      </button>
      @for (group of groups; track group.name; let index = $index) {
        @if (index === 1) {
          <div uiSeparator class="rule" orientation="vertical"></div>
        }
        <div
          uiToggleGroup
          class="toggle-group"
          [attr.aria-label]="group.label"
          [defaultValue]="values[group.name]"
          [multiple]="group.multiple"
          [disabled]="group.disabled"
          [controller]="group.controller"
          [orientation]="options.orientation"
          [deselectable]="options.deselectable"
          [loop]="options.loop"
          (beforeValueChange)="onValueChange(group.name, $event)"
        >
          @for (item of group.items; track item.value) {
            <button
              uiToggle
              class="toggle"
              [value]="item.value"
              [disabled]="item.disabled"
            >
              {{ item.label }}
            </button>
          }
        </div>
      }
      <form
        [attr.aria-label]="fixture.form.label"
        (submit)="$event.preventDefault(); submissions.set(submissions() + 1)"
      >
        <label>
          {{ fixture.form.field }}
          <input name="name" [defaultValue]="fixture.form.defaultName" />
        </label>
        <button uiButton class="button" type="submit" [action]="saving.wait">
          Submit
        </button>
        <button uiButton class="button" type="reset">Reset</button>
        <button uiButton class="button" disabled [action]="remove">
          Delete
        </button>
        <button
          uiButton
          class="button"
          type="submit"
          [disabled]="true"
          focusableWhenDisabled
          [action]="archive"
        >
          Archive
        </button>
      </form>
      <button uiButton class="button" [action]="save">Save</button>
      <button uiButton class="button" [action]="publish">Publish</button>
      <button (click)="formatting.setValue([])">Clear formatting</button>
      <button (click)="saving.resolve()">Finish saving</button>
      <button (click)="publishing.resolve()">Finish publishing</button>
      <button (click)="publishing.reject()">Fail publishing</button>
      <a uiButton class="button" [attr.href]="fixture.docs.href">{{
        fixture.docs.label
      }}</a>
      <a
        uiButton
        class="button"
        [attr.href]="fixture.changelog.href"
        disabled
        >{{ fixture.changelog.label }}</a
      >
      <div uiSeparator class="rule"></div>
      <div uiSeparator class="rule" decorative></div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output aria-label="Submissions">{{ submissions() }}</output>
      <output aria-label="Pressed with">{{ pressedWith() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly fixture = toggleFixture
  protected readonly options = toggleOptions()
  protected readonly formatting = createToggleGroupController()
  protected readonly action = signal("")
  protected readonly pressedWith = signal("")
  protected readonly submissions = signal(0)
  protected readonly saving = gate()
  protected readonly publishing = gate()
  // Each group's value, to tell which toggle a change touches.
  protected readonly values: Record<string, string[]> = {
    alignment: this.options.alignment
      ? [this.options.alignment]
      : toggleFixture.alignment.defaultValue,
    formatting: toggleFixture.formatting.defaultValue,
  }
  protected readonly groups = [
    {
      ...toggleFixture.alignment,
      multiple: false,
      disabled: false,
      controller: undefined,
    },
    {
      ...toggleFixture.formatting,
      multiple: true,
      disabled: this.options.disabled,
      controller: this.formatting,
    },
  ]

  protected onValueChange(
    name: string,
    {
      value,
      details,
    }: {
      value: string[]
      details: ChangeDetails<ToggleGroupValueChangeReason>
    }
  ) {
    const { cancel } = this.options
    if (cancel && changedValue(this.values[name]!, value) === cancel) {
      return details.cancel()
    }
    this.values[name] = value
    this.action.set(toggleAction.group(name, value))
  }

  protected onPressedChange({
    pressed,
    details,
  }: {
    pressed: boolean
    details: ChangeDetails<TogglePressedChangeReason>
  }) {
    if (this.options.cancel === toggleFixture.toggle.value) {
      return details.cancel()
    }
    this.action.set(toggleAction.toggle(pressed))
  }

  protected readonly remove = () => this.action.set("delete")
  protected readonly archive = () => this.action.set("archive")

  protected readonly save = (
    _event: MouseEvent,
    { source }: ButtonActionDetails
  ) => {
    this.action.set("save")
    this.pressedWith.set(source)
  }

  protected readonly publish = async () => {
    this.action.set("publishing")
    await this.publishing.wait()
    this.action.set("published")
  }
}

export { Fixture }
