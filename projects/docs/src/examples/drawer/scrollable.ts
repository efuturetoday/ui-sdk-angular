import { Component } from "@angular/core"
import {
  UiDrawer,
  UiDrawerBackdrop,
  UiDrawerClose,
  UiDrawerContent,
  UiDrawerDescription,
  UiDrawerTitle,
  UiDrawerTrigger,
} from "@ngx-ui-sdk/core/drawer"

const paragraphs = [
  "The drawer rises from any edge, rests on snap points and follows your finger with the same spring as a system sheet.",
  "Snap points take fractions of the screen, pixels, rem, percentages or the content's own size. Points that land within a pixel of each other merge into one.",
  "Dragging a list scrolls it until it reaches the top, and then the same gesture moves the drawer, so closing a long sheet never needs two tries.",
  "The handle steps through the snap points with a press, the arrow keys, Home and End. Screen readers on phones adjust it like a slider.",
  "Below a snap point you choose, the page behind stays usable and undimmed, like a map with a sheet of results.",
  "Drawers opened from inside each other stack, and the one beneath steps back while the new one rises.",
  "The on-screen keyboard pushes the drawer up, and the focused field scrolls into view inside it, never the page.",
  "With reduced motion, drawers fade in and out instead of sliding.",
]

@Component({
  selector: "app-example",
  imports: [
    UiDrawer,
    UiDrawerBackdrop,
    UiDrawerClose,
    UiDrawerContent,
    UiDrawerDescription,
    UiDrawerTitle,
    UiDrawerTrigger,
  ],
  template: `
    <ng-container uiDrawer>
      <button uiDrawerTrigger>Scrollable Content</button>
      <div *uiDrawerBackdrop></div>
      <div *uiDrawerContent="let state; initialFocus: 'content'">
        <div data-slot="grip" aria-hidden="true"></div>
        <div data-slot="stack">
          <h2 uiDrawerTitle>Release notes</h2>
          <p uiDrawerDescription>Everything new in the drawer.</p>
        </div>
        <div data-slot="scroll">
          @for (paragraph of paragraphs; track $index) {
            <p data-slot="hint">{{ paragraph }}</p>
          }
        </div>
        <div data-slot="stack">
          <button uiDrawerClose data-variant="solid">Got It</button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  protected readonly paragraphs = [...paragraphs, ...paragraphs]
}

export { Example }
