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

const sides = [
  {
    side: "top",
    label: "Top",
    title: "Notifications",
    description: "You're all caught up.",
  },
  {
    side: "right",
    label: "Right",
    title: "Cart",
    description: "2 items, $84.00.",
  },
  {
    side: "bottom",
    label: "Bottom",
    title: "Share",
    description: "Send this page to your team.",
  },
  {
    side: "left",
    label: "Left",
    title: "Menu",
    description: "Jump to a section of the docs.",
  },
] as const

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
    <div data-slot="row">
      @for (entry of sides; track entry.side) {
        <ng-container
          uiDrawer
          [side]="entry.side"
          [preventEdgeSwipe]="entry.side === 'left' || entry.side === 'right'"
        >
          <button uiDrawerTrigger>{{ entry.label }}</button>
          <div *uiDrawerBackdrop></div>
          <div *uiDrawerContent>
            <div data-slot="stack">
              <h2 uiDrawerTitle>{{ entry.title }}</h2>
              <p uiDrawerDescription>{{ entry.description }}</p>
            </div>
            <button uiDrawerClose data-variant="solid">Close</button>
          </div>
        </ng-container>
      }
    </div>
  `,
})
class Example {
  protected readonly sides = sides
}

export { Example }
