import { Component } from "@angular/core"
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideEllipsis,
} from "@lucide/angular"
import {
  UiPagination,
  UiPaginationEllipsis,
  UiPaginationItem,
  UiPaginationLink,
  UiPaginationList,
  UiPaginationNext,
  UiPaginationPrevious,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    LucideChevronLeft,
    LucideChevronRight,
    LucideEllipsis,
    UiPagination,
    UiPaginationEllipsis,
    UiPaginationItem,
    UiPaginationLink,
    UiPaginationList,
    UiPaginationNext,
    UiPaginationPrevious,
  ],
  template: `
    <div dir="rtl">
      <nav uiPagination aria-label="ترقيم الصفحات" [pageCount]="10">
        <ul uiPaginationList #list="uiPaginationList">
          <li uiPaginationItem>
            <button uiPaginationPrevious data-variant="ghost">
              <svg lucideChevronLeft></svg>
              <span data-slot="visually-hidden">السابق</span>
            </button>
          </li>
          @for (item of list.state().items; track item) {
            <li uiPaginationItem>
              @if (isNumber(item)) {
                <button
                  uiPaginationLink
                  data-variant="ghost"
                  [page]="item"
                ></button>
              } @else {
                <span uiPaginationEllipsis><svg lucideEllipsis></svg></span>
              }
            </li>
          }
          <li uiPaginationItem>
            <button uiPaginationNext data-variant="ghost">
              <span data-slot="visually-hidden">التالي</span>
              <svg lucideChevronRight></svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  `,
})
class Example {
  protected isNumber(item: unknown): item is number {
    return typeof item === "number"
  }
}

export { Example }
