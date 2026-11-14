import {
  Component,
  ElementRef,
  computed,
  signal,
  viewChild,
} from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import { type ListHighlightDetails } from "@ngx-ui-sdk/core/select"
import {
  type WaterfallData,
  UiWaterfall,
  UiWaterfallBar,
  UiWaterfallIndicator,
  UiWaterfallRow,
  UiWaterfallRowHeader,
  visibleWaterfallRows,
} from "@ngx-ui-sdk/core/waterfall"

@Component({
  selector: "app-example",
  imports: [
    LucideChevronRight,
    UiWaterfall,
    UiWaterfallBar,
    UiWaterfallIndicator,
    UiWaterfallRow,
    UiWaterfallRowHeader,
  ],
  template: `
    <div #scroller data-slot="scroll" (scroll)="onScroll($event)">
      <div
        uiWaterfall
        [(expanded)]="expanded"
        aria-label="Build trace"
        [attr.aria-rowcount]="rows().length"
        [items]="trace"
        [range]="[0, 400]"
        [style.height.px]="rows().length * row"
        (highlight)="onHighlight($event.details)">
        @for (entry of visible(); track entry.item.value) {
          <div
            uiWaterfallRow
            [value]="entry.item.value"
            [attr.aria-rowindex]="entry.index + 1"
            [style.top.px]="entry.index * row">
            <div uiWaterfallRowHeader>
              @if (entry.item.children) {
                <span uiWaterfallIndicator>
                  <svg lucideChevronRight aria-hidden="true"></svg>
                </span>
              }
              {{ entry.item.label }}
            </div>
            <div uiWaterfallBar></div>
          </div>
        }
      </div>
    </div>
  `,
})
class Example {
  protected readonly trace: WaterfallData = Array.from(
    { length: 2000 },
    (_, job) => ({
      value: `job-${job + 1}`,
      label: `job ${job + 1}`,
      start: job * 4,
      duration: 60,
      children: Array.from({ length: 4 }, (_, step) => ({
        value: `job-${job + 1}/step-${step + 1}`,
        label: `step ${step + 1}`,
        start: job * 4 + step * 15,
        duration: 15,
      })),
    })
  )
  protected readonly row = 32
  readonly #height = 288
  protected readonly scroller = viewChild<ElementRef<HTMLElement>>("scroller")
  protected readonly scrollTop = signal(0)
  protected readonly expanded = signal<string[]>(["job-1"])
  protected readonly rows = computed(() =>
    visibleWaterfallRows(this.trace, this.expanded())
  )
  protected readonly visible = computed(() => {
    const start = Math.max(0, Math.floor(this.scrollTop() / this.row) - 4)
    const end = Math.min(
      this.rows().length,
      Math.ceil((this.scrollTop() + this.#height) / this.row) + 4
    )
    return this.rows().slice(start, end)
  })

  protected onScroll(event: Event) {
    this.scrollTop.set((event.currentTarget as HTMLElement).scrollTop)
  }

  protected onHighlight({ index }: ListHighlightDetails) {
    const el = this.scroller()?.nativeElement
    if (!el) {
      return
    }
    const top = index * this.row
    if (top < el.scrollTop) {
      el.scrollTop = top
    } else if (top + this.row > el.scrollTop + el.clientHeight) {
      el.scrollTop = top + this.row - el.clientHeight
    }
    this.scrollTop.set(el.scrollTop)
  }
}

export { Example }
