import { Component } from "@angular/core"
import {
  UiAlertDialog,
  UiAlertDialogBackdrop,
  UiAlertDialogClose,
  UiAlertDialogContent,
  UiAlertDialogDescription,
  UiAlertDialogTitle,
  UiAlertDialogTrigger,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    UiAlertDialog,
    UiAlertDialogBackdrop,
    UiAlertDialogClose,
    UiAlertDialogContent,
    UiAlertDialogDescription,
    UiAlertDialogTitle,
    UiAlertDialogTrigger,
  ],
  template: `
    <div dir="rtl">
      <ng-container uiAlertDialog>
        <button uiAlertDialogTrigger>حذف الحساب</button>
        <div *uiAlertDialogBackdrop></div>
        <div *uiAlertDialogContent>
          <div data-slot="stack">
            <h2 uiAlertDialogTitle>هل أنت متأكد تمامًا؟</h2>
            <p uiAlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء. سيؤدي إلى حذف حسابك نهائيًا.
            </p>
          </div>
          <div data-slot="row">
            <button uiAlertDialogClose>إلغاء</button>
            <button uiAlertDialogClose data-variant="solid" value="confirm">
              متابعة
            </button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {}

export { Example }
