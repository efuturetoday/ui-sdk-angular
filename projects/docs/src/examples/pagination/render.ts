import { Component } from "@angular/core"
import { LucideArrowLeft, LucideArrowRight } from "@lucide/angular"
import {
  UiPagination,
  UiPaginationEllipsis,
  UiPaginationItem,
  UiPaginationLink,
  UiPaginationList,
  UiPaginationNext,
  UiPaginationPrevious,
} from "@ngx-ui-sdk/core/pagination"

@Component({
  selector: "app-example",
  imports: [
    LucideArrowLeft,
    LucideArrowRight,
    UiPagination,
    UiPaginationEllipsis,
    UiPaginationItem,
    UiPaginationLink,
    UiPaginationList,
    UiPaginationNext,
    UiPaginationPrevious,
  ],
  template: `
    <nav uiPagination aria-label="Pagination" [pageCount]="10">
      <ul uiPaginationList #list="uiPaginationList">
        <li uiPaginationItem>
          <button
            uiPaginationPrevious
            #previous="uiPaginationPrevious"
            aria-label="Previous page"
            [title]="
              previous.state().disabled
                ? undefined
                : 'Go to page ' + previous.state().page
            "
          >
            <svg lucideArrowLeft aria-hidden="true"></svg>
            @if (!previous.state().disabled) {
              <span aria-hidden="true">{{ previous.state().page }}</span>
            }
          </button>
        </li>
        @for (item of list.state().items; track item) {
          <li uiPaginationItem>
            @if (isNumber(item)) {
              <button uiPaginationLink #link="uiPaginationLink" [page]="item">
                {{
                  link.state().current
                    ? "Page " + link.state().page
                    : link.state().page
                }}
              </button>
            } @else {
              <span uiPaginationEllipsis></span>
            }
          </li>
        }
        <li uiPaginationItem>
          <button
            uiPaginationNext
            #next="uiPaginationNext"
            aria-label="Next page"
            [title]="
              next.state().disabled
                ? undefined
                : 'Go to page ' + next.state().page
            "
          >
            @if (!next.state().disabled) {
              <span aria-hidden="true">{{ next.state().page }}</span>
            }
            <svg lucideArrowRight aria-hidden="true"></svg>
          </button>
        </li>
      </ul>
    </nav>
  `,
})
class Example {
  protected isNumber(item: unknown): item is number {
    return typeof item === "number"
  }
}

export { Example }
