import { UiText } from "@ngx-ui-sdk/core"
import { Component, signal } from "@angular/core"
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
} from "@ngx-ui-sdk/core/pagination"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiText,
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
    <div data-slot="stack">
      <div data-slot="row">
        <p>
          Showing {{ (page() - 1) * pageSize() + 1 }}–{{
            min(page() * pageSize(), total)
          }}
          of {{ total }}
        </p>
        <label data-slot="label">
          Rows per page
          <select [value]="pageSize()" (change)="onPageSizeChange($event)">
            <option [value]="10">10</option>
            <option [value]="20">20</option>
            <option [value]="50">50</option>
          </select>
        </label>
      </div>
      <nav
        uiPagination
        [(page)]="page"
        aria-label="Pagination"
        [total]="total"
        [pageSize]="pageSize()"
        (beforePageChange)="log('Page ' + $event.page)">
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
                  uiText></button>
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
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly page = signal(2)
  protected readonly pageSize = signal(20)
  protected readonly total = 95
  protected readonly min = Math.min

  protected onPageSizeChange(event: Event) {
    const { value } = event.target as HTMLSelectElement
    this.pageSize.set(Number(value))
    this.page.set(1)
    this.log(`${value} rows per page`)
  }

  protected isNumber(item: unknown): item is number {
    return typeof item === "number"
  }
}

export { Example }
