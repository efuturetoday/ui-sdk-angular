import { Component } from "@angular/core"
import {
  UiTabs,
  UiTabsIndicator,
  UiTabsList,
  UiTabsPanel,
  UiTabsTab,
} from "ngx-ui-sdk/tabs"

@Component({
  selector: "app-example",
  imports: [UiTabs, UiTabsIndicator, UiTabsList, UiTabsPanel, UiTabsTab],
  template: `
    <div dir="rtl">
      <div uiTabs defaultValue="account">
        <div uiTabsList aria-label="الإعدادات">
          <button uiTabsTab value="account">الحساب</button>
          <button uiTabsTab value="password">كلمة المرور</button>
          <button uiTabsTab value="notifications">الإشعارات</button>
          <span uiTabsIndicator></span>
        </div>
        <div *uiTabsPanel="'account'">عدّل اسمك وبريدك الإلكتروني وصورتك.</div>
        <div *uiTabsPanel="'password'">
          غيّر كلمة المرور وفعّل التحقق بخطوتين.
        </div>
        <div *uiTabsPanel="'notifications'">اختر ما نرسله إليك بالبريد.</div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
