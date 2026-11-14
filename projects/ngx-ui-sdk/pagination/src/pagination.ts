import { Directive, input, output, type OnInit } from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  pagination,
  type PaginationController,
  type PaginationPageChangeReason,
  type PaginationPrimitive,
} from "@ui-sdk/core/pagination"
import {
  ɵinjectDefaultText as injectDefaultText,
  injectPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
} from "ngx-ui-sdk"

/**
 * Why the page changes.
 * @experimental
 */
type PaginationPageChangeDetails = ChangeDetails<PaginationPageChangeReason>

/**
 * Pages of results, on the `<nav>` it's written on. Render its pages from the
 * list's `state().items`. Links are `<a>` with `getHref`, else `<button>`.
 * @experimental
 */
@Directive({
  selector: "[uiPagination]",
  exportAs: "uiPagination",
  providers: [provideRoot(pagination, () => UiPagination)],
})
class UiPagination implements OnInit {
  /** The current page, from 1. Bind it, or `[(page)]`, to control it. */
  readonly page = input<number>()
  /** The page at first, when uncontrolled. */
  readonly defaultPage = input<number>()
  /** How many pages there are, or else `total` and `pageSize` say. */
  readonly pageCount = input<number>()
  /** How many results there are, with `pageSize`. */
  readonly total = input<number>()
  /** How many results a page holds. */
  readonly pageSize = input<number>()
  /** How many pages show on each side of the current one. */
  readonly siblings = input<number>()
  /** How many pages show at each end. */
  readonly boundaries = input<number>()
  /** A page's URL, which makes the links `<a>` elements. */
  readonly getHref = input<(page: number) => string>()
  /** Sets the page from anywhere. Create one with `createPaginationController()`. */
  readonly controller = input<PaginationController>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean>()
  /** Emits the new page once a change isn't canceled, for `[(page)]`. */
  readonly pageChange = output<number>()
  /** Emits before the page changes. `details.cancel()` stops it, and a link's navigation with it. */
  readonly beforePageChange = output<{
    page: number
    details: PaginationPageChangeDetails
  }>()
  readonly handle: PrimitiveHandle<PaginationPrimitive> = injectPrimitive(
    pagination,
    () => ({
      page: this.page(),
      defaultPage: this.defaultPage(),
      pageCount: this.pageCount(),
      total: this.total(),
      pageSize: this.pageSize(),
      siblings: this.siblings(),
      boundaries: this.boundaries(),
      getHref: this.getHref(),
      controller: this.controller(),
      debug: this.debug(),
      onPageChange: (page: number, details: PaginationPageChangeDetails) => {
        this.beforePageChange.emit({ page, details })
        if (!details.canceled) {
          this.pageChange.emit(page)
        }
      },
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The pagination's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

/**
 * The list of pages. Its `state().items` are the page numbers to render, and
 * `"ellipsis"` where pages are left out.
 * @experimental
 */
@Directive({ selector: "[uiPaginationList]", exportAs: "uiPaginationList" })
class UiPaginationList implements OnInit {
  readonly #part = injectPart(injectHandle(pagination), "list")
  /** The list's state, with its `items`. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * One entry of the list, around a link, a step or an ellipsis.
 * @experimental
 */
@Directive({ selector: "[uiPaginationItem]", exportAs: "uiPaginationItem" })
class UiPaginationItem implements OnInit {
  readonly #part = injectPart(injectHandle(pagination), "item")

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A page's link. Written empty, it shows the page's number.
 * @experimental
 */
@Directive({ selector: "[uiPaginationLink]", exportAs: "uiPaginationLink" })
class UiPaginationLink implements OnInit {
  /** The page it goes to. */
  readonly page = input.required<number>()
  readonly #part = injectPart(injectHandle(pagination), "link", () => ({
    page: this.page(),
    id: String(this.page()),
  }))
  /** The link's state, with whether it's the `current` page. */
  readonly state = this.#part.state
  readonly #content = injectDefaultText(() => String(this.state().page ?? ""))

  ngOnInit() {
    this.#content.decide()
    this.#part.init()
  }
}

/**
 * Stands for pages left out. Written empty, it shows "…".
 * @experimental
 */
@Directive({
  selector: "[uiPaginationEllipsis]",
  exportAs: "uiPaginationEllipsis",
})
class UiPaginationEllipsis implements OnInit {
  readonly #part = injectPart(injectHandle(pagination), "ellipsis")
  /** The ellipsis's state. */
  readonly state = this.#part.state
  readonly #content = injectDefaultText(() => "…")

  ngOnInit() {
    this.#content.decide()
    this.#part.init()
  }
}

// A step to another page, which is disabled where it can't go.
function injectStep(slot: "previous" | "next" | "first" | "last") {
  return injectPart(injectHandle(pagination), slot)
}

/**
 * Goes to the page before.
 * @experimental
 */
@Directive({
  selector: "[uiPaginationPrevious]",
  exportAs: "uiPaginationPrevious",
})
class UiPaginationPrevious implements OnInit {
  readonly #part = injectStep("previous")
  /** The step's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Goes to the page after.
 * @experimental
 */
@Directive({ selector: "[uiPaginationNext]", exportAs: "uiPaginationNext" })
class UiPaginationNext implements OnInit {
  readonly #part = injectStep("next")
  /** The step's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Goes to the first page.
 * @experimental
 */
@Directive({ selector: "[uiPaginationFirst]", exportAs: "uiPaginationFirst" })
class UiPaginationFirst implements OnInit {
  readonly #part = injectStep("first")
  /** The step's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Goes to the last page.
 * @experimental
 */
@Directive({ selector: "[uiPaginationLast]", exportAs: "uiPaginationLast" })
class UiPaginationLast implements OnInit {
  readonly #part = injectStep("last")
  /** The step's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

export {
  createPaginationController,
  paginationRange,
} from "@ui-sdk/core/pagination"
export type {
  PaginationChangeOptions,
  PaginationController,
  PaginationLinkProps,
  PaginationLinkState,
  PaginationOptions,
  PaginationPageChangeReason,
  PaginationPrimitive,
  PaginationRangeItem,
  PaginationRangeOptions,
  PaginationState,
  PaginationStepState,
} from "@ui-sdk/core/pagination"

export {
  type PaginationPageChangeDetails,
  UiPagination,
  UiPaginationEllipsis,
  UiPaginationFirst,
  UiPaginationItem,
  UiPaginationLast,
  UiPaginationLink,
  UiPaginationList,
  UiPaginationNext,
  UiPaginationPrevious,
}
