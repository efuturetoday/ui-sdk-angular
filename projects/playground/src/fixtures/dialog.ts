import {
  afterNextRender,
  Component,
  signal,
} from "@angular/core"
import {
  exposeDialogFixture,
  recordOpenChange,
} from "playground-fixtures/dialog/shared"
import {
  alertDialogFixture,
  alertDialogOptions,
  dialogContentOptions,
  dialogFixture,
  dialogOptions,
  dialogParts,
} from "tests/fixtures/dialog"
import {
  createConfirm,
  createDialogController,
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
  UiDialogDescription,
  UiDialogShortcut,
  UiDialogTitle,
  UiDialogTrigger,
  type DialogOpenChangeDetails,
} from "ui-sdk-angular"

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
    UiDialogDescription,
    UiDialogShortcut,
    UiDialogTitle,
    UiDialogTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container
        uiDialog
        [defaultOpen]="options.defaultOpen"
        [modal]="options.modal"
        [closeOnOutsidePress]="options.closeOnOutsidePress"
        [container]="options.container"
        [presentation]="options.presentation"
        [controller]="controller"
        (beforeOpenChange)="onOpenChange($event)"
      >
        @if (triggerShown()) {
          <button uiDialogTrigger>{{ dialogFixture.trigger }}</button>
        }
        @if (parts.backdrop) {
          <div *uiDialogBackdrop class="dialog-backdrop"></div>
        }
        <div
          *uiDialogContent="let state; initialFocus: content.initialFocus; finalFocus: content.finalFocus"
          class="dialog"
        >
          @if (parts.title) {
            <h2 uiDialogTitle class="title">{{ dialogFixture.title }}</h2>
          }
          <p uiDialogDescription class="description">{{ dialogFixture.description }}</p>
          <label class="field">
            {{ dialogFixture.field }}
            <input [value]="dialogFixture.defaultValue" />
          </label>
          @if (parts.long) {
            <p class="long">{{ dialogFixture.long }}</p>
          }
          <div class="actions">
            <button (click)="action.set('save')">{{ dialogFixture.action }}</button>
            <button uiDialogClose>{{ dialogFixture.close }}</button>
            @if (parts.removable) {
              <button (click)="triggerShown.set(false)">{{ dialogFixture.remove }}</button>
            }
          </div>
          @if (parts.form) {
            <form method="dialog">
              <button [value]="dialogFixture.form.value">{{ dialogFixture.form.label }}</button>
            </form>
          }
          @if (parts.nested) {
            <ng-container
              uiDialog
              (beforeOpenChange)="record('nested', $event)"
            >
              <button uiDialogTrigger>{{ dialogFixture.nested.trigger }}</button>
              @if (parts.backdrop) {
                <div *uiDialogBackdrop class="dialog-backdrop"></div>
              }
              <div *uiDialogContent class="dialog">
                <h2 uiDialogTitle class="title">{{ dialogFixture.nested.title }}</h2>
                <button uiDialogClose>{{ dialogFixture.nested.close }}</button>
              </div>
            </ng-container>
          }
        </div>
      </ng-container>
      <ng-container
        uiAlertDialog
        [defaultOpen]="alertOptions.defaultOpen"
        [container]="alertOptions.container"
        [controller]="confirm.controller"
      >
        <button uiAlertDialogTrigger>{{ alertDialogFixture.trigger }}</button>
        @if (parts.backdrop) {
          <div *uiAlertDialogBackdrop class="dialog-backdrop"></div>
        }
        <div *uiAlertDialogContent class="dialog">
          <h2 uiAlertDialogTitle class="title">{{ alertDialogFixture.title }}</h2>
          <p uiAlertDialogDescription class="description">{{ alertDialogFixture.description }}</p>
          <div class="actions">
            <button uiAlertDialogClose>{{ alertDialogFixture.cancel }}</button>
            <button
              uiAlertDialogClose
              [value]="'confirm'"
              (click)="action.set('delete')"
            >{{ alertDialogFixture.action }}</button>
          </div>
        </div>
      </ng-container>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <button (click)="controller.open()">Open with controller</button>
      @if (parts.shortcut) {
        <button uiDialogTrigger [controller]="controller" [shortcut]="dialogFixture.shortcut.keys">
          {{ dialogFixture.shortcut.trigger }}
          <span uiDialogShortcut></span>
        </button>
      }
    </div>
  `,
})
class Fixture {
  protected readonly dialogFixture = dialogFixture
  protected readonly alertDialogFixture = alertDialogFixture
  protected readonly options = dialogOptions() as ReturnType<
    typeof dialogOptions
  > & {
    defaultOpen?: boolean
    modal?: boolean | "trap-focus"
    closeOnOutsidePress?: boolean
    container?: HTMLElement | null
    presentation?: "auto" | "dialog" | "sheet"
  }
  protected readonly alertOptions = alertDialogOptions() as {
    defaultOpen?: boolean
    container?: HTMLElement | null
  }
  protected readonly content = dialogContentOptions() as {
    initialFocus?: "content" | "none"
    finalFocus?: "none"
  }
  protected readonly parts = dialogParts()
  protected readonly controller = createDialogController()
  protected readonly confirm = createConfirm()
  protected readonly action = signal("")
  protected readonly triggerShown = signal(true)

  constructor() {
    afterNextRender(() => exposeDialogFixture(this.controller, this.confirm))
  }


  protected onOpenChange({
    open,
    details,
  }: {
    open: boolean
    details: DialogOpenChangeDetails
  }) {
    recordOpenChange("dialog", open, details)
    if (!open && details.returnValue) {
      this.action.set(details.returnValue)
    }
  }

  protected record(
    name: string,
    { open, details }: { open: boolean; details: { reason: string } },
  ) {
    recordOpenChange(name, open, details)
  }
}

export { Fixture }
