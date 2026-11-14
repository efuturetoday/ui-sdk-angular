import { NgTemplateOutlet } from "@angular/common"
import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from "@angular/core"
import {
  cancelsValue,
  changedItems,
  comboboxFixture,
  comboboxOptions,
  createDelay,
  searchCountries,
  searchCountryPages,
} from "tests/fixtures/combobox"
import { onItemsChange } from "tests/fixtures/items"
import { longItems, serializeForm } from "tests/fixtures/select"
import {
  injectAsyncOptions, UiText } from "@ngx-ui-sdk/core"
import {
  type ComboboxValueChangeDetails,
  UiCombobox,
  UiComboboxChip,
  UiComboboxChipRemove,
  UiComboboxChips,
  UiComboboxChipsOverflow,
  UiComboboxClear,
  UiComboboxContent,
  UiComboboxCreate,
  UiComboboxEmpty,
  UiComboboxGroup,
  UiComboboxGroupLabel,
  UiComboboxInput,
  UiComboboxItem,
  UiComboboxItemIndicator,
  UiComboboxItemText,
  UiComboboxLabel,
  UiComboboxList,
  UiComboboxSelectAll,
  UiComboboxStatus,
  UiComboboxTrigger,
  UiComboboxValue,
} from "@ngx-ui-sdk/core/combobox"

type Entry = {
  value: string
  label: string
  keywords?: string[]
  disabled?: boolean
}
type Shown = Entry | { type: "group"; label: string; items: Entry[] }

