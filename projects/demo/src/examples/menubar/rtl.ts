import { Component } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import {
  UiMenu,
  UiMenuContent,
  UiMenuItem,
  UiMenuSub,
  UiMenuSubTrigger,
  UiMenuTrigger,
  UiMenubar,
} from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [
    LucideChevronRight,
    UiMenu,
    UiMenuContent,
    UiMenuItem,
    UiMenuSub,
    UiMenuSubTrigger,
    UiMenuTrigger,
    UiMenubar,
  ],
  template: `
    <div dir="rtl">
      <div uiMenubar>
        <ng-container uiMenu>
          <button uiMenuTrigger>ملف</button>
          <div *uiMenuContent="let state">
            <div uiMenuItem>علامة تبويب جديدة</div>
            <ng-container uiMenuSub>
              <div uiMenuSubTrigger>
                مشاركة
                <svg lucideChevronRight></svg>
              </div>
              <div *uiMenuSubContent>
                <div uiMenuItem>البريد الإلكتروني</div>
                <div uiMenuItem>الرسائل</div>
              </div>
            </ng-container>
          </div>
        </ng-container>
        <ng-container uiMenu>
          <button uiMenuTrigger>تحرير</button>
          <div *uiMenuContent="let state">
            <div uiMenuItem>تراجع</div>
            <div uiMenuItem>إعادة</div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
