import { NgComponentOutlet, NgTemplateOutlet } from "@angular/common"
import {
  afterNextRender,
  Component,
  computed,
  contentChild,
  DestroyRef,
  Directive,
  forwardRef,
  inject,
  InjectionToken,
  Injector,
  input,
  signal,
  TemplateRef,
  type OnInit,
  type Provider,
  type Signal,
  type Type,
} from "@angular/core"
import type { ConfirmEntry, ConfirmOptions } from "@ui-sdk/core/dialog"
import {
  overlays as sharedOverlays,
  type OverlayEntry,
  type Overlays,
} from "@ui-sdk/core/overlays"
import { toasterInternals } from "@ui-sdk/core/renderer"
import type { Toast, Toaster, ToastItem } from "@ui-sdk/core/toast"
import {
  UiAlertDialog,
  UiAlertDialogClose,
  UiAlertDialogContent,
  UiAlertDialogDescription,
  UiAlertDialogTitle,
  UiToast,
  UiToastAction,
  UiToastClose,
  UiToastDescription,
  UiToastList,
  UiToastRegion,
  UiToastTitle,
} from "ngx-ui-sdk"

/**
 * Options for the toast regions the overlay host renders, like `side` and `class`.
 * @experimental
 */
type OverlayHostToastOptions = {
  side?: "top" | "bottom"
  align?: "start" | "center" | "end"
  maxVisible?: number
  expanded?: boolean
  shortcut?: string | null
  class?: string
}

/**
 * The context of a host's toast template: `let-toast` is the toast, `let-item`
 * its place in the stack.
 * @experimental
 */
type OverlayToastContext = {
  $implicit: Toast<any>
  item: ToastItem<any>
}

/**
 * Renders each toast of the host's regions, instead of the host's own markup:
 * `<ng-template uiOverlayToast let-toast><li [uiToast]="toast">…</li></ng-template>`.
 * @experimental
 */
@Directive({ selector: "ng-template[uiOverlayToast]" })
class UiOverlayToast {
  readonly template = inject<TemplateRef<OverlayToastContext>>(TemplateRef)

  static ngTemplateContextGuard(
    _directive: UiOverlayToast,
    _context: unknown
  ): _context is OverlayToastContext {
    return true
  }
}

// The injector of the element it's on, so a template written elsewhere, like
// the app's toast, renders its parts inside the host's region.
@Directive({ selector: "[uiHostInjector]", exportAs: "uiHostInjector" })
class HostInjector {
  readonly injector = inject(Injector)
}

// What the host gives its renderers: the options and the template for toasts.
abstract class OverlayHostContext {
  abstract readonly toast: Signal<OverlayHostToastOptions | undefined>
  abstract readonly custom: Signal<UiOverlayToast | undefined>
}

// A toaster's region, unless the app placed one of its own.
@Component({
  selector: "ui-hosted-toaster",
  imports: [
    HostInjector,
    NgTemplateOutlet,
    UiToast,
    UiToastAction,
    UiToastClose,
    UiToastDescription,
    UiToastList,
    UiToastRegion,
    UiToastTitle,
  ],
  template: `
    @if (!placed()) {
      <section
        uiToastRegion
        hosted
        #region="uiToastRegion"
        uiHostInjector
        #scope="uiHostInjector"
        [toaster]="toaster()"
        [side]="options()?.side"
        [align]="options()?.align"
        [maxVisible]="options()?.maxVisible"
        [expanded]="options()?.expanded"
        [shortcut]="options()?.shortcut"
        [class]="options()?.class"
      >
        <ol uiToastList>
          @for (item of region.state().toasts; track item.toast.id) {
            @if (template(); as template) {
              <ng-container
                [ngTemplateOutlet]="template"
                [ngTemplateOutletContext]="{ $implicit: item.toast, item }"
                [ngTemplateOutletInjector]="scope.injector"
              />
            } @else {
              <li [uiToast]="item.toast">
                <div>
                  <div *uiToastTitle></div>
                  <div *uiToastDescription></div>
                </div>
                <button *uiToastAction></button>
                @if (item.toast.cancel; as cancel) {
                  <button uiToastClose [action]="cancel.onCancel">
                    {{ cancel.label }}
                  </button>
                }
              </li>
            }
          }
        </ol>
      </section>
    }
  `,
  styles: ":host { display: contents }",
})
class HostedToaster {
  readonly entry = input.required<OverlayEntry>()
  readonly #host = inject(OverlayHostContext)
  protected readonly toaster = computed(
    () => (this.entry().data as { toaster: Toaster<any> }).toaster
  )
  protected readonly options = this.#host.toast
  protected readonly template = computed(() => this.#host.custom()?.template)
  readonly #placed = signal(false)
  protected readonly placed = this.#placed.asReadonly()

  constructor() {
    const check = () =>
      this.#placed.set(toasterInternals(this.toaster()).hasPlacedRegion())
    const destroyRef = inject(DestroyRef)
    afterNextRender(() => {
      check()
      destroyRef.onDestroy(this.toaster().subscribe(check))
    })
  }
}

// The alert dialog `confirm()` asks with.
@Component({
  selector: "ui-hosted-confirm",
  imports: [
    UiAlertDialog,
    UiAlertDialogClose,
    UiAlertDialogContent,
    UiAlertDialogDescription,
    UiAlertDialogTitle,
  ],
  template: `
    <ng-container
      uiAlertDialog
      [controller]="confirmEntry().controller"
      (openChangeComplete)="!$event && confirmEntry().done()"
    >
      <div *uiAlertDialogContent>
        <h2 uiAlertDialogTitle>{{ question().title }}</h2>
        @if (question().description) {
          <p uiAlertDialogDescription>{{ question().description }}</p>
        }
        <div>
          <button uiAlertDialogClose>
            {{ question().cancelLabel ?? "Cancel" }}
          </button>
          <button uiAlertDialogClose value="confirm">
            {{ question().confirmLabel ?? "Continue" }}
          </button>
        </div>
      </div>
    </ng-container>
  `,
  styles: ":host { display: contents }",
})
class HostedConfirm {
  readonly entry = input.required<OverlayEntry>()

