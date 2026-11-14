import { Component, Directive, ElementRef, inject, signal } from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  UiPagination,
  UiPaginationItem,
  UiPaginationLink,
  UiPaginationList,
  UiPaginationNext,
  UiPaginationPrevious,
} from "ui-sdk-angular"

// A client-side router's link: it navigates without a page load, unless a
// handler before it prevented that.
@Directive({
  selector: "a[uiRouterLink]",
  host: { "(click)": "navigate($event)" },
})
class RouterLink {
  readonly #el = inject<ElementRef<HTMLAnchorElement>>(ElementRef)

  protected navigate(event: MouseEvent) {
    if (event.defaultPrevented) {
      return
    }
    event.preventDefault()
    history.pushState(null, "", this.#el.nativeElement.getAttribute("href"))
  }
}

// A class on the link's own element reads its state only from a host binding,
// which runs after the link's `ngOnInit`, once its required `page` is set.
@Component({
  selector: "a[app-page-link]",
  hostDirectives: [
    { directive: UiPaginationLink, inputs: ["page"] },
    RouterLink,
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
    RouterLink,
    UiPagination,
    UiPaginationItem,
    UiPaginationList,
    UiPaginationNext,
    UiPaginationPrevious,
  ],
  template: `
    <div class="fixture">
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
            <a uiPaginationPrevious uiRouterLink class="pagination-step">Previous</a>
          </li>
          @for (item of list.state().items; track item) {
            <li uiPaginationItem>
              <a app-page-link [page]="$any(item)"></a>
            </li>
          }
          <li uiPaginationItem>
            <a uiPaginationNext uiRouterLink class="pagination-step">Next</a>
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