// The data variant renders the same combobox from `items`, with ?data.
@Component({
  selector: "app-fixture",
  imports: [UiText, 
    NgTemplateOutlet,
    UiCombobox,
    UiComboboxChip,
    UiComboboxChipRemove,
    UiComboboxChips,
    UiComboboxChipsOverflow,
    UiComboboxClear,
    UiComboboxContent,
    UiComboboxCreate,
    UiComboboxEmpty,
    UiComboboxGroup,
    UiComboboxGroupLabel,
    UiComboboxInput,
    UiComboboxItem,
    UiComboboxItemIndicator,
    UiComboboxItemText,
    UiComboboxLabel,
    UiComboboxList,
    UiComboboxSelectAll,
    UiComboboxStatus,
    UiComboboxTrigger,
    UiComboboxValue,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form class="select-form" [attr.aria-label]="f.formLabel" (submit)="onSubmit($event)">
        @if (o.fieldset) {
          <fieldset disabled style="display: contents">
            <ng-container [ngTemplateOutlet]="comboboxTemplate" />
          </fieldset>
        } @else {
          <div style="display: contents">
            <ng-container [ngTemplateOutlet]="comboboxTemplate" />
          </div>
        }
        <ng-template #comboboxTemplate>
          <ng-container
            uiCombobox
            [name]="f.name"
            [container]="o.container"
            [items]="dataMode ? items() : undefined"
            [emptyItems]="o.recent ? f.recent : undefined"
            [filter]="remoteMode ? false : undefined"
            [status]="remoteMode ? remote.state().status : undefined"
            [itemToLabel]="o.labelsFromItems ? undefined : labelOf"
            [multiple]="o.multiple"
            [defaultValue]="o.defaultValue"
            [maxSelected]="o.maxSelected"
            [required]="o.required"
            [readOnly]="o.readOnly"
            [disabled]="o.disabled"
            [autoHighlight]="o.autoHighlight || undefined"
            [modal]="o.modal"
            [presentation]="o.presentation"
            (beforeValueChange)="onValueChange($event.value, $event.details)"
            (queryChange)="remoteMode && remote.setQuery($event)"
            (loadMore)="o.pages && remote.loadMore()"
          >
            <div uiComboboxLabel class="label">{{ f.label }}</div>
            @if (o.multiple) {
              <div uiComboboxChips [class]="o.overflow ? 'chips chips-line' : 'chips'">
                <ng-container uiComboboxValue #value="uiComboboxValue">
                  @for (item of valuesOf(value.state().value); track item) {
                    <div uiComboboxChip class="chip" [value]="item">
                      {{ labelOf(item) }}
                      <button uiComboboxChipRemove [attr.aria-label]="'Remove ' + labelOf(item)">×</button>
                    </div>
                  }
                </ng-container>
                @if (o.overflow) {
                  <span uiComboboxChipsOverflow class="chips-overflow" uiText></span>
                }
                <input uiComboboxInput class="input" />
              </div>
            } @else {
              <input uiComboboxInput class="input" />
            }
            @if (o.summary) {
              <output [attr.aria-label]="f.summary"
                ><ng-container uiComboboxValue #summary="uiComboboxValue" [maxLabels]="o.summary">{{ summary.state().label }}</ng-container></output
              >
            }
            <button uiComboboxTrigger [attr.aria-label]="f.trigger">▾</button>
            <button *uiComboboxClear>{{ f.clear }}</button>
            <div
              *uiComboboxContent
              [class]="o.pages ? 'popup list-popup list-short' : 'popup list-popup'"
            >
              @if (!o.nostatus) {
                <div uiComboboxStatus #status="uiComboboxStatus" class="status">{{
                  status.state().loading ? (o.pages ? "Loading more…" : "Loading…") : ""
                }}</div>
              }
              <div uiComboboxEmpty class="empty">{{ f.empty }}</div>
              @if (dataMode) {
                <div uiComboboxList #list="uiComboboxList">
                  @if (o.selectAll) {
                    <div uiComboboxSelectAll class="item">{{ f.selectAll }}</div>
                  }
                  @for (entry of shownOf(list.state().items); track "items" in entry ? entry.label : entry.value) {
                    @if ("items" in entry) {
                      <div uiComboboxGroup>
                        <div uiComboboxGroupLabel class="label">{{ entry.label }}</div>
                        @for (item of entry.items; track item.value) {
                          <div
                            uiComboboxItem
                            class="item"
                            [value]="item.value"
                            [label]="item.label"
                            [keywords]="item.keywords"
                            [disabled]="item.disabled"
                          >
                            @if (o.highlight) {
                              <span uiComboboxItemText uiText></span>
                            } @else {
                              {{ item.label }}
                            }
                            <span *uiComboboxItemIndicator class="indicator">✓</span>
                          </div>
                        }
                      </div>
                    } @else {
                      <div
                        uiComboboxItem
                        class="item"
                        [value]="entry.value"
                        [label]="entry.label"
                        [keywords]="entry.keywords"
                        [disabled]="entry.disabled"
                      >
                        @if (o.highlight) {
                          <span uiComboboxItemText uiText></span>
                        } @else {
                          {{ entry.label }}
                        }
                        <span *uiComboboxItemIndicator class="indicator">✓</span>
                      </div>
                    }
                  }
                  @if (o.create) {
                    <div *uiComboboxCreate="let state; onCreate: create" class="item"></div>
                  }
                </div>
              } @else {
                <div uiComboboxList>
                  @if (o.grouped) {
                    @for (group of f.groups; track group.label) {
                      <div uiComboboxGroup>
                        <div uiComboboxGroupLabel class="label">{{ group.label }}</div>
                        @if (o.selectAll) {
                          <div uiComboboxSelectAll class="item">{{ f.selectAll }} {{ group.label }}</div>
                        }
                        @for (item of group.items; track item.value) {
                          <div uiComboboxItem class="item" [value]="item.value" [label]="item.label">
                            @if (o.highlight) {
                              <span uiComboboxItemText uiText></span>
                            } @else {
                              {{ item.label }}
                            }
                            <span *uiComboboxItemIndicator class="indicator">✓</span>
                          </div>
                        }
                      </div>
                    }
                  } @else {
                    @if (o.selectAll) {
                      <div uiComboboxSelectAll class="item">{{ f.selectAll }}</div>
                    }
                    @for (item of all(); track item.value) {
                      <div
                        uiComboboxItem
                        class="item"
                        [value]="item.value"
                        [label]="item.label"
                        [keywords]="item.keywords"
                        [disabled]="item.disabled"
                      >
                        @if (o.highlight) {
                          <span uiComboboxItemText uiText></span>
                        } @else {
                          {{ item.label }}
                        }
                        <span *uiComboboxItemIndicator class="indicator">✓</span>
                      </div>
                    }
                  }
                  @if (o.create) {
                    <div *uiComboboxCreate="let state; onCreate: create" class="item"></div>
                  }
                </div>
              }
            </div>
          </ng-container>
        </ng-template>
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Submitted">{{ submitted() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly f = comboboxFixture
  protected readonly o = comboboxOptions() as ReturnType<typeof comboboxOptions> & {
    summary?: number
    defaultValue?: string | string[]
    maxSelected?: number
    container?: HTMLElement | null
    modal?: false
    presentation?: "auto" | "sheet"
  }
  protected readonly remoteMode = this.o.async || this.o.pages
  protected readonly dataMode =
    new URLSearchParams(location.search).has("data") ||
    this.remoteMode ||
    this.o.long ||
    this.o.recent
  protected readonly remote = injectAsyncOptions<Entry>(
    this.o.pages ? searchCountryPages : searchCountries,
    { immediate: this.remoteMode }
  )
  protected readonly action = signal("")
  protected readonly submitted = signal("")
  protected readonly list = signal<Entry[]>(comboboxFixture.items)
  protected readonly created = signal<Entry[]>([])
  protected readonly all = computed(() => [...this.list(), ...this.created()])
  protected readonly labels = computed(
    () =>
      new Map(
        [...comboboxFixture.items, ...this.all()].map((item) => [item.value, item.label])
      )
  )
  protected readonly items = computed((): Shown[] =>
    this.remoteMode
      ? this.remote.state().items
      : this.o.long
        ? longItems()
        : this.o.grouped
          ? comboboxFixture.groups.map((group) => ({
              type: "group" as const,
              label: group.label,
              items: group.items,
            }))
          : this.all()
  )
  protected readonly labelOf = (value: string) => this.labels().get(value) ?? value
  protected readonly create = async (query: string) => {
    this.action.set(`create:${query}`)
    await createDelay(this.o.slow)
    this.created.update((created) => [
      ...created,
      { value: query.toLowerCase(), label: query },
    ])
  }

  constructor() {
    // Items a spec swaps in. Only in the browser: the server has no document.
    const destroyRef = inject(DestroyRef)
    afterNextRender(() => {
      const stop = onItemsChange(changedItems, (next) => this.list.set(next))
      destroyRef.onDestroy(stop)
    })
  }

  protected valuesOf(value: unknown) {
    return (value ?? []) as string[]
  }

  protected shownOf(items: unknown) {
    return (items ?? []) as Shown[]
  }

  protected onValueChange(value: unknown, details: ComboboxValueChangeDetails) {
    if (cancelsValue(value, this.o.cancel)) {
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
