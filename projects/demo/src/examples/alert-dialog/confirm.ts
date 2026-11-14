import { Component, ElementRef, signal, viewChild } from "@angular/core"
import {
  UiAlertDialog,
  UiAlertDialogBackdrop,
  UiAlertDialogClose,
  UiAlertDialogContent,
  UiAlertDialogDescription,
  UiAlertDialogTitle,
  createConfirm,
} from "@ngx-ui-sdk/core/alert-dialog"

type Project = { name: string }

@Component({
  selector: "app-example",
  imports: [
    UiAlertDialog,
    UiAlertDialogBackdrop,
    UiAlertDialogClose,
    UiAlertDialogContent,
    UiAlertDialogDescription,
    UiAlertDialogTitle,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button
          #reset
          type="button"
          (click)="projects.set(['Acme', 'Globex', 'Initech'])"
        >
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
              (click)="remove(name, $any($event.currentTarget))"
            >
              Delete
            </button>
          </li>
        }
        @if (projects().length === 0) {
          <li data-slot="row">All projects deleted.</li>
        }
      </ul>
      <ng-container uiAlertDialog [controller]="confirm.controller">
        <div *uiAlertDialogBackdrop></div>
        <div *uiAlertDialogContent="let state">
          <div data-slot="stack">
            <h2 uiAlertDialogTitle>
              Delete {{ projectOf(state().payload)?.name }}?
            </h2>
            <p uiAlertDialogDescription>
              The project and its files will be deleted for everyone on your
              team.
            </p>
          </div>
          <div data-slot="row">
            <button uiAlertDialogClose>Cancel</button>
            <button uiAlertDialogClose data-variant="solid" value="confirm">
              Delete
            </button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly confirm = createConfirm<Project>()
  protected readonly projects = signal(["Acme", "Globex", "Initech"])
  readonly reset = viewChild.required<ElementRef<HTMLButtonElement>>("reset")

  protected projectOf(payload: unknown) {
    return payload as Project | undefined
  }

  protected async remove(name: string, button: HTMLButtonElement) {
    if (!(await this.confirm({ name }))) {
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
  }
}

export { Example }