  constructor() {
    // The alert dialog attached the controller as it rendered, so it can open now.
    afterNextRender(() => this.confirmEntry().open())
  }

  protected confirmEntry() {
    return this.entry().data as ConfirmEntry
  }

  protected question() {
    return (this.confirmEntry().payload ?? {}) as Partial<ConfirmOptions>
  }
}

/**
 * Renders the overlays of one type, given each `entry` as an input, like the
 * `"toaster"` and `"confirm"` that `toast()` and `confirm()` open. Add one for
 * a type of your own with `provideOverlayRenderer`; the host stays as it is.
 * @experimental
 */
const defaultRenderers = { toaster: HostedToaster, confirm: HostedConfirm }

const OVERLAY_RENDERERS = new InjectionToken<
  Readonly<Record<string, Type<unknown>>>
>("overlay-renderers", {
  providedIn: "root",
  factory: () => defaultRenderers,
})

/**
 * Renders the overlays of `type` with `component`, which takes the entry as
 * its `entry` input. Put it in the app's or the host's `providers`.
 * @experimental
 */
function provideOverlayRenderer(type: string, component: Type<unknown>) {
  return {
    provide: OVERLAY_RENDERERS,
    useFactory: () => ({
      ...(inject(OVERLAY_RENDERERS, { skipSelf: true, optional: true }) ??
        defaultRenderers),
      [type]: component,
    }),
  } satisfies Provider
}

/**
 * Renders what `toast()` and `confirm()` open, from anywhere in the app. Mount
 * it once, near the root. A `uiToastRegion` you place yourself takes over its
 * toaster. Give its regions options with `toast`, and its toasts markup of
 * your own with an `<ng-template uiOverlayToast let-toast>` inside it.
 * @experimental
 */
@Component({
  selector: "ui-overlay-host",
  imports: [NgComponentOutlet],
  providers: [
    {
      provide: OverlayHostContext,
      useExisting: forwardRef(() => UiOverlayHost),
    },
  ],
  template: `
    @for (entry of entries(); track entry.id) {
      @if (renderers[entry.type]; as renderer) {
        <ng-container *ngComponentOutlet="renderer; inputs: { entry }" />
      }
    }
  `,
  styles: ":host { display: contents }",
})
class UiOverlayHost implements OnInit, OverlayHostContext {
  /** The registry it renders; the shared one `toast()` and `confirm()` open into by default. */
  readonly overlays = input<Overlays>()
  /** Options for its toast regions, like `side` and `class`. */
  readonly toast = input<OverlayHostToastOptions>()
  readonly custom = contentChild(UiOverlayToast)
  protected readonly renderers = inject(OVERLAY_RENDERERS)
  readonly #entries = signal<readonly OverlayEntry[]>([])
  protected readonly entries = this.#entries.asReadonly()
  readonly #destroyRef = inject(DestroyRef)

  constructor() {
    // Counted only in the browser, once rendered.
    afterNextRender(() => {
      const release = this.#registry().attachHost()
      this.#destroyRef.onDestroy(release)
    })
  }

  ngOnInit() {
    const registry = this.#registry()
    this.#entries.set(registry.entries())
    this.#destroyRef.onDestroy(
      registry.subscribe(() => this.#entries.set(registry.entries()))
    )
  }

  #registry() {
    return this.overlays() ?? sharedOverlays
  }
}

export {
  OVERLAY_RENDERERS,
  type OverlayHostToastOptions,
  type OverlayToastContext,
  provideOverlayRenderer,
  UiOverlayHost,
  UiOverlayToast,
}
