import { Component } from "@angular/core"
import {
  UiDrawer,
  UiDrawerBackdrop,
  UiDrawerClose,
  UiDrawerContent,
  UiDrawerDescription,
  UiDrawerTitle,
  UiDrawerTrigger,
} from "@ngx-ui-sdk/core/drawer"

@Component({
  selector: "app-example",
  imports: [
    UiDrawer,
    UiDrawerBackdrop,
    UiDrawerClose,
    UiDrawerContent,
    UiDrawerDescription,
    UiDrawerTitle,
    UiDrawerTrigger,
  ],
  template: `
    <div dir="rtl">
      <ng-container uiDrawer side="start">
        <button uiDrawerTrigger>القائمة</button>
        <div *uiDrawerBackdrop></div>
        <div *uiDrawerContent>
          <div data-slot="stack">
            <h2 uiDrawerTitle>القائمة</h2>
            <p uiDrawerDescription>اسحبها نحو حافتها لإغلاقها.</p>
          </div>
          <nav aria-label="الأقسام">
            <ul>
              @for (link of links; track link) {
                <li>
                  <a href="https://example.com">{{ link }}</a>
                </li>
              }
            </ul>
          </nav>
          <button uiDrawerClose data-variant="solid">إغلاق</button>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly links = [
    "الرئيسية",
    "الطلبات",
    "المنتجات",
    "العملاء",
    "الإعدادات",
  ]
}

export { Example }
