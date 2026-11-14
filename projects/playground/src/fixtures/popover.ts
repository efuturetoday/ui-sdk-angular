import { Component, signal } from "@angular/core"
import {
  popoverContentOptions,
  popoverFixture,
  popoverOptions,
  popoverParts,
} from "tests/fixtures/popover"
import {
  createPopoverController,
  type PopoverDismissAttemptDetails,
  UiMenu,
  UiMenuContent,
  UiMenuItem,
  UiMenuTrigger,
  UiPopover,
  UiPopoverArrow,
  UiPopoverClose,
  UiPopoverContent,
  UiPopoverDescription,
  UiPopoverShortcut,
  UiPopoverTitle,
  UiPopoverTrigger,
} from "ui-sdk-angular"

@Component({
  selector: "app-fixture",
  imports: [
    UiMenu,
    UiMenuContent,
    UiMenuItem,
    UiMenuTrigger,
    UiPopover,
    UiPopoverArrow,
    UiPopoverClose,
    UiPopoverContent,
    UiPopoverDescription,
    UiPopoverShortcut,
    UiPopoverTitle,
    UiPopoverTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container
        uiPopover
        [controller]="controller"
        [defaultOpen]="options.defaultOpen"
        [modal]="options.modal"
        [openOnHover]="options.openOnHover"
        [delay]="options.delay"
        [closeDelay]="options.closeDelay"
        [container]="options.container"
        [dismissible]="options.dismissible"
        [presentation]="options.presentation"
        (dismissAttempt)="onDismissAttempt($event)"
      >
        @if (triggerShown()) {
          <button
            uiPopoverTrigger
            [shortcut]="parts.shortcut ? popoverFixture.shortcut.trigger : undefined"
          >
            {{ popoverFixture.trigger }}
            @if (parts.shortcut) {
              <span uiPopoverShortcut></span>
            }
          </button>
        }
        <div
          *uiPopoverContent="let state; sideOffset: 8; side: content.side; align: content.align; initialFocus: content.initialFocus"
          class="popup"
        >
          <div uiPopoverArrow class="arrow"></div>
          @if (parts.title) {
            <h2 uiPopoverTitle class="title">{{ popoverFixture.title }}</h2>
          }
          <p uiPopoverDescription class="description">{{ popoverFixture.description }}</p>
          <label class="field">
            {{ popoverFixture.field }}
            <input [value]="popoverFixture.defaultValue" />
          </label>
          <div class="actions">
            <button (click)="action.set('save')">
              {{ popoverFixture.action }}
              @if (parts.shortcut) {
                <span uiPopoverShortcut [shortcut]="popoverFixture.shortcut.save"></span>
              }
            </button>
            <button uiPopoverClose>{{ popoverFixture.close }}</button>
            @if (parts.removable) {
              <button (click)="triggerShown.set(false)">{{ popoverFixture.remove }}</button>
            }
          </div>
          @if (parts.menu) {
            <ng-container uiMenu [container]="options.container" [onAction]="onMenuAction">
              <button uiMenuTrigger>{{ popoverFixture.menu.trigger }}</button>
              <div *uiMenuContent class="popup">
                @for (item of popoverFixture.menu.items; track item.value) {
                  <div uiMenuItem [value]="item.value" class="item">{{ item.label }}</div>
                }
              </div>
            </ng-container>
          }
          @if (parts.nested) {
            <ng-container uiPopover>
              <button uiPopoverTrigger>{{ popoverFixture.nested.trigger }}</button>
              <div *uiPopoverContent class="popup">
                <h2 uiPopoverTitle class="title">{{ popoverFixture.nested.title }}</h2>
                <button (click)="action.set('archive')">{{ popoverFixture.nested.action }}</button>
              </div>
            </ng-container>
          }
        </div>
      </ng-container>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <button (click)="controller.open()">Open with controller</button>
      @if (parts.shortcut) {
        <button
          uiPopoverTrigger
          [controller]="controller"
          [shortcut]="popoverFixture.shortcut.remote.keys"
        >
          {{ popoverFixture.shortcut.remote.trigger }}
          <span uiPopoverShortcut></span>
        </button>
      }
    </div>
  `,
})
class Fixture {
  protected readonly popoverFixture = popoverFixture
  protected readonly options = popoverOptions() as {
    defaultOpen?: boolean
    modal?: boolean | "trap-focus"
    openOnHover?: boolean
    delay?: number
    closeDelay?: number
    container?: HTMLElement | null
    dismissible?: boolean
    onDismissAttempt?: (details: { reason: string }) => void
    presentation?: "auto" | "sheet"
  }
  protected readonly content = popoverContentOptions()
  protected readonly parts = popoverParts()
  protected readonly controller = createPopoverController()
  protected readonly action = signal("")
  protected readonly triggerShown = signal(true)
  protected readonly onMenuAction = (value: string) => this.action.set(value)

  protected onDismissAttempt(details: PopoverDismissAttemptDetails) {
    this.options.onDismissAttempt?.(details)
  }
}

export { Fixture }
