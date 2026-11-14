import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
} from "@angular/core"
import { bindScrollPicker } from "@ui-sdk/core"
import {
  type PickerFixture,
  pickerFixtures,
} from "tests/fixtures/listbox-picker"
import {
  UiListbox,
  UiListboxItem,
} from "@ngx-ui-sdk/core/listbox"

@Component({
  selector: "app-picker",
  imports: [UiListbox, UiListboxItem],
  template: `
    <div>
      <div
        uiListbox
        class="picker"
        [attr.aria-label]="picker().label"
        [orientation]="picker().orientation"
        [keepInView]="false"
        [value]="value()"
        (valueChange)="choose($event)"
      >
        @for (item of picker().items; track item.value) {
          <div
            uiListboxItem
            class="picker-item"
            [value]="item.value"
            [disabled]="item.disabled"
          >
            {{ item.value }}
          </div>
        }
      </div>
      <output role="status" [attr.aria-label]="picker().label + ' changes'">{{
        changes().join(",")
      }}</output>
    </div>
  `,
})
class Picker {
  readonly picker = input.required<PickerFixture>()
  protected readonly value = signal<unknown>(undefined)
  protected readonly changes = signal<string[]>([])
  readonly #holder = inject<ElementRef<HTMLElement>>(ElementRef)

  constructor() {
    const destroyRef = inject(DestroyRef)
    afterNextRender(() => {
      this.value.set(this.picker().defaultValue)
      const unbind = bindScrollPicker(
        this.#holder.nativeElement.querySelector<HTMLElement>(
          '[role="listbox"]'
        )!,
        {
          onSelect: (index) => this.choose(this.picker().items[index]!.value),
        }
      )
      destroyRef.onDestroy(unbind)
    })
  }

  protected choose(next: unknown) {
    this.value.set(next)
    this.changes.update((changes) => [...changes, String(next)])
  }
}

@Component({
  selector: "app-fixture",
  imports: [Picker],
  template: `
    <div class="fixture">
      <button>Before</button>
      @for (picker of pickers; track picker.label) {
        <app-picker [picker]="picker" />
      }
      <button>After</button>
    </div>
  `,
})
class Fixture {
  protected readonly pickers = pickerFixtures
}

export { Fixture }
