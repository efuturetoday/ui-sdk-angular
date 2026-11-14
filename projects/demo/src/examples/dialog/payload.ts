import { Component } from "@angular/core"
import {
  createDialogController,
  type DialogOpenChangeDetails,
  UiDialog,
  UiDialogBackdrop,
  UiDialogClose,
  UiDialogContent,
  UiDialogDescription,
  UiDialogTitle,
  UiDialogTrigger,
} from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

type Invoice = {
  id: string
  customer: string
  amount: string
  status: "Paid" | "Due"
}

@Component({
  selector: "app-example",
  imports: [
    UiDialog,
    UiDialogBackdrop,
    UiDialogClose,
    UiDialogContent,
    UiDialogDescription,
    UiDialogTitle,
    UiDialogTrigger,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="remindFromCode()">Open from Code</button>
      </div>
      <ul data-slot="list">
        @for (invoice of invoices; track invoice.id) {
          <li data-slot="row">
            {{ invoice.customer }}
            <span data-slot="hint"
              >{{ invoice.amount }} · {{ invoice.status }}</span
            >
            <button
              uiDialogTrigger
              [controller]="reminder"
              [payload]="invoice"
              [disabled]="invoice.status === 'Paid'"
              [attr.aria-label]="'Remind ' + invoice.customer"
            >
              Remind
            </button>
          </li>
        }
      </ul>
      <ng-container
        uiDialog
        [controller]="reminder"
        (beforeOpenChange)="onOpenChange($event.open, $event.details)"
      >
        <div *uiDialogBackdrop></div>
        <div *uiDialogContent="let state">
          <div data-slot="stack">
            <h2 uiDialogTitle>
              Remind {{ invoiceOf(state().payload)?.customer }}
            </h2>
            <p uiDialogDescription>
              {{ invoiceOf(state().payload)?.id }} for
              {{ invoiceOf(state().payload)?.amount }} is due. We'll email the
              billing contact.
            </p>
          </div>
          <div data-slot="row">
            <button uiDialogClose>Cancel</button>
            <button uiDialogClose data-variant="solid" value="send">
              Send reminder
            </button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly invoices: Invoice[] = [
    { id: "INV-001", customer: "Acme", amount: "$250.00", status: "Paid" },
    { id: "INV-002", customer: "Globex", amount: "$150.00", status: "Due" },
    { id: "INV-003", customer: "Initech", amount: "$350.00", status: "Due" },
  ]
  protected readonly reminder = createDialogController<Invoice, "send">()
  protected readonly log = injectLog()

  protected invoiceOf(payload: unknown) {
    return payload as Invoice | undefined
  }

  protected async remindFromCode() {
    const { reason, returnValue } = await this.reminder.open({
      payload: this.invoices[2],
    })
    this.log(
      returnValue === "send" ? "Reminder sent from code" : `Closed (${reason})`
    )
  }

  protected onOpenChange(open: boolean, details: DialogOpenChangeDetails) {
    if (!open && details.returnValue === "send") {
      this.log("Reminder sent")
    }
  }
}

export { Example }
