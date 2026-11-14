import { Component, signal } from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import { describeChange } from "tests/fixtures/hover-popups"
import {
  UiDialog,
  UiDialogContent,
  UiDialogTrigger,
} from "@ngx-ui-sdk/core/dialog"
import {
  UiDrawer,
  UiDrawerContent,
  UiDrawerTrigger,
} from "@ngx-ui-sdk/core/drawer"
import {
  UiMenu,
  UiMenuContent,
  UiMenuGroup,
  UiMenuGroupLabel,
  UiMenuItem,
  UiMenuTrigger,
} from "@ngx-ui-sdk/core/menu"
import {
  createPopoverController,
  UiPopover,
  UiPopoverContent,
  UiPopoverTrigger,
} from "@ngx-ui-sdk/core/popover"

// Upstream's tests/fixtures/popup-payloads.ts, inlined: it re-exports
// `describeChange` with a ".ts" path, which this build can't compile. Its
// docs are there.
const fixture = {
  menu: { triggers: ["Roadmap", "Budget"], item: "Open" },
  popover: {
    triggers: ["Ada", "Grace"],
    show: { label: "Show Linus", payload: "linus" },
  },
  dialog: { triggers: ["Invoice 1", "Invoice 2"] },
  drawer: { triggers: ["Photo 1", "Photo 2"] },
}
const contentFor = (payload: unknown) => `Actions for ${payload}`
const payloadOf = (label: string) => label.toLowerCase()

@Component({
  selector: "app-fixture",
  imports: [
    UiDialog,
    UiDialogContent,
    UiDialogTrigger,
    UiDrawer,
    UiDrawerContent,
    UiDrawerTrigger,
    UiMenu,
    UiMenuContent,
    UiMenuGroup,
    UiMenuGroupLabel,
    UiMenuItem,
    UiMenuTrigger,
    UiPopover,
    UiPopoverContent,
    UiPopoverTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container
        uiMenu
        (beforeOpenChange)="opened('menu', $event.open, $event.details)"
        (payloadChange)="
          payloadChanged('menu', $event.payload, $event.details)
        "
      >
        @for (label of fixture.menu.triggers; track label) {
          <button uiMenuTrigger [payload]="payloadOf(label)">
            {{ label }}
          </button>
        }
        <div *uiMenuContent="let state" class="popup">
          <div uiMenuGroup>
            <div uiMenuGroupLabel>{{ contentFor(state().payload) }}</div>
            <div uiMenuItem class="item" value="open">
              {{ fixture.menu.item }}
            </div>
          </div>
        </div>
      </ng-container>
      <ng-container
        uiPopover
        [controller]="people"
        (beforeOpenChange)="opened('popover', $event.open, $event.details)"
        (payloadChange)="
          payloadChanged('popover', $event.payload, $event.details)
        "
      >
        @for (label of fixture.popover.triggers; track label) {
          <button uiPopoverTrigger [payload]="payloadOf(label)">
            {{ label }}
          </button>
        }
        <div *uiPopoverContent="let state" class="popup">
          {{ contentFor(state().payload) }}
          <button
            (click)="people.open({ payload: fixture.popover.show.payload })"
          >
            {{ fixture.popover.show.label }}
          </button>
        </div>
      </ng-container>
      <ng-container
        uiDialog
        [modal]="false"
        (beforeOpenChange)="opened('dialog', $event.open, $event.details)"
        (payloadChange)="
          payloadChanged('dialog', $event.payload, $event.details)
        "
      >
        @for (label of fixture.dialog.triggers; track label) {
          <button uiDialogTrigger [payload]="payloadOf(label)">
            {{ label }}
          </button>
        }
        <div *uiDialogContent="let state" class="dialog">{{
          contentFor(state().payload)
        }}</div>
      </ng-container>
      <ng-container
        uiDrawer
        [modal]="false"
        (beforeOpenChange)="opened('drawer', $event.open, $event.details)"
        (payloadChange)="
          payloadChanged('drawer', $event.payload, $event.details)
        "
      >
        @for (label of fixture.drawer.triggers; track label) {
          <button uiDrawerTrigger [payload]="payloadOf(label)">
            {{ label }}
          </button>
        }
        <div *uiDrawerContent="let state" class="drawer">{{
          contentFor(state().payload)
        }}</div>
      </ng-container>
      <output role="status" aria-label="Last open">{{ lastOpen() }}</output>
      <output role="status" aria-label="Last payload">{{
        lastPayload()
      }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly fixture = fixture
  protected readonly contentFor = contentFor
  protected readonly payloadOf = payloadOf
  protected readonly people = createPopoverController<string>()
  protected readonly lastOpen = signal("")
  protected readonly lastPayload = signal("")

  protected opened(name: string, open: boolean, { event }: ChangeDetails) {
    if (open) {
      this.lastOpen.set(describeChange(name, "open", event))
    }
  }

  protected payloadChanged(
    name: string,
    payload: unknown,
    { event }: ChangeDetails
  ) {
    this.lastPayload.set(describeChange(name, `payload ${payload}`, event))
  }
}

export { Fixture }
