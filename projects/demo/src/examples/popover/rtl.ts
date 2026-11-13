import { Component } from "@angular/core"
import {
  UiPopover,
  UiPopoverArrow,
  UiPopoverContent,
  UiPopoverDescription,
  UiPopoverTitle,
  UiPopoverTrigger,
} from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [
    UiPopover,
    UiPopoverArrow,
    UiPopoverContent,
    UiPopoverDescription,
    UiPopoverTitle,
    UiPopoverTrigger,
  ],
  template: `
    <div dir="rtl">
      <ng-container uiPopover>
        <button uiPopoverTrigger>الأبعاد</button>
        <div *uiPopoverContent="let state; align: 'start'; sideOffset: 8">
          <div uiPopoverArrow></div>
          <h2 uiPopoverTitle>الأبعاد</h2>
          <p uiPopoverDescription>اضبط أبعاد الطبقة.</p>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {}

export { Example }
