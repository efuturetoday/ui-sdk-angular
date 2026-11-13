import { Component, type ElementRef, signal, viewChild } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import {
  UiField,
  UiFieldLabel,
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectList,
  UiSelectTrigger,
  UiSelectValue,
} from "ui-sdk-angular"

const row = 32
const height = 288

function visibleRows(scrollTop: number, height: number, count: number) {
  const start = Math.max(0, Math.floor(scrollTop / row) - 4)
  const end = Math.min(count, Math.ceil((scrollTop + height) / row) + 4)
  return { start, end }
}

function scrollForRow(index: number, scrollTop: number, height: number) {
  const top = index * row
  if (top < scrollTop) {
    return top
  }
  if (top + row > scrollTop + height) {
    return top + row - height
  }
  return scrollTop
}

@Component({
  selector: "app-example",
  imports: [
    LucideChevronDown,
    UiField,
    UiFieldLabel,
    UiSelect,
    UiSelectContent,
    UiSelectItem,
    UiSelectList,
    UiSelectTrigger,
    UiSelectValue,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Item</label
      ><ng-container
        uiSelect
        [items]="manyItems"
        placeholder="Select an item"
        (highlight)="highlight($event.details)"
        ><button uiSelectTrigger>
          <span uiSelectValue></span
          ><svg lucideChevronDown aria-hidden="true"></svg>
        </button>
        <div *uiSelectContent>
          <div
            #scroller
            [style.height.px]="height"
            (scroll)="scrollTop.set(scroller.scrollTop)"
          >
            <div uiSelectList #list="uiSelectList">
              <div [style.height.px]="list.state().items.length * row">
                @for (
                  entry of visible(list.state().items);
                  track entry.item.value
                ) {
                  <div
                    uiSelectItem
                    [value]="entry.item.value"
                    [label]="entry.item.label"
                    [index]="entry.index"
                    [style.top.px]="entry.index * row"
                    [style.height.px]="row"
                  >
                    {{ entry.item.label }}
                  </div>
                }
              </div>
            </div>
          </div>
        </div></ng-container
      >
    </div>
  `,
})
class Example {
  protected readonly row = row
  protected readonly height = height
  protected readonly manyItems = Array.from({ length: 10_000 }, (_, index) => ({
    value: `item-${index + 1}`,
    label: `Item ${index + 1}`,
  }))
  protected readonly scroller =
    viewChild<ElementRef<HTMLDivElement>>("scroller")
  protected readonly scrollTop = signal(0)

  protected highlight({ index }: { index: number }) {
    const el = this.scroller()?.nativeElement
    if (el && index >= 0) {
      el.scrollTop = scrollForRow(index, el.scrollTop, el.clientHeight)
    }
  }

  protected visible(items: unknown) {
    const all = items as { value: string; label: string }[]
    const { start, end } = visibleRows(this.scrollTop(), height, all.length)
    return all
      .slice(start, end)
      .map((item, offset) => ({ item, index: start + offset }))
  }
}

export { Example }
