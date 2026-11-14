import { Component, signal } from "@angular/core"
import {
  LucideChevronRight,
  LucideFile,
  LucideFolder,
  LucideLink,
  LucideMail,
  LucideShare,
  LucideTrash,
} from "@lucide/angular"
import {
  UiMenu,
  UiMenuContent,
  UiMenuItem,
  UiMenuSeparator,
  UiMenuShortcut,
  UiMenuSub,
  UiMenuSubTrigger,
  UiMenuTrigger,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    LucideChevronRight,
    LucideFile,
    LucideFolder,
    LucideLink,
    LucideMail,
    LucideShare,
    LucideTrash,
    UiMenu,
    UiMenuContent,
    UiMenuItem,
    UiMenuSeparator,
    UiMenuShortcut,
    UiMenuSub,
    UiMenuSubTrigger,
    UiMenuTrigger,
  ],
  template: `
    <div dir="rtl" data-slot="stack">
      <ng-container uiMenu [onAction]="onAction">
        <button uiMenuTrigger>ملف</button>
        <div *uiMenuContent="let state">
          <div uiMenuItem value="new" shortcut="mod+n">
            <svg lucideFile></svg>
            جديد
            <span uiMenuShortcut></span>
          </div>
          <div uiMenuItem value="open" shortcut="mod+o">
            <svg lucideFolder></svg>
            فتح…
            <span uiMenuShortcut></span>
          </div>
          <div uiMenuSeparator></div>
          <ng-container uiMenuSub>
            <div uiMenuSubTrigger>
              <svg lucideShare></svg>
              مشاركة
              <svg lucideChevronRight></svg>
            </div>
            <div *uiMenuSubContent>
              <div uiMenuItem value="email">
                <svg lucideMail></svg>
                البريد الإلكتروني
              </div>
              <div uiMenuItem value="copy-link">
                <svg lucideLink></svg>
                نسخ الرابط
              </div>
            </div>
          </ng-container>
          <div uiMenuSeparator></div>
          <div uiMenuItem value="delete">
            <svg lucideTrash></svg>
            حذف
          </div>
        </div>
      </ng-container>
      <output data-slot="output">{{
        action() ? "نُفّذ: " + action() : "اختر عنصرًا"
      }}</output>
    </div>
  `,
})
class Example {
  protected readonly action = signal("")
  protected readonly onAction = (value: string) => this.action.set(value)
}

export { Example }
