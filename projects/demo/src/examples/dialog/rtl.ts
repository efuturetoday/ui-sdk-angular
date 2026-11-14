import { Component } from "@angular/core"
import {
  UiDialog,
  UiDialogBackdrop,
  UiDialogClose,
  UiDialogContent,
  UiDialogDescription,
  UiDialogTitle,
  UiDialogTrigger,
} from "ngx-ui-sdk"

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
    <div dir="rtl">
      <ng-container uiDialog>
        <button uiDialogTrigger>تعديل الملف الشخصي</button>
        <div *uiDialogBackdrop></div>
        <div *uiDialogContent>
          <div data-slot="stack">
            <h2 uiDialogTitle>تعديل الملف الشخصي</h2>
            <p uiDialogDescription>أجرِ التغييرات على ملفك الشخصي هنا.</p>
          </div>
          <label data-slot="label">
            الاسم
            <input value="بيدرو دوارتي" />
          </label>
          <div data-slot="row">
            <button uiDialogClose>إلغاء</button>
            <button uiDialogClose data-variant="solid" value="save">حفظ</button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {}

export { Example }
