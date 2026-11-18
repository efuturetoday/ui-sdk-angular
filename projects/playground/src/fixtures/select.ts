import { UiText } from "@ngx-ui-sdk/core"
import { NgTemplateOutlet } from "@angular/common"
import {
  Component,
  computed,
  DestroyRef,
  afterNextRender,
  inject,
  input,
  signal,
} from "@angular/core"
import { onItemsChange } from "tests/fixtures/items"
import {
  changedItems,
  longItems,
  selectFixture,
  selectOptions,
  serializeForm,
} from "tests/fixtures/select"
import {
  createSelectController,
  type ListData,
  type SelectValueChangeDetails,
  UiSelect,
  UiSelectClear,
  UiSelectContent,
  UiSelectEmpty,
  UiSelectGroup,
  UiSelectGroupLabel,
  UiSelectInput,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectItemText,
  UiSelectLabel,
  UiSelectList,
  UiSelectSelectAll,
  UiSelectSeparator,
  UiSelectTrigger,
  UiSelectValue,
} from "@ngx-ui-sdk/core/select"

type Entry =
  | string
  | { value: string; label: string; disabled?: boolean }
  | { type: "separator" }
  | { type: "group"; label: string; items: { value: string; label: string }[] }

const dataParts = [
  UiSelectGroup,
  UiSelectGroupLabel,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectItemText,
  UiSelectSeparator,
  UiText,
]

// The list's data, rendered like the composed list: items with their check,
// groups with their labels, and separators.
@Component({
  selector: "app-data-items",
  imports: dataParts,
  template: `
    @for (entry of items(); track $index) {
      @if (typeof entry === "string") {
        <div uiSelectItem class="item" [value]="entry" [label]="entry">
          <span uiSelectItemText uiText></span>
          <span *uiSelectItemIndicator class="indicator">✓</span>
        </div>
      } @else if ("value" in entry) {
        <div uiSelectItem class="item" [value]="entry.value" [disabled]="entry.disabled" [label]="entry.label">
          <span uiSelectItemText uiText></span>
          <span *uiSelectItemIndicator class="indicator">✓</span>
        </div>
      } @else if (entry.type === "separator") {
        <div uiSelectSeparator class="separator"></div>
      } @else {
        <div uiSelectGroup>
          <div uiSelectGroupLabel class="label">{{ entry.label }}</div>
          @for (item of entry.items; track item.value) {
            <div uiSelectItem class="item" [value]="item.value" [label]="item.label">
              <span uiSelectItemText uiText></span>
              <span *uiSelectItemIndicator class="indicator">✓</span>
            </div>
          }
        </div>
      }
    }
  `,
  styles: ":host { display: contents }",
})
class DataItems {
  readonly items = input.required<Entry[], unknown>({
    transform: (items) => items as Entry[],
  })
}

// ?wrapped renders the data list through a content part wrapped in a
// component of the app's own, as a styled layer does.
@Component({
  selector: "app-styled-content",
  imports: [UiText, DataItems, UiSelectContent],
  template: `
    <div *uiSelectContent="let state" class="popup list-popup">
      <app-data-items [items]="state().items" />
    </div>
  `,
  styles: ":host { display: contents }",
})
class StyledContent {}

