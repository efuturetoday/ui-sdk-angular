import { Component, signal } from "@angular/core"
import {
  tooltipContentOptions,
  tooltipFixture,
  tooltipOptions,
  tooltipParts,
} from "tests/fixtures/tooltip"
import {
  UiPopover,
  UiPopoverClose,
  UiPopoverContent,
  UiPopoverTitle,
  UiPopoverTrigger,
} from "ngx-ui-sdk/popover"
import {
  createTooltipController,
  UiTooltip,
  UiTooltipArrow,
  UiTooltipContent,
  UiTooltipShortcut,
  UiTooltipTrigger,
} from "ngx-ui-sdk/tooltip"

@Component({
  selector: "app-fixture",
  imports: [
    UiPopover,
    UiPopoverClose,
    UiPopoverContent,
    UiPopoverTitle,
    UiPopoverTrigger,
    UiTooltip,
    UiTooltipArrow,
    UiTooltipContent,
    UiTooltipShortcut,
    UiTooltipTrigger,
  ],
  template: `
    <div class="fixture tooltip-page">
      <button>Before</button>
      <ng-container
        uiTooltip
        [delay]="options.delay"
        [closeDelay]="options.closeDelay"
        [toggleable]="options.toggleable"
        [closeOnPress]="options.closeOnPress"
        [type]="options.type"
        [disabled]="options.disabled"
        [container]="options.container"
        [controller]="controller"
        [defaultOpen]="parts.open"
        [shortcut]="save.shortcut"
      >
        <button uiTooltipTrigger [disabled]="parts.nativeDisabled" (click)="action.set('save')">
          {{ save.trigger }}
        </button>
        <div *uiTooltipContent="let state; side: content.side; align: content.align" class="tooltip">
          <div uiTooltipArrow class="arrow"></div>
          {{ save.content }}
          <span uiTooltipShortcut></span>
        </div>
      </ng-container>
      <div class="toolbar" role="group" aria-label="Formatting">
        @for (item of toolbar; track item.content) {
          <ng-container
            uiTooltip
            [delay]="options.delay"
            [closeDelay]="options.closeDelay"
            [toggleable]="options.toggleable"
            [closeOnPress]="options.closeOnPress"
            [type]="options.type"
            [disabled]="options.disabled"
            [container]="options.container"
          >
            <button uiTooltipTrigger>
              <span aria-hidden="true">{{ item.icon }}</span>
            </button>
            <div *uiTooltipContent class="tooltip">{{ item.content }}</div>
          </ng-container>
        }
      </div>
      <ng-container uiPopover [container]="options.container">
        <ng-container
          uiTooltip
          [delay]="options.delay"
          [closeDelay]="options.closeDelay"
          [toggleable]="options.toggleable"
          [closeOnPress]="options.closeOnPress"
          [type]="options.type"
          [disabled]="options.disabled"
          [container]="options.container"
        >
          <button uiTooltipTrigger uiPopoverTrigger>{{ profile.trigger }}</button>
          <div *uiTooltipContent class="tooltip">{{ profile.content }}</div>
        </ng-container>
        <div *uiPopoverContent="let state; sideOffset: 8" class="popup">
          <h2 uiPopoverTitle class="title">{{ profile.popover }}</h2>
          <div class="actions">
            <ng-container
              uiTooltip
              [delay]="options.delay"
              [closeDelay]="options.closeDelay"
              [toggleable]="options.toggleable"
              [closeOnPress]="options.closeOnPress"
              [type]="options.type"
              [disabled]="options.disabled"
              [container]="options.container"
            >
              <button uiTooltipTrigger>{{ profile.help.trigger }}</button>
              <div *uiTooltipContent class="tooltip">{{ profile.help.content }}</div>
            </ng-container>
            <button uiPopoverClose>{{ profile.close }}</button>
          </div>
        </div>
      </ng-container>
      <ng-container
        uiTooltip
        toggleable
        [delay]="options.delay"
        [closeDelay]="options.closeDelay"
        [closeOnPress]="options.closeOnPress"
        [type]="options.type"
        [disabled]="options.disabled"
        [container]="options.container"
      >
        <button uiTooltipTrigger [attr.aria-label]="info.trigger">
          <span aria-hidden="true">i</span>
        </button>
        <div *uiTooltipContent class="tooltip">{{ info.content }}</div>
      </ng-container>
      @if (parts.disabled) {
        <ng-container
          uiTooltip
          [delay]="options.delay"
          [closeDelay]="options.closeDelay"
          [toggleable]="options.toggleable"
          [closeOnPress]="options.closeOnPress"
          [type]="options.type"
          [disabled]="options.disabled"
          [container]="options.container"
        >
          <button uiTooltipTrigger aria-disabled="true" (click)="publishPress($event)">
            {{ publish.trigger }}
          </button>
          <div *uiTooltipContent class="tooltip">{{ publish.content }}</div>
        </ng-container>
      }
      @if (parts.iconPopover) {
        <ng-container uiPopover [container]="options.container">
          <ng-container
            uiTooltip
            [delay]="options.delay"
            [closeDelay]="options.closeDelay"
            [toggleable]="options.toggleable"
            [closeOnPress]="options.closeOnPress"
            [type]="options.type"
            [disabled]="options.disabled"
            [container]="options.container"
          >
            <button uiTooltipTrigger uiPopoverTrigger>
              <span aria-hidden="true">{{ iconPopover.icon }}</span>
            </button>
            <div *uiTooltipContent class="tooltip">{{ iconPopover.content }}</div>
          </ng-container>
          <div *uiPopoverContent class="popup">{{ iconPopover.popover }}</div>
        </ng-container>
        <ng-container uiPopover [container]="options.container">
          <button uiPopoverTrigger>
            <span aria-hidden="true">{{ iconPopover.unnamed }}</span>
          </button>
          <div *uiPopoverContent class="popup">{{ iconPopover.popover }}</div>
        </ng-container>
      }
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <button (click)="controller.open()">Open with controller</button>
      @if (parts.shortcut) {
        <button uiTooltipTrigger [controller]="controller">
          {{ shortcut.trigger }}
          <span uiTooltipShortcut></span>
        </button>
      }
    </div>
  `,
})
class Fixture {
  protected readonly options = tooltipOptions()
  protected readonly content = tooltipContentOptions()
  protected readonly parts = tooltipParts()
  protected readonly controller = createTooltipController()
  protected readonly action = signal("")
  protected readonly save = tooltipFixture.save
  protected readonly toolbar = tooltipFixture.toolbar
  protected readonly profile = tooltipFixture.profile
  protected readonly info = tooltipFixture.info
  protected readonly publish = tooltipFixture.publish
  protected readonly shortcut = tooltipFixture.shortcut
  protected readonly iconPopover = tooltipFixture.iconPopover

  protected publishPress(event: MouseEvent) {
    if (
      (event.currentTarget as HTMLElement).getAttribute("aria-disabled") !==
      "true"
    ) {
      this.action.set(this.publish.action)
    }
  }
}

export { Fixture }
