import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from "@angular/core"
import {
  LucideCheck,
  LucideChevronDown,
  LucidePalette,
  LucideSearch,
} from "@lucide/angular"
import {
  UiCommand,
  UiCommandEmpty,
  UiCommandGroup,
  UiCommandGroupLabel,
  UiCommandInput,
  UiCommandItem,
  UiCommandList,
} from "@ngx-ui-sdk/core/command"
import {
  UiDialog,
  UiDialogBackdrop,
  UiDialogContent,
  UiDialogTitle,
  UiDialogTrigger,
} from "@ngx-ui-sdk/core/dialog"
import { palettes } from "../themes/palettes"

// A theme and one of its palettes, as `daisyui/dracula`, or the theme with
// its own colors, as `daisyui`.
type Choice = string

// How long a highlight rests before the page shows it, in milliseconds.
const previewDelay = 150

const titleOf = (name: string) =>
  name.replace(
    /(^|-)(\w)/g,
    (_, dash: string, letter: string) =>
      (dash ? " " : "") + letter.toUpperCase()
  )

// The themes and their palettes in a command palette. Highlighting one shows
// it on the page; Enter keeps it, and Escape goes back to the one before.
@Component({
  selector: "app-theme-picker",
  imports: [
    LucideCheck,
    LucideChevronDown,
    LucidePalette,
    LucideSearch,
    UiCommand,
    UiCommandEmpty,
    UiCommandGroup,
    UiCommandGroupLabel,
    UiCommandInput,
    UiCommandItem,
    UiCommandList,
    UiDialog,
    UiDialogBackdrop,
    UiDialogContent,
    UiDialogTitle,
    UiDialogTrigger,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Its own look, not a theme's, so it stays put while the page behind it
  // changes. Only its colors follow the palette shown.
  styles: `
    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }

    svg {
      flex-shrink: 0;
      width: 16px;
      height: 16px;
    }

    .trigger {
      display: flex;
      align-items: center;
      gap: 6px;
      height: 32px;
      padding: 0 10px;
      border: 1px solid var(--ui-border);
      border-radius: 8px;
      background: none;
      color: var(--ui-foreground);
      font: inherit;
      font-size: 13px;
      white-space: nowrap;
      cursor: pointer;
    }

    .trigger:hover {
      background: var(--ui-muted);
    }

    .trigger .label {
      color: var(--ui-muted-foreground);
    }

    /* On a phone, the icon alone: the name would widen the page. */
    @media (width < 40rem) {
      .trigger .label,
      .trigger .value {
        display: none;
      }
    }

    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 100;
      background: rgb(0 0 0 / 0.4);
    }

    .picker {
      position: fixed;
      inset: min(6rem, 10dvh) 0 auto;
      z-index: 100;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      width: min(32rem, 100% - 2rem);
      height: min(36rem, 80dvh);
      margin: 0 auto;
      overflow: hidden;
      border: 1px solid var(--ui-border);
      border-radius: 12px;
      background: var(--ui-surface-2);
      box-shadow: 0 24px 64px rgb(0 0 0 / 0.3);
      color: var(--ui-foreground);
      font-size: 14px;
    }

    [uiCommand] {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-height: 0;
    }

    .search {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      gap: 10px;
      height: 48px;
      padding: 0 16px;
      border-block-end: 1px solid var(--ui-border);
      color: var(--ui-muted-foreground);
    }

    .search input {
      flex: 1;
      min-width: 0;
      height: 100%;
      padding: 0;
      border: 0;
      background: none;
      color: var(--ui-foreground);
      font: inherit;
      outline: none;
    }

    [uiCommandEmpty]:not(:empty) {
      padding: 2rem;
      color: var(--ui-muted-foreground);
      text-align: center;
    }

    [uiCommandList] {
      flex: 1;
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: 0 8px 8px;
    }

    /* A group's theme stays on top while its palettes scroll by. */
    [uiCommandGroupLabel] {
      position: sticky;
      top: 0;
      z-index: 1;
      padding: 12px 8px 6px;
      background: var(--ui-surface-2);
      color: var(--ui-muted-foreground);
      font:
        500 11px var(--font-geist-mono),
        ui-monospace,
        monospace;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    [uiCommandItem] {
      display: flex;
      align-items: center;
      gap: 10px;
      height: 36px;
      padding: 0 8px;
      border-radius: 6px;
      cursor: pointer;
    }

    [uiCommandItem][data-highlighted] {
      background: var(--ui-muted);
    }

    /* As wide for every palette, so the names line up. */
    .swatches {
      display: flex;
      flex-shrink: 0;
      width: 56px;
    }

    .swatches span {
      width: 14px;
      height: 14px;
      margin-inline-end: -3px;
      border: 1px solid rgb(128 128 128 / 0.4);
      border-radius: 50%;
    }

    .name {
      flex: 1;
    }

    .scheme {
      color: var(--ui-muted-foreground);
      font-size: 12px;
    }
  `,
  template: `
    <ng-container uiDialog [open]="open()" (openChange)="toggled($event)">
      <button uiDialogTrigger class="trigger" aria-label="Theme" data-round>
        <svg lucidePalette aria-hidden="true"></svg>
        <span class="label">Theme</span>
        <span class="value">{{ labelOf(current()) }}</span>
        <svg lucideChevronDown aria-hidden="true"></svg>
      </button>
      <div *uiDialogBackdrop class="backdrop"></div>
      <div *uiDialogContent class="picker" data-round>
        <h2 uiDialogTitle class="visually-hidden">Theme</h2>
        <div
          uiCommand
          [defaultValue]="current()"
          [onAction]="choose"
          (valueChange)="highlighted($event)">
          <div class="search">
            <svg lucideSearch aria-hidden="true"></svg>
            <input
              uiCommandInput
              aria-label="Search themes"
              placeholder="Search themes and palettes…" />
          </div>
          <div uiCommandEmpty>No theme found.</div>
          <div uiCommandList>
            @for (group of groups(); track group.theme) {
              <div uiCommandGroup>
                <div uiCommandGroupLabel>{{ group.label }}</div>
                @for (item of group.items; track item.value) {
                  <div uiCommandItem [value]="item.value" data-round>
                    <span class="swatches" aria-hidden="true">
                      @for (swatch of item.swatches; track $index) {
                        <span [style.background]="swatch" data-round></span>
                      }
                    </span>
                    <span class="name">{{ item.label }}</span>
                    @if (item.scheme) {
                      <span class="scheme">{{ item.scheme }}</span>
                    }
                    @if (item.value === current()) {
                      <svg lucideCheck aria-hidden="true"></svg>
                    }
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </ng-container>
  `,
})
class ThemePicker {
  /** The themes, by name, with the label each shows. */
  readonly themes = input.required<{ value: string; label: string }[]>()
  /** The theme and palette chosen. */
  readonly current = input.required<Choice>()
  /** The theme and palette highlighted, to show while choosing, or `null` once closed. */
  readonly preview = output<Choice | null>()
  /** The theme and palette chosen with Enter or a click. */
  readonly chosen = output<Choice>()
  /** Emits as the picker opens, to load the themes ahead. */
  readonly opened = output<void>()

  protected readonly open = signal(false)
  #previewing?: ReturnType<typeof setTimeout>

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.#previewing))
  }
  protected readonly groups = computed(() =>
    this.themes().map(({ value: theme, label }) => ({
      theme,
      label,
      items: (palettes[theme] ?? []).map((palette) => ({
        value: palette.name ? `${theme}/${palette.name}` : theme,
        label: palette.name ? titleOf(palette.name) : label,
        scheme: palette.scheme,
        swatches: palette.swatches,
      })),
    }))
  )

  protected labelOf(choice: Choice) {
    const [theme, palette] = choice.split("/")
    const label = this.themes().find((each) => each.value === theme)?.label
    return palette ? `${label} · ${titleOf(palette)}` : label
  }

  // Shows a highlighted palette once the highlight rests, not each one the
  // pointer or the arrow keys pass on the way.
  protected highlighted(value: Choice | null) {
    clearTimeout(this.#previewing)
    this.#previewing = setTimeout(() => this.preview.emit(value), previewDelay)
  }

  protected toggled(open: boolean) {
    this.open.set(open)
    clearTimeout(this.#previewing)
    if (open) {
      this.opened.emit()
    } else {
      this.preview.emit(null)
    }
  }

  protected readonly choose = (value: string) => {
    this.chosen.emit(value)
    this.toggled(false)
  }
}

export { type Choice, ThemePicker }
