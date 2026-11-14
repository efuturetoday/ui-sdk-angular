import { UiText } from "@ngx-ui-sdk/core"
import { Component, signal } from "@angular/core"
import { UiOverlayHost, UiOverlayToast } from "@ngx-ui-sdk/core/overlays"
import {
  toastDuration,
  toastFixture,
  toastOptions,
  type FixtureToast,
  usesHost,
} from "tests/fixtures/toast"
import {
  confirm,
} from "@ngx-ui-sdk/core/alert-dialog"
import {
  UiDialog,
  UiDialogClose,
  UiDialogContent,
  UiDialogTitle,
  UiDialogTrigger,
} from "@ngx-ui-sdk/core/dialog"
import {
  createToaster,
  type ToastOptions,
  UiToast,
  UiToastAction,
  UiToastClose,
  UiToastDescription,
  UiToastList,
  UiToastRegion,
  UiToastTitle,
} from "@ngx-ui-sdk/core/toast"

// The page's toaster, the buttons' handlers and `window.showToast`, as
// upstream's shared fixture has them; its imports don't compile here.
function createFixtureToasts(record: (action: string) => void) {
  const toast = createToaster<string>({ duration: toastDuration() })
  const fromFixture = ({
    title,
    description,
    action,
    pending,
    ...rest
  }: FixtureToast): ToastOptions<string> => ({
    ...rest,
    title,
    description,
    action: action
      ? {
          label: action,
          onAction: () => {
            record(`action:${action}`)
            return pending
              ? new Promise((resolve) => setTimeout(resolve, pending))
              : undefined
          },
        }
      : undefined,
  })
  Object.assign(window, {
    showToast: (options: FixtureToast) => toast(fromFixture(options)),
    toaster: toast,
  })
  const { basic, success, error, promise } = toastFixture
  return {
    toast,
    basic: () =>
      toast(
        fromFixture({
          title: basic.title,
          description: basic.description,
          action: basic.action,
        })
      ),
    success: () => toast.success(success.title),
    error: () => toast.error(error.title, { description: error.description }),
    promise: () => {
      const params = new URLSearchParams(location.search)
      const delay = Number(params.get("promise-delay") ?? 1000)
      const fails = params.has("promise-fails")
      toast.promise(
        new Promise((resolve, reject) =>
          setTimeout(() => (fails ? reject() : resolve(undefined)), delay)
        ),
        { loading: promise.loading, success: promise.success, error: promise.error }
      )
    },
  }
}

@Component({
  selector: "app-fixture",
  imports: [UiText, 
    UiOverlayHost,
    UiOverlayToast,
    UiDialog,
    UiDialogClose,
    UiDialogContent,
    UiDialogTitle,
    UiDialogTrigger,
    UiToast,
    UiToastAction,
    UiToastClose,
    UiToastDescription,
    UiToastList,
    UiToastRegion,
    UiToastTitle,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <button (click)="toasts.basic()">{{ f.basic.trigger }}</button>
      <button (click)="toasts.success()">{{ f.success.trigger }}</button>
      <button (click)="toasts.error()">{{ f.error.trigger }}</button>
      <button (click)="toasts.promise()">{{ f.promise.trigger }}</button>
      <ng-container uiDialog>
        <button uiDialogTrigger>{{ f.dialog.trigger }}</button>
        <div *uiDialogContent class="dialog">
          <h2 uiDialogTitle class="title">{{ f.dialog.title }}</h2>
          <button (click)="toasts.basic()">{{ f.dialog.toast }}</button>
          <button uiDialogClose>{{ f.dialog.close }}</button>
        </div>
      </ng-container>
      @if (host) {
        <button (click)="ask()">{{ f.confirm.trigger }}</button>
      }
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      @if (host) {
        <ui-overlay-host [toast]="{ ...options, class: 'toast-region' }">
          <ng-template uiOverlayToast let-toast>
            <li [uiToast]="toast" class="toast">
              <div *uiToastTitle uiText></div>
              <div *uiToastDescription uiText></div>
              <button *uiToastAction uiText></button>
              @if (toast.cancel; as cancel) {
                <button uiToastClose [action]="cancel.onCancel">{{ cancel.label }}</button>
              }
            </li>
          </ng-template>
        </ui-overlay-host>
      } @else {
      <section
        uiToastRegion
        #region="uiToastRegion"
        class="toast-region"
        [toaster]="toasts.toast"
        [side]="options.side"
        [align]="options.align"
        [maxVisible]="options.maxVisible"
        [expanded]="options.expanded"
        [shortcut]="options.shortcut"
      >
        <ol uiToastList>
          @for (item of region.state().toasts; track item.toast.id) {
            <li [uiToast]="item.toast" class="toast">
              <div *uiToastTitle class="toast-title" uiText></div>
              <div *uiToastDescription class="toast-description" uiText></div>
              <button *uiToastAction class="toast-action" uiText></button>
              <button uiToastClose class="toast-close">{{ f.dismiss }}</button>
            </li>
          }
        </ol>
      </section>
      }
    </div>
  `,
})
class Fixture {
  protected readonly f = toastFixture
  protected readonly action = signal("")
  protected readonly toasts = createFixtureToasts((value) =>
    this.action.set(value)
  )
  protected readonly host = usesHost()
  protected readonly options = toastOptions() as {
    side?: "top" | "bottom"
    align?: "start" | "center" | "end"
    maxVisible?: number
    expanded?: boolean
    shortcut?: string | null
  }

  protected async ask() {
    const { title, confirm: confirmLabel, cancel } = toastFixture.confirm
    const yes = await confirm({ title, confirmLabel, cancelLabel: cancel })
    this.action.set(yes ? "confirmed" : "declined")
  }
}

export { Fixture }
