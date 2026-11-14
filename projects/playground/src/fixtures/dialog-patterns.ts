import {
  Component,
  type ElementRef,
  signal,
  viewChild,
} from "@angular/core"
import { dialogPatternsFixture as f } from "tests/fixtures/dialog"
import {
  injectShortcut,
} from "@ngx-ui-sdk/core"
import {
  UiAlertDialog,
  UiAlertDialogBackdrop,
  UiAlertDialogClose,
  UiAlertDialogContent,
  UiAlertDialogDescription,
  UiAlertDialogTitle,
  UiAlertDialogTrigger,
} from "@ngx-ui-sdk/core/alert-dialog"
import {
  createDialogController,
  UiDialog,
  UiDialogBackdrop,
  UiDialogClose,
  UiDialogContent,
  UiDialogShortcut,
  UiDialogTitle,
  UiDialogTrigger,
} from "@ngx-ui-sdk/core/dialog"
import {
  UiMenu,
  UiMenuContent,
  UiMenuItem,
  UiMenuTrigger,
} from "@ngx-ui-sdk/core/menu"
import {
  UiPopover,
  UiPopoverContent,
  UiPopoverTitle,
  UiPopoverTrigger,
} from "@ngx-ui-sdk/core/popover"

// Hooks upstream's shared.ts gives the specs, inlined: the open changes, the
// pending delete action, and the container the share popover renders into.
type Hooks = {
  __openChanges?: string[]
  __action?: { resolve: () => void; reject: (message: string) => void }
}
const hooks = window as unknown as Hooks
hooks.__openChanges = []
if (!document.getElementById("popover-root")) {
  const root = document.createElement("div")
  root.id = "popover-root"
  document.body.append(root)
}
const recordOpenChange = (
  name: string,
  open: boolean,
  details: { reason: string }
) => hooks.__openChanges!.push(`${name}:${open}:${details.reason}`)
const pendingAction = () =>
  new Promise<void>((resolve, reject) => {
    hooks.__action = {
      resolve,
      reject: (message) => reject(new Error(message)),
    }
  })

@Component({
  selector: "app-fixture",
  imports: [
    UiAlertDialog,
    UiAlertDialogBackdrop,
    UiAlertDialogClose,
    UiAlertDialogContent,
    UiAlertDialogDescription,
    UiAlertDialogTitle,
    UiAlertDialogTrigger,
    UiDialog,
    UiDialogBackdrop,
    UiDialogClose,
    UiDialogContent,
    UiDialogShortcut,
    UiDialogTitle,
    UiDialogTrigger,
    UiMenu,
    UiMenuContent,
    UiMenuItem,
    UiMenuTrigger,
    UiPopover,
    UiPopoverContent,
    UiPopoverTitle,
    UiPopoverTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container uiMenu>
        <button uiMenuTrigger [shortcut]="f.menu.shortcut">{{ f.menu.trigger }}</button>
        <div *uiMenuContent>
          <div uiMenuItem value="rename" [onSelect]="openRename">{{ f.menu.rename }}</div>
          <div uiMenuItem value="close">{{ f.menu.close }}</div>
        </div>
      </ng-container>
      <ng-container
        uiDialog
        [controller]="rename"
        [dismissible]="!dirty()"
        [persistentElements]="['#chat']"
        (dismissAttempt)="action.set('attempt:' + $event.reason)"
        (beforeOpenChange)="onRenameChange($event.open, $event.details)"
      >
        <button uiDialogTrigger [shortcut]="f.rename.shortcut">
          {{ f.rename.trigger }} <span uiDialogShortcut class="shortcut"></span>
        </button>
        <div *uiDialogBackdrop class="dialog-backdrop"></div>
        <div *uiDialogContent class="dialog">
          <h2 uiDialogTitle class="title">{{ f.rename.title }}</h2>
          <label class="field">
            {{ f.rename.field }}
            <input
              #field
              [value]="f.rename.defaultValue"
              (input)="dirty.set(true)"
            />
          </label>
          <button uiDialogClose>{{ f.rename.cancel }}</button>
        </div>
      </ng-container>
      <ng-container
        uiAlertDialog
        (beforeOpenChange)="recordOpenChange('delete', $event.open, $event.details)"
      >
        <button uiAlertDialogTrigger>{{ f.remove.trigger }}</button>
        <div *uiAlertDialogBackdrop class="dialog-backdrop"></div>
        <div *uiAlertDialogContent class="dialog">
          <h2 uiAlertDialogTitle class="title">{{ f.remove.title }}</h2>
          <p uiAlertDialogDescription class="description">{{ f.remove.description }}</p>
          <button uiAlertDialogClose>{{ f.remove.cancel }}</button>
          <button uiAlertDialogClose value="confirm" [action]="pendingAction">{{ f.remove.action }}</button>
        </div>
      </ng-container>
      <label>
        {{ f.search }}
        <input />
      </label>
      <button id="chat" (click)="action.set('chat')">{{ f.chat }}</button>
      <ng-container uiPopover [container]="popoverRoot">
        <button uiPopoverTrigger [shortcut]="f.share.shortcut">{{ f.share.trigger }}</button>
        <div *uiPopoverContent>
          <h2 uiPopoverTitle>{{ f.share.title }}</h2>
          <ng-container uiMenu>
            <button uiMenuTrigger>{{ f.share.menu }}</button>
            <div *uiMenuContent>
              <div uiMenuItem value="copy">{{ f.share.item }}</div>
            </div>
          </ng-container>
          <ng-container uiDialog>
            <button uiDialogTrigger>{{ f.share.dialog }}</button>
            <div *uiDialogContent class="dialog">
              <h2 uiDialogTitle class="title">{{ f.share.dialogTitle }}</h2>
              <button uiDialogClose>{{ f.share.done }}</button>
            </div>
          </ng-container>
        </div>
      </ng-container>
      <ng-container uiMenu [onAction]="onDetailsMenu">
        <button uiMenuTrigger>{{ f.details.menu }}</button>
        <div *uiMenuContent>
          <div uiMenuItem value="details">{{ f.details.item }}</div>
        </div>
      </ng-container>
      <ng-container
        uiDialog
        [open]="details()"
        (openChange)="details.set($event)"
      >
        <div *uiDialogContent class="dialog">
          <h2 uiDialogTitle class="title">{{ f.details.title }}</h2>
          <button uiDialogClose>{{ f.details.done }}</button>
        </div>
      </ng-container>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly rename = createDialogController()
  protected readonly action = signal("")
  protected readonly dirty = signal(false)
  protected readonly details = signal(false)
  protected readonly popoverRoot = document.getElementById("popover-root")
  protected readonly recordOpenChange = recordOpenChange
  protected readonly pendingAction = pendingAction
  protected readonly field = viewChild<ElementRef<HTMLInputElement>>("field")
  protected readonly openRename = () => this.rename.open()
  protected readonly onDetailsMenu = (value: string) => {
    if (value === "details") {
      this.details.set(true)
    }
  }

  constructor() {
    injectShortcut(
      () => f.pageShortcut,
      () => this.action.set("page shortcut")
    )
    injectShortcut(
      () => f.slashShortcut,
      () => this.action.set("slash")
    )
    // Belongs to the dialog, so it runs while the dialog is open and modal.
    injectShortcut(
      () => f.rename.save,
      () => this.action.set("saved"),
      () => ({
        layer: () => this.field()?.nativeElement,
        allowInInput: true,
      })
    )
  }

  protected onRenameChange(open: boolean, details: { reason: string }) {
    recordOpenChange("rename", open, details)
    if (!open) {
      this.dirty.set(false)
    }
  }
}

export { Fixture }
