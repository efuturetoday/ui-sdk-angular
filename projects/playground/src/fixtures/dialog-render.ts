import { Component } from "@angular/core"
import {
  UiDialog,
  UiDialogBackdrop,
  UiDialogClose,
  UiDialogContent,
  UiDialogDescription,
  UiDialogTitle,
  UiDialogTrigger,
} from "ui-sdk-angular"

@Component({
  selector: "a[app-done-link]",
  hostDirectives: [UiDialogClose],
  template: "<ng-content />",
})
class DoneLink {}

@Component({
  selector: "app-fixture",
  imports: [
    DoneLink,
    UiDialog,
    UiDialogBackdrop,
    UiDialogContent,
    UiDialogDescription,
    UiDialogTitle,
    UiDialogTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container uiDialog>
        <button uiDialogTrigger #trigger="uiDialogTrigger" [class]="trigger.state().open ? 'is-open' : 'is-closed'">
          Shipping
          <span aria-hidden="true">{{ trigger.state().open ? "▲" : "▼" }}</span>
        </button>
        <section *uiDialogBackdrop class="dialog-backdrop"></section>
        <div *uiDialogContent="let state" class="dialog">
          <span [class]="state().open ? 'is-open' : 'is-closed'" hidden></span>
          <h3 uiDialogTitle>Shipping</h3>
          <div uiDialogDescription>Arrives in two days.</div>
          <a app-done-link href="#done">Done</a>
        </div>
      </ng-container>
      <button>After</button>
    </div>
  `,
})
class Fixture {}

export { Fixture }
