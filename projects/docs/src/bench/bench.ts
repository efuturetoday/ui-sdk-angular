import { ChangeDetectionStrategy, Component, signal } from "@angular/core"
import { LucideCopy, LucideFileText } from "@lucide/angular"

const rowHeight = 20
const total = 10_000
const shown = 43

// A virtual table under `<body data-ui-theme>`, as an app has one, for
// tests/bench/bench.spec.ts to measure what a theme's selectors cost.
@Component({
  selector: "app-root",
  imports: [LucideCopy, LucideFileText],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .viewport {
      height: 860px;
      overflow: auto;
    }
    .rows {
      position: relative;
    }
    .tr {
      display: flex;
      gap: 8px;
      align-items: center;
      position: absolute;
      inset-inline: 0;
      height: ${rowHeight}px;
    }
  `,
  template: `
    <div class="viewport" (scroll)="scrolled($event)">
      <div class="rows" [style.height.px]="height">
        @for (row of rows(); track row) {
          <div class="tr" role="row" [style.top.px]="row * rowHeight">
            <span>{{ row }}</span>
            <span>orders</span>
            <span>
              <svg lucideFileText aria-hidden="true"></svg>
              key-{{ row }}
            </span>
            <span data-slot="badge">ok</span>
            <button aria-label="Copy">
              <svg lucideCopy aria-hidden="true"></svg>
            </button>
            <button data-slot="button" data-size="sm">Open</button>
            <a href="#">offset</a>
            <code>{{ "{" }}"id": {{ row }}{{ "}" }}</code>
            <span>12 kB</span>
            <span>p{{ row % 6 }}</span>
            <label>
              <input type="checkbox" />
              pin
            </label>
          </div>
        }
      </div>
    </div>
  `,
})
class Bench {
  protected readonly rowHeight = rowHeight
  protected readonly height = total * rowHeight
  protected readonly rows = signal(this.window(0))

  protected scrolled(event: Event) {
    const top = (event.target as HTMLElement).scrollTop
    this.rows.set(this.window(Math.floor(top / rowHeight)))
  }

  private window(first: number) {
    return Array.from({ length: shown }, (_, i) => first + i)
  }
}

export { Bench }
