import { Component, signal } from "@angular/core"
import { LucideMinus, LucidePlus } from "@lucide/angular"
import {
  UiDrawer,
  UiDrawerBackdrop,
  UiDrawerClose,
  UiDrawerContent,
  UiDrawerDescription,
  UiDrawerTitle,
  UiDrawerTrigger,
} from "ui-sdk-angular"

const goal = { initial: 350, min: 200, max: 400, step: 10 }

@Component({
  selector: "app-example",
  imports: [
    LucideMinus,
    LucidePlus,
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
      <button uiDrawerTrigger>Open Drawer</button>
      <div *uiDrawerBackdrop></div>
      <div *uiDrawerContent>
        <div data-slot="grip" aria-hidden="true"></div>

        <div data-slot="stack">
          <h2 uiDrawerTitle>Move goal</h2>
          <p uiDrawerDescription>Set your daily activity goal.</p>
        </div>

        <div data-slot="row">
          <button
            type="button"
            aria-label="Decrease"
            [disabled]="calories() <= goal.min"
            (click)="calories.set(calories() - goal.step)"
          >
            <svg lucideMinus aria-hidden="true"></svg>
          </button>
          <div data-slot="stack">
            <div aria-live="polite">{{ calories() }}</div>
            <div data-slot="hint">Calories/day</div>
          </div>
          <button
            type="button"
            aria-label="Increase"
            [disabled]="calories() >= goal.max"
            (click)="calories.set(calories() + goal.step)"
          >
            <svg lucidePlus aria-hidden="true"></svg>
          </button>
        </div>

        <div data-slot="stack">
          <button uiDrawerClose data-variant="solid" value="submit">
            Submit
          </button>
          <button uiDrawerClose>Cancel</button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  protected readonly goal = goal
  protected readonly calories = signal(goal.initial)
}

export { Example }
