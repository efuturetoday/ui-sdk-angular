import { Component } from "@angular/core"
import { UiTabs, UiTabsList, UiTabsPanel, UiTabsTab } from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [UiTabs, UiTabsList, UiTabsPanel, UiTabsTab],
  template: `
    <div uiTabs defaultValue="day" [loop]="false">
      <div uiTabsList aria-label="Range">
        @for (range of ranges; track range.value) {
          <button uiTabsTab [value]="range.value">
            {{ range.label }}
          </button>
        }
      </div>
      @for (range of ranges; track range.value) {
        <div *uiTabsPanel="range.value">
          {{ range.content }}
        </div>
      }
    </div>
  `,
})
class Example {
  protected readonly ranges = [
    {
      value: "day",
      label: "Day",
      content: "128 visitors today, up 12% from yesterday.",
    },
    {
      value: "week",
      label: "Week",
      content: "1,024 visitors this week, up 8% from last week.",
    },
    {
      value: "month",
      label: "Month",
      content: "4,210 visitors this month, down 3% from last month.",
    },
    {
      value: "year",
      label: "Year",
      content: "48,930 visitors this year, up 21% from last year.",
    },
  ]
}

export { Example }
