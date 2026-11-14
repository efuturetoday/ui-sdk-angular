import { Component } from "@angular/core"
import {
  createToaster,
  UiToast,
  UiToastDescription,
  UiToastList,
  UiToastRegion,
  UiToastTitle,
} from "@ngx-ui-sdk/core/toast"

@Component({
  selector: "app-example",
  imports: [
    UiToast,
    UiToastDescription,
    UiToastList,
    UiToastRegion,
    UiToastTitle,
  ],
  template: `
    <div dir="rtl">
      <button
        (click)="
          toast('تم إنشاء الحدث', {
            description: 'الأحد 3 ديسمبر الساعة 9:00 صباحًا',
          })
        "
      >
        إظهار الإشعار
      </button>
      <section uiToastRegion #region="uiToastRegion" [toaster]="toast">
        <ol uiToastList>
          @for (item of region.state().toasts; track item.toast.id) {
            <li [uiToast]="item.toast">
              <div data-slot="stack">
                <div *uiToastTitle></div>
                <div *uiToastDescription></div>
              </div>
            </li>
          }
        </ol>
      </section>
    </div>
  `,
})
class Example {
  protected readonly toast = createToaster()
}

export { Example }
