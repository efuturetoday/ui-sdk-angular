import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import { injectAsyncOptions } from "@ngx-ui-sdk/core"
import {
  UiCombobox,
  UiComboboxContent,
  UiComboboxEmpty,
  UiComboboxInput,
  UiComboboxItem,
  UiComboboxItemIndicator,
  UiComboboxLabel,
  UiComboboxList,
  UiComboboxStatus,
  UiComboboxTrigger,
} from "@ngx-ui-sdk/core/combobox"

const movieTitles = [
  "The Shawshank Redemption",
  "The Godfather",
  "The Dark Knight",
  "Pulp Fiction",
  "Schindler's List",
  "The Lord of the Rings",
  "Fight Club",
  "Forrest Gump",
  "Inception",
  "The Matrix",
  "Goodfellas",
  "Interstellar",
  "Parasite",
  "Spirited Away",
  "Whiplash",
  "The Prestige",
  "The Departed",
  "Gladiator",
  "Alien",
  "Casablanca",
  "Amélie",
  "Arrival",
]

function searchMovies(query: string, { signal }: { signal: AbortSignal }) {
  return new Promise<{ value: string; label: string }[]>((resolve, reject) => {
    const timer = setTimeout(() => {
      const needle = query.trim().toLowerCase()
      resolve(
        movieTitles
          .filter((title) => title.toLowerCase().includes(needle))
          .map((title) => ({
            value: title.toLowerCase().replace(/\W+/g, "-"),
            label: title,
          }))
      )
    }, 500)
    signal.addEventListener("abort", () => {
      clearTimeout(timer)
      reject(signal.reason)
    })
  })
}

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideChevronDown,
    UiCombobox,
    UiComboboxContent,
    UiComboboxEmpty,
    UiComboboxInput,
    UiComboboxItem,
    UiComboboxItemIndicator,
    UiComboboxLabel,
    UiComboboxList,
    UiComboboxStatus,
    UiComboboxTrigger,
  ],
  template: `
    <ng-container
      uiCombobox
      [items]="movies.state().items"
      defaultQuery="the"
      [filter]="false"
      [status]="movies.state().status"
      (queryChange)="movies.setQuery($event)">
      <div data-slot="stack">
        <div uiComboboxLabel>Movie</div>
        <div data-slot="row">
          <input uiComboboxInput placeholder="Search movies…" />
          <button uiComboboxTrigger aria-label="Show movies">
            <svg lucideChevronDown aria-hidden="true"></svg>
          </button>
        </div>
      </div>
      <div *uiComboboxContent>
        <div uiComboboxStatus #status="uiComboboxStatus">
          {{
            status.state().status === "error"
              ? "Couldn't load movies."
              : status.state().loading
                ? "Searching…"
                : status.state().count +
                  " " +
                  (status.state().count === 1 ? "movie" : "movies")
          }}
        </div>
        <div uiComboboxEmpty #empty="uiComboboxEmpty">
          @if (empty.state().empty && !empty.state().loading) {
            No movies match “{{ empty.state().query }}”.
          }
        </div>
        <div uiComboboxList #list="uiComboboxList">
          @for (item of moviesOf(list.state().items); track item.value) {
            <div
              uiComboboxItem
              [value]="item.value"
              [label]="item.label"
              [disabled]="item.disabled">
              {{ item.label }}
              <span *uiComboboxItemIndicator>
                <svg lucideCheck aria-hidden="true"></svg>
              </span>
            </div>
          }
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  protected readonly movies = injectAsyncOptions(searchMovies, {
    debounce: 300,
    query: "the",
    immediate: true,
  })

  protected moviesOf(items: unknown) {
    return (items ?? []) as {
      value: string
      label: string
      disabled?: boolean
    }[]
  }
}

export { Example }
