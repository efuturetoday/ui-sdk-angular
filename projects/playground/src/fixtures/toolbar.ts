import { Component, signal } from "@angular/core"
import {
  toolbarFixture as f,
  toolbarLocked,
  toolbarOptions,
} from "tests/fixtures/toolbar"
import {
  createToolbarController,
  UiMenu,
  UiMenuContent,
  UiMenuItem,
  UiMenuTrigger,
  UiNumberInput,
  UiNumberInputControl,
  UiToggle,
  UiToggleGroup,
  UiToolbar,
  UiToolbarButton,
  UiToolbarGroup,
  UiToolbarInput,
  UiToolbarLink,
  UiToolbarSeparator,
} from "ui-sdk-angular"

// Upstream's fixture. With ?locked, groups wrap Text style, Spellcheck and
// Help, written out for each case: Angular has no wrapper a template adds or
// leaves out.
@Component({
  selector: "app-fixture",
  imports: [
    UiMenu,
    UiMenuContent,
    UiMenuItem,
    UiMenuTrigger,
    UiNumberInput,
    UiNumberInputControl,
    UiToggle,
    UiToggleGroup,
    UiToolbar,
    UiToolbarButton,
    UiToolbarGroup,
    UiToolbarInput,
    UiToolbarLink,
    UiToolbarSeparator,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiToolbar
        class="toolbar"
        [attr.aria-label]="f.label"
        [controller]="controller"
        [orientation]="options.orientation"
        [loop]="options.loop"
        [disabled]="options.disabled"
      >
        @for (group of groups; track group.label; let index = $index) {
          @if (lockable && index === 0) {
            <div uiToolbarGroup aria-label="Locked style" [disabled]="locked()">
              <div
              uiToggleGroup
              class="toggle-group"
              [attr.aria-label]="group.label"
              [multiple]="group.multiple"
              [defaultValue]="group.defaultValue"
              (valueChange)="
                action.set(group.label + ': ' + ($event.join(', ') || 'none'))
              "
            >
              @for (item of group.items; track item.value) {
                <button
                  uiToggle
                  class="toggle"
                  [value]="item.value"
                  [disabled]="disabledOf(item)"
                >
                  {{ item.label }}
                </button>
              }
            </div>
            </div>
          } @else {
            <div
              uiToggleGroup
              class="toggle-group"
              [attr.aria-label]="group.label"
              [multiple]="group.multiple"
              [defaultValue]="group.defaultValue"
              (valueChange)="
                action.set(group.label + ': ' + ($event.join(', ') || 'none'))
              "
            >
              @for (item of group.items; track item.value) {
                <button
                  uiToggle
                  class="toggle"
                  [value]="item.value"
                  [disabled]="disabledOf(item)"
                >
                  {{ item.label }}
                </button>
              }
            </div>
          }
          <div uiToolbarSeparator></div>
        }
        <ng-container uiMenu [onAction]="onFont">
          <button uiMenuTrigger uiToolbarButton>{{ f.font.trigger }}</button>
          <div *uiMenuContent class="popup">
            @for (item of f.font.items; track item) {
              <div uiMenuItem class="item" [value]="item">{{ item }}</div>
            }
          </div>
        </ng-container>
        <div
          uiNumberInput
          [defaultValue]="f.size.defaultValue"
          (valueChange)="action.set('size: ' + $event)"
        >
          <input
            uiNumberInputControl
            uiToolbarInput
            [attr.aria-label]="f.size.label"
          />
        </div>
        <input
          uiToolbarInput
          [attr.aria-label]="f.comment.label"
          [value]="f.comment.defaultValue"
        />
        <div
          uiToolbarGroup
          class="toolbar-group"
          [attr.aria-label]="f.history.label"
          [disabled]="lockable && locked()"
        >
          @for (item of f.history.items; track item.label) {
            <button
              uiToolbarButton
              [disabled]="disabledOf(item)"
              (click)="action.set(item.label.toLowerCase())"
            >
              {{ item.label }}
            </button>
          }
        </div>
        @if (lockable) {
          <div uiToolbarGroup aria-label="Locked proofing" [disabled]="locked()">
            <button
            uiToggle
            class="toggle"
            (pressedChange)="action.set('spellcheck: ' + ($event ? 'on' : 'off'))"
          >
            {{ f.spellcheck.label }}
          </button>
          </div>
          <div uiToolbarGroup aria-label="Locked help" [disabled]="locked()">
            <a uiToolbarLink [href]="f.help.href">{{ f.help.label }}</a>
          </div>
        } @else {
          <button
            uiToggle
            class="toggle"
            (pressedChange)="action.set('spellcheck: ' + ($event ? 'on' : 'off'))"
          >
            {{ f.spellcheck.label }}
          </button>
          <a uiToolbarLink [href]="f.help.href">{{ f.help.label }}</a>
        }
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <button (click)="controller.focus()">Focus toolbar</button>
      <button (click)="locked.set(false)">Unlock</button>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly options = toolbarOptions()
  protected readonly controller = createToolbarController()
  protected readonly action = signal("")
  protected readonly lockable = toolbarLocked()
  protected readonly locked = signal(this.lockable)
  protected readonly groups = [
    { ...f.style, multiple: true },
    { ...f.alignment, multiple: false },
  ]
  protected readonly onFont = (value: string) =>
    this.action.set(`font: ${value}`)

  protected disabledOf(item: object) {
    return (item as { disabled?: boolean }).disabled
  }
}

export { Fixture }
