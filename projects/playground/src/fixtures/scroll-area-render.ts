import { Component, computed, viewChild } from "@angular/core"
import {
  UiScrollArea,
  UiScrollAreaScrollbar,
  UiScrollAreaThumb,
  UiScrollAreaViewport,
} from "ngx-ui-sdk/scroll-area"

const notes = Array.from({ length: 40 }, (_, index) => `Note ${index + 1}`)
const renders = ((window as unknown as { renders: { root: number } }).renders =
  { root: 0 })

@Component({
  selector: "app-fixture",
  imports: [
    UiScrollArea,
    UiScrollAreaScrollbar,
    UiScrollAreaThumb,
    UiScrollAreaViewport,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <section uiScrollArea class="scroll-area">
        <p class="render-status">{{ status() }}</p>
        <article uiScrollAreaViewport class="scroll-area-viewport" role="region" aria-label="Notes">
          @for (note of notes; track note) {
            <p class="scroll-area-item">{{ note }}</p>
          }
        </article>
        <div uiScrollAreaScrollbar class="scroll-area-scrollbar">
          <div uiScrollAreaThumb class="scroll-area-thumb"></div>
        </div>
      </section>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `,
})
class Fixture {
  protected readonly notes = notes
  private readonly area = viewChild.required(UiScrollArea)
  private readonly atEnd = computed(() => this.area().state().atEnd)

  // Counts the root's renders, which only an edge flipping should cause.
  protected readonly status = computed(() => {
    renders.root++
    return this.atEnd() ? "At end" : "Reading"
  })
}

export { Fixture }