@Component({
  selector: "app-fixture",
  imports: [UiText, 
    DataItems,
    NgTemplateOutlet,
    StyledContent,
    UiSelect,
    UiSelectClear,
    UiSelectContent,
    UiSelectEmpty,
    UiSelectInput,
    UiSelectLabel,
    UiSelectList,
    UiSelectSelectAll,
    UiSelectTrigger,
    UiSelectValue,
    ...dataParts,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form class="select-form" [attr.aria-label]="f.formLabel" (submit)="onSubmit($event)">
        @if (o.fieldset) {
          <fieldset disabled style="display: contents">
            <ng-container [ngTemplateOutlet]="selectTemplate" />
          </fieldset>
        } @else {
          <div style="display: contents">
            <ng-container [ngTemplateOutlet]="selectTemplate" />
          </div>
        }
        <ng-template #selectTemplate>
          <ng-container
            uiSelect
            [name]="f.name"
            [placeholder]="f.placeholder"
            [controller]="controller"
            [container]="o.container"
            [items]="fromData ? items() : undefined"
            [emptyItems]="o.recent ? f.recent : undefined"
            [multiple]="o.multiple"
            [defaultValue]="o.defaultValue"
            [required]="o.required"
            [readOnly]="o.readOnly"
            [virtualFocus]="o.virtualFocus"
            [disabled]="o.disabled"
            [defaultOpen]="o.defaultOpen"
            [modal]="o.modal"
            [presentation]="o.presentation"
            (beforeValueChange)="onValueChange($event.value, $event.details)"
          >
            <div uiSelectLabel class="label">{{ f.label }}</div>
            <button uiSelectTrigger class="trigger">
              <span uiSelectValue class="value" [maxLabels]="o.max" uiText></span>
              <span aria-hidden="true">▾</span>
            </button>
            <button *uiSelectClear>{{ f.clear }}</button>
            @if (wrapped) {
              <app-styled-content />
            } @else {
              <div
                *uiSelectContent="let state; alignItemWithTrigger: o.align && !fromData"
                class="popup list-popup"
              >
                <ng-template #body>
                  @if (o.selectAll && (fromData ? !(o.search && o.grouped) : !o.grouped)) {
                    <div uiSelectSelectAll class="item">{{ f.selectAll }}</div>
                  }
                  @if (fromData) {
                    <app-data-items [items]="state().items" />
                  } @else {
                    @for (entry of listed(); track entry.key) {
                      @if (entry.type === "separator") {
                        <div uiSelectSeparator class="separator"></div>
                      } @else if (entry.type === "group") {
                        <div uiSelectGroup>
                          <div uiSelectGroupLabel class="label">{{ entry.label }}</div>
                          @if (o.selectAll) {
                            <div uiSelectSelectAll class="item">{{ f.selectAll }} {{ entry.label }}</div>
                          }
                          @for (child of entry.items; track child.value) {
                            <div uiSelectItem class="item" [value]="child.value" [label]="child.label">
                              <span uiSelectItemText uiText></span>
                              <span *uiSelectItemIndicator class="indicator">✓</span>
                            </div>
                          }
                        </div>
                      } @else {
                        <div uiSelectItem class="item" [value]="entry.value" [disabled]="entry.disabled" [label]="entry.label">
                          <span uiSelectItemText uiText></span>
                          <span *uiSelectItemIndicator class="indicator">✓</span>
                        </div>
                      }
                    }
                  }
                </ng-template>
                @if (o.search) {
                  <input uiSelectInput class="input" [attr.aria-label]="f.search" />
                  <div uiSelectEmpty class="empty">{{ f.empty }}</div>
                  <div uiSelectList>
                    <ng-container [ngTemplateOutlet]="body" />
                  </div>
                } @else {
                  <ng-container [ngTemplateOutlet]="body" />
                }
              </div>
            }
          </ng-container>
        </ng-template>
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Submitted">{{ submitted() }}</output>
      <button (click)="controller.open()">Open with controller</button>
    </div>
  `,
})
class Fixture {
  protected readonly f = selectFixture
  protected readonly o = selectOptions() as ReturnType<typeof selectOptions> & {
    max?: number
    defaultValue?: string | string[]
    defaultOpen?: boolean
    modal?: boolean
    container?: HTMLElement | null
    presentation?: "auto" | "sheet"
  }
  protected readonly wrapped = new URLSearchParams(location.search).has("wrapped")
  protected readonly fromData = this.o.long || this.o.recent || this.wrapped
  protected readonly controller = createSelectController<string, boolean>()
  protected readonly action = signal("")
  protected readonly submitted = signal("")
  protected readonly list = signal<{ value: string; label: string; disabled?: boolean }[]>(
    selectFixture.items
  )
  protected readonly items = computed((): ListData<unknown> =>
    this.o.long
      ? longItems()
      : this.o.grouped
        ? [
            { type: "group", label: selectFixture.groups[0]!.label, items: selectFixture.groups[0]!.items },
            { type: "separator" },
            { type: "group", label: selectFixture.groups[1]!.label, items: selectFixture.groups[1]!.items },
          ]
        : this.list()
  )
  // What the composed list holds, in order: the items, or groups with a separator between.
  protected readonly listed = computed(() =>
    this.o.grouped
      ? selectFixture.groups.flatMap((group, index) => [
          ...(index ? [{ type: "separator" as const, key: `separator-${index}` }] : []),
          { type: "group" as const, key: group.label, label: group.label, items: group.items },
        ])
      : this.list().map((item) => ({ type: "item" as const, key: item.value, ...item }))
  )

  constructor() {
    // Items a spec swaps in. Only in the browser: the server has no document.
    const destroyRef = inject(DestroyRef)
    afterNextRender(() => {
      const stop = onItemsChange(changedItems, (next) => this.list.set(next))
      destroyRef.onDestroy(stop)
    })
  }

  protected onValueChange(value: unknown, details: SelectValueChangeDetails) {
    if (this.o.cancel) {
      return details.cancel()
    }
    this.action.set(`value:${Array.isArray(value) ? value.join(",") : String(value)}`)
  }

  protected onSubmit(event: Event) {
    event.preventDefault()
    this.submitted.set(serializeForm(event.target as HTMLFormElement))
  }
}

export { Fixture }
