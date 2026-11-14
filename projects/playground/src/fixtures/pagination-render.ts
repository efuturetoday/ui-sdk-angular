import { Component, Directive, inject, signal } from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  UiPagination,
  UiPaginationItem,
  UiPaginationLink,
  UiPaginationList,
  UiPaginationNext,
  UiPaginationPrevious,
} from "ngx-ui-sdk/pagination"

// A client-side router: links navigate without a page load, unless a handler
// before it prevented that. A directive on the link itself runs before core's,
// so it listens around the links, as upstream's web components fixture does.
@Directive({
  selector: "[uiRouter]",
  host: { "(click)": "navigate($event)" },
})
class Router {
  protected navigate(event: MouseEvent) {
    const link = (event.target as Element).closest("a[href]")
    if (!link || event.defaultPrevented) {
      return
    }
    event.preventDefault()
    history.pushState(null, "", link.getAttribute("href"))
  }
}

// A class on the link's own element reads its state only from a host binding,
// which runs after the link's `ngOnInit`, once its required `page` is set.
@Component({
  selector: "a[app-page-link]",
  hostDirectives: [
    { directive: UiPaginationLink, inputs: ["page"] },
  ],
  host: {
    "[class]": "'pagination-link ' + (link.state().current ? 'is-active' : 'is-inactive')",
  },
  template: `{{ link.state().page }}@if (link.state().current) {
    <span aria-hidden="true">•</span>
  }`,
})
class PageLink {
  protected readonly link = inject(UiPaginationLink)
}

@Component({
  selector: "app-fixture",
  imports: [
    PageLink,
    Router,
    UiPagination,
    UiPaginationItem,
    UiPaginationList,
    UiPaginationNext,
    UiPaginationPrevious,
  ],
  template: `
    <div class="fixture" uiRouter>
      <button>Before</button>
      <nav
        uiPagination
        aria-label="Results pages"
        [pageCount]="5"
        [getHref]="getHref"
        (beforePageChange)="onPageChange($event.page, $event.details)"
      >
        <ul uiPaginationList #list="uiPaginationList" class="pagination-list">
          <li uiPaginationItem>
            <a uiPaginationPrevious class="pagination-step">Previous</a>
          </li>
          @for (item of list.state().items; track item) {
            <li uiPaginationItem>
              <a app-page-link [page]="$any(item)"></a>
            </li>
          }
          <li uiPaginationItem>
            <a uiPaginationNext class="pagination-step">Next</a>
          </li>
        </ul>
      </nav>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly action = signal("")
  protected readonly getHref = (page: number) => `#results-${page}`

  protected onPageChange(page: number, details: ChangeDetails) {
    if (page === 4) {
      return details.cancel()
    }
    this.action.set(`page: ${page}`)
  }
}

export { Fixture }
