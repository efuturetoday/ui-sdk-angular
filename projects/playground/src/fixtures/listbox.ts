import { NgTemplateOutlet } from "@angular/common"
import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from "@angular/core"
import { onItemsChange } from "tests/fixtures/items"
import {
  changedToppings,
  listboxAction,
  listboxFixture as f,
  listboxOptions,
  longToppings,
} from "tests/fixtures/listbox"
import { serializeForm } from "tests/fixtures/select"
import {
  createListboxController,
  UiListbox,
  UiListboxGroup,
  UiListboxGroupLabel,
  UiListboxItem,
  UiListboxItemIcon,
  UiListboxItemIndicator,
  UiListboxSeparator,
  type ListboxValueChangeDetails,
} from "@ngx-ui-sdk/core/listbox"

@Component({
  selector: "app-fixture",
  imports: [
    NgTemplateOutlet,
    UiListbox,
    UiListboxGroup,
    UiListboxGroupLabel,
    UiListboxItem,
    UiListboxItemIcon,
    UiListboxItemIndicator,
    UiListboxSeparator,
  ],
  template: `
    <ng-template #list>
      <div
        uiListbox
        class="listbox"
        [attr.aria-label]="f.label"
        [name]="f.name"
        [controller]="controller"
        [multiple]="o.multiple"
        [activation]="o.activation"
        [orientation]="o.orientation"
        [loop]="o.loop"
        [virtualFocus]="o.virtualFocus"
        [deselectable]="o.deselectable"
        [required]="o.required"
        [readOnly]="o.readOnly"
        [disabled]="o.disabled"
        [value]="o.controlled ? value() : undefined"
        [defaultValue]="o.controlled ? undefined : o.defaultValue"
        (beforeValueChange)="onValueChange($event.value, $event.details)"
      >
        @for (item of listed(); track item.key) {
          @switch (item.type) {
            @case ("separator") {
              <div uiListboxSeparator class="separator"></div>
            }
            @case ("group") {
              <div uiListboxGroup class="group">
                <div uiListboxGroupLabel class="label">{{ item.label }}</div>
                @for (child of item.items; track child.value) {
                  <div uiListboxItem class="item" [value]="child.value">
                    <span uiListboxItemIcon class="icon"></span>
                    {{ child.label }}
                    <span *uiListboxItemIndicator class="indicator">✓</span>
                  </div>
                }
              </div>
            }
            @default {
              <div
                uiListboxItem
                class="item"
                [value]="item.value"
                [disabled]="item.disabled"
              >
                <span uiListboxItemIcon class="icon"></span>
                {{ item.label }}
                <span *uiListboxItemIndicator class="indicator">✓</span>
              </div>
            }
          }
        }
      </div>
    </ng-template>
    <div class="fixture">
      <button>Before</button>
      <form
        class="select-form"
        [attr.aria-label]="f.formLabel"
        (submit)="onSubmit($event)"
      >
        @if (o.fieldset) {
          <fieldset disabled style="display: contents">
            <ng-container [ngTemplateOutlet]="list" />
          </fieldset>
        } @else {
          <ng-container [ngTemplateOutlet]="list" />
        }
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Reason">{{ reason() }}</output>
      <output role="status" aria-label="Submitted">{{ submitted() }}</output>
      <button (click)="controller.clear()">{{ f.clear }}</button>
      <button (click)="controller.selectAll()">{{ f.selectAll }}</button>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly o = listboxOptions()
  protected readonly controller = createListboxController<string, boolean>()
  protected readonly action = signal("")
  protected readonly reason = signal("")
  protected readonly submitted = signal("")
  protected readonly value = signal<unknown>(
    this.o.defaultValue ?? (this.o.multiple ? [] : null)
  )
  protected readonly list = signal(f.items)
  // What the list holds, in order: the items, or groups with a separator between.
  protected readonly listed = computed(() =>
    this.o.grouped
      ? f.groups.flatMap((group, index) => [
          ...(index
            ? [{ type: "separator" as const, key: `separator-${index}` }]
            : []),
          {
            type: "group" as const,
            key: group.label,
            label: group.label,
            items: group.items,
          },
        ])
      : (this.o.long ? longToppings() : this.list()).map(
          (item: { value: string; label: string; disabled?: boolean }) => ({
            type: "item" as const,
            key: item.value,
            ...item,
          })
        )
  )

  constructor() {
    // Items a spec swaps in. Only in the browser: the server has no document.
    const destroyRef = inject(DestroyRef)
    afterNextRender(() => {
      const stop = onItemsChange(changedToppings, (next) => this.list.set(next))
      destroyRef.onDestroy(stop)
    })
  }

  protected onValueChange(value: unknown, details: ListboxValueChangeDetails) {
    this.reason.set(details.reason)
    if (this.o.cancel) {
      return details.cancel()
    }
    this.value.set(value)
    this.action.set(listboxAction(value))
  }

  protected onSubmit(event: Event) {
    event.preventDefault()
    this.submitted.set(serializeForm(event.target as HTMLFormElement))
  }
}

export { Fixture }
