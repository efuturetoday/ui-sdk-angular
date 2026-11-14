import { Component, signal } from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  paginationAction,
  paginationFixture as f,
  paginationOptions,
} from "tests/fixtures/pagination"
import {
  createPaginationController,
  UiPagination,
  UiPaginationEllipsis,
  UiPaginationFirst,
  UiPaginationItem,
  UiPaginationLast,
  UiPaginationLink,
  UiPaginationList,
  UiPaginationNext,
  UiPaginationPrevious,
} from "ngx-ui-sdk/pagination"

@Component({
  selector: "app-fixture",
  imports: [
    UiPagination,
    UiPaginationEllipsis,
    UiPaginationFirst,
    UiPaginationItem,
    UiPaginationLast,
    UiPaginationLink,
    UiPaginationList,
    UiPaginationNext,
    UiPaginationPrevious,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <nav
        uiPagination
        [attr.aria-label]="f.label"
        class="pagination"
        [controller]="pages"
        [pageCount]="options.pageCount"
        [siblings]="options.siblings"
        [boundaries]="options.boundaries"
        [getHref]="options.getHref"
        [page]="options.controlled ? page() : undefined"
        [defaultPage]="options.controlled ? undefined : options.defaultPage"
        (beforePageChange)="onPageChange($event.page, $event.details)"
      >
        @for (key of [options.rekey ? page() : 0]; track key) {
          <ul uiPaginationList #list="uiPaginationList" class="pagination-list">
            <li uiPaginationItem>
              @if (options.getHref) {
                <a uiPaginationFirst class="pagination-step" [attr.aria-label]="f.first">«</a>
              } @else {
                <button uiPaginationFirst class="pagination-step" [attr.aria-label]="f.first">«</button>
              }
            </li>
            <li uiPaginationItem>
              @if (options.getHref) {
                <a uiPaginationPrevious class="pagination-step" [attr.aria-label]="f.previous">‹</a>
              } @else {
                <button uiPaginationPrevious class="pagination-step" [attr.aria-label]="f.previous">‹</button>
              }
            </li>
            @for (item of list.state().items; track item) {
              <li uiPaginationItem>
                @if (isNumber(item)) {
                  @if (options.getHref) {
                    <a uiPaginationLink class="pagination-link" [page]="item"></a>
                  } @else {
                    <button uiPaginationLink class="pagination-link" [page]="item"></button>
                  }
                } @else {
                  <span uiPaginationEllipsis class="pagination-ellipsis"></span>
                }
              </li>
            }
            <li uiPaginationItem>
              @if (options.getHref) {
                <a uiPaginationNext class="pagination-step" [attr.aria-label]="f.next">›</a>
              } @else {
                <button uiPaginationNext class="pagination-step" [attr.aria-label]="f.next">›</button>
              }
            </li>
            <li uiPaginationItem>
              @if (options.getHref) {
                <a uiPaginationLast class="pagination-step" [attr.aria-label]="f.last">»</a>
              } @else {
                <button uiPaginationLast class="pagination-step" [attr.aria-label]="f.last">»</button>
              }
            </li>
          </ul>
        }
      </nav>
      <button (click)="pages.setPage(f.controller.page)">{{ f.controller.label }}</button>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly options = paginationOptions()
  protected readonly pages = createPaginationController()
  protected readonly action = signal("")
  protected readonly page = signal(this.options.defaultPage ?? 1)

  protected isNumber(item: unknown): item is number {
    return typeof item === "number"
  }

  protected onPageChange(next: number, details: ChangeDetails) {
    if (next === this.options.cancel) {
      return details.cancel()
    }
    this.page.set(next)
    this.action.set(paginationAction(next, details.reason))
  }
}

export { Fixture }
