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
  autocompleteFixture,
  autocompleteOptions,
  changedItems,
  searchFruits,
} from "tests/fixtures/autocomplete"
import { onItemsChange } from "tests/fixtures/items"
import { serializeForm } from "tests/fixtures/select"
import {
  injectAsyncOptions,
} from "ngx-ui-sdk"
import {
  type AutocompleteValueChangeDetails,
  UiAutocomplete,
  UiAutocompleteClear,
  UiAutocompleteContent,
  UiAutocompleteEmpty,
  UiAutocompleteGroup,
  UiAutocompleteGroupLabel,
  UiAutocompleteInput,
  UiAutocompleteItem,
  UiAutocompleteItemText,
  UiAutocompleteLabel,
  UiAutocompleteList,
  UiAutocompleteSeparator,
  UiAutocompleteStatus,
  UiAutocompleteTrigger,
} from "ngx-ui-sdk/autocomplete"

type Entry = {
  value: string
  label: string
  keywords?: string[]
  disabled?: boolean
}
type Shown =
  | string
  | Entry
  | { type: "separator" }
  | { type: "group"; label: string; items: Entry[] }

// The data variant renders the same autocomplete from `items`, with ?data.
@Component({
  selector: "app-fixture",
  imports: [
    NgTemplateOutlet,
    UiAutocomplete,
    UiAutocompleteClear,
    UiAutocompleteContent,
    UiAutocompleteEmpty,
    UiAutocompleteGroup,
    UiAutocompleteGroupLabel,
    UiAutocompleteInput,
    UiAutocompleteItem,
    UiAutocompleteItemText,
    UiAutocompleteLabel,
    UiAutocompleteList,
    UiAutocompleteSeparator,
    UiAutocompleteStatus,
    UiAutocompleteTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form class="select-form" [attr.aria-label]="f.formLabel" (submit)="onSubmit($event)">
        @if (o.fieldset) {
          <fieldset disabled style="display: contents">
            <ng-container [ngTemplateOutlet]="autocompleteTemplate" />
          </fieldset>
        } @else {
          <div style="display: contents">
            <ng-container [ngTemplateOutlet]="autocompleteTemplate" />
          </div>
        }
        <ng-template #autocompleteTemplate>
          <ng-container
            uiAutocomplete
            [name]="f.name"
            [container]="o.container"
            [items]="dataMode ? items() : undefined"
            [emptyItems]="o.recent ? f.recent : undefined"
            [filter]="o.async ? false : undefined"
            [status]="o.async ? remote.state().status : undefined"
            [defaultValue]="o.defaultValue"
            [inlineComplete]="o.inlineComplete"
            [autoHighlight]="o.autoHighlight"
            [openOnFocus]="o.openOnFocus"
            [submitOnSelect]="o.submitOnSelect"
            [required]="o.required"
            [readOnly]="o.readOnly"
            [disabled]="o.disabled"
            [presentation]="o.presentation"
            (beforeValueChange)="onValueChange($event.value, $event.details)"
            (valueSubmit)="action.set('submit:' + $event.value)"
          >
            <div uiAutocompleteLabel class="label">{{ f.label }}</div>
            <input uiAutocompleteInput class="input" />
            <button uiAutocompleteTrigger [attr.aria-label]="f.trigger">▾</button>
            <button *uiAutocompleteClear>{{ f.clear }}</button>
            <div *uiAutocompleteContent class="popup list-popup">
              @if (!o.nostatus) {
                <div uiAutocompleteStatus #status="uiAutocompleteStatus" class="status">{{
                  status.state().loading ? "Loading…" : ""
                }}</div>
              }
              <div uiAutocompleteEmpty class="empty">{{ f.empty }}</div>
              @if (dataMode) {
                <div uiAutocompleteList #list="uiAutocompleteList">
                  @for (entry of shownOf(list.state().items); track $index) {
                    @if (typeof entry === "string") {
                      <div uiAutocompleteItem class="item" [value]="entry" [label]="entry">
                        @if (o.highlight) {
                          <span uiAutocompleteItemText></span>
                        } @else {
                          {{ entry }}
                        }
                      </div>
                    } @else if ("value" in entry) {
                      <div
                        uiAutocompleteItem
                        class="item"
                        [value]="entry.value"
                        [label]="entry.label"
                        [keywords]="entry.keywords"
                        [disabled]="entry.disabled"
                      >
                        @if (o.highlight) {
                          <span uiAutocompleteItemText></span>
                        } @else {
                          {{ entry.label }}
                        }
                      </div>
                    } @else if (entry.type === "separator") {
                      <div uiAutocompleteSeparator></div>
                    } @else {
                      <div uiAutocompleteGroup>
                        <div uiAutocompleteGroupLabel class="label">{{ entry.label }}</div>
                        @for (item of entry.items; track item.value) {
                          <div
                            uiAutocompleteItem
                            class="item"
                            [value]="item.value"
                            [label]="item.label"
                            [keywords]="item.keywords"
                            [disabled]="item.disabled"
                          >
                            @if (o.highlight) {
                              <span uiAutocompleteItemText></span>
                            } @else {
                              {{ item.label }}
                            }
                          </div>
                        }
                      </div>
                    }
                  }
                </div>
              } @else {
                <div uiAutocompleteList>
                  @if (o.grouped) {
                    @for (group of f.groups; track group.label) {
                      <div uiAutocompleteGroup>
                        <div uiAutocompleteGroupLabel class="label">{{ group.label }}</div>
                        @for (item of group.items; track item.value) {
                          <div uiAutocompleteItem class="item" [value]="item.value" [label]="item.label">
                            {{ item.label }}
                          </div>
                        }
                      </div>
                    }
                  } @else {
                    @for (item of list(); track item.value) {
                      <div
                        uiAutocompleteItem
                        class="item"
                        [value]="item.value"
                        [label]="item.label"
                        [keywords]="item.keywords"
                        [disabled]="item.disabled"
                      >
                        @if (o.highlight) {
                          <span uiAutocompleteItemText></span>
                        } @else {
                          {{ item.label }}
                        }
                      </div>
                    }
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
  protected readonly f = autocompleteFixture
  protected readonly o = autocompleteOptions() as ReturnType<
    typeof autocompleteOptions
  > & {
    defaultValue?: string
    container?: HTMLElement | null
    presentation?: "auto" | "sheet"
  }
  protected readonly dataMode =
    new URLSearchParams(location.search).has("data") ||
    this.o.async ||
    this.o.recent
  protected readonly remote = injectAsyncOptions(searchFruits, {
    immediate: this.o.async,
  })
  protected readonly action = signal("")
  protected readonly submitted = signal("")
  protected readonly list = signal<Entry[]>(autocompleteFixture.items)
  protected readonly items = computed((): Shown[] =>
    this.o.async
      ? (this.remote.state().items as Shown[])
      : this.o.grouped
        ? autocompleteFixture.groups.map((group) => ({
            type: "group" as const,
            label: group.label,
            items: group.items,
          }))
        : this.list()
  )

  constructor() {
    // Items a spec swaps in. Only in the browser: the server has no document.
    const destroyRef = inject(DestroyRef)
    afterNextRender(() => {
      const stop = onItemsChange(changedItems, (next) => this.list.set(next))
      destroyRef.onDestroy(stop)
    })
  }

  protected shownOf(items: unknown) {
    return (items ?? []) as Shown[]
  }

  protected onValueChange(value: string, details: AutocompleteValueChangeDetails) {
    this.action.set(`value:${value}:${details.reason}`)
    if (this.o.async) {
      this.remote.setQuery(value)
    }
  }

  protected onSubmit(event: Event) {
    event.preventDefault()
    this.submitted.set(serializeForm(event.target as HTMLFormElement))
  }
}

export { Fixture }
