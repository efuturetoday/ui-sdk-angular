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
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

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
    <nav
      uiPagination
      aria-label="Pagination"
      [pageCount]="10"
      (beforePageChange)="
        log('Page ' + $event.page + ' (' + $event.details.reason + ')')
      "
    >
      <ul uiPaginationList #list="uiPaginationList">
        <li uiPaginationItem>
          <button uiPaginationPrevious data-variant="ghost">
            <svg lucideChevronLeft></svg>
            <span data-slot="visually-hidden">Previous</span>
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
            <span data-slot="visually-hidden">Next</span>
            <svg lucideChevronRight></svg>
          </button>
        </li>
      </ul>
    </nav>
  `,
})
class Example {
  protected readonly log = injectLog()

  protected isNumber(item: unknown): item is number {
    return typeof item === "number"
  }
}

export { Example }
