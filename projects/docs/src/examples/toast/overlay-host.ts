import { UiText } from "@ngx-ui-sdk/core"
import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from "@angular/core"
import { LucideCircleCheck } from "@lucide/angular"
import {
  UiOverlayHost,
  UiOverlayToast,
  createOverlays,
} from "@ngx-ui-sdk/core/overlays"
import {
  createConfirm,
  UiAlertDialog,
  UiAlertDialogBackdrop,
  UiAlertDialogClose,
  UiAlertDialogContent,
  UiAlertDialogDescription,
  UiAlertDialogTitle,
  type ConfirmOptions,
} from "@ngx-ui-sdk/core/alert-dialog"
import { createToaster, UiToast, UiToastTitle } from "@ngx-ui-sdk/core/toast"

@Component({
  selector: "app-example",
  imports: [
    UiText,
    LucideCircleCheck,
    UiAlertDialog,
    UiAlertDialogBackdrop,
    UiAlertDialogClose,
    UiAlertDialogContent,
    UiAlertDialogDescription,
    UiAlertDialogTitle,
    UiOverlayHost,
    UiOverlayToast,
    UiToast,
    UiToastTitle,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button
          #reset
          type="button"
          (click)="projects.set(['Acme', 'Globex', 'Initech'])">
          Reset Projects
        </button>
      </div>
      <ul data-slot="list" aria-label="Projects">
        @for (name of projects(); track name) {
          <li data-slot="row">
            {{ name }}
            <button
              type="button"
              data-size="sm"
              [attr.aria-label]="'Delete ' + name"
              (click)="remove(name, $any($event.currentTarget))">
              Delete
            </button>
          </li>
        }
        @if (projects().length === 0) {
          <li data-slot="row">All projects deleted.</li>
        }
      </ul>
      <ui-overlay-host [overlays]="overlays">
        <ng-template uiOverlayToast let-toast>
          <li [uiToast]="toast">
            <svg lucideCircleCheck data-show="success" aria-hidden="true"></svg>
            <div *uiToastTitle uiText></div>
          </li>
        </ng-template>
      </ui-overlay-host>
      <ng-container uiAlertDialog [controller]="confirm.controller">
        <div *uiAlertDialogBackdrop></div>
        <div *uiAlertDialogContent="let state">
          <div data-slot="stack">
            <h2 uiAlertDialogTitle>{{ question(state().payload)?.title }}</h2>
            <p uiAlertDialogDescription>
              {{ question(state().payload)?.description }}
            </p>
          </div>
          <div data-slot="row">
            <button uiAlertDialogClose>
              {{ question(state().payload)?.cancelLabel }}
            </button>
            <button uiAlertDialogClose data-variant="solid" value="confirm">
              {{ question(state().payload)?.confirmLabel }}
            </button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly overlays = createOverlays()
  protected readonly toast = createToaster({ overlays: this.overlays })
  protected readonly confirm = createConfirm({ overlays: this.overlays })
  protected readonly projects = signal(["Acme", "Globex", "Initech"])
  readonly reset = viewChild.required<ElementRef<HTMLButtonElement>>("reset")

  constructor() {
    inject(DestroyRef).onDestroy(() => this.toast.dismiss())
  }

  protected question(payload: unknown) {
    return payload as Partial<ConfirmOptions> | undefined
  }

  protected async remove(name: string, button: HTMLButtonElement) {
    const confirmed = await this.confirm({
      title: `Delete ${name}?`,
      description:
        "The project and its files will be deleted for everyone on your team.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    })
    if (!confirmed) {
      return
    }
    const row = button.closest("li")
    const next = (
      row?.nextElementSibling ?? row?.previousElementSibling
    )?.querySelector("button")
    const target = next ?? this.reset().nativeElement
    target.focus()
    this.projects.update((projects) =>
      projects.filter((project) => project !== name)
    )
    this.toast.success(`${name} deleted`, { priority: "assertive" })
  }
}

export { Example }
