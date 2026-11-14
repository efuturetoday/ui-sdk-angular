import { UiText } from "@ngx-ui-sdk/core"
import { Component, computed, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  UiCommand,
  UiCommandEmpty,
  UiCommandInput,
  UiCommandItem,
  UiCommandList,
} from "@ngx-ui-sdk/core/command"
import {
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectLabel,
  UiSelectTrigger,
  UiSelectValue,
} from "@ngx-ui-sdk/core/select"

type Mode = "fuzzy" | "contains" | "startsWith" | "words"

@Component({
  selector: "app-example",
  imports: [
    UiText,
    LucideCheck,
    LucideChevronDown,
    UiCommand,
    UiCommandEmpty,
    UiCommandInput,
    UiCommandItem,
    UiCommandList,
    UiSelect,
    UiSelectContent,
    UiSelectItem,
    UiSelectItemIndicator,
    UiSelectLabel,
    UiSelectTrigger,
    UiSelectValue,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <ng-container
          uiSelect
          [items]="modes"
          [value]="mode()"
          (valueChange)="setMode($event)"
        >
          <div uiSelectLabel>Filter</div>
          <button uiSelectTrigger>
            <span uiSelectValue uiText></span>
            <svg lucideChevronDown aria-hidden="true"></svg>
          </button>
          <div *uiSelectContent>
            @for (option of modes; track option.value) {
              <div uiSelectItem [value]="option.value">
                {{ option.label }}
                <span *uiSelectItemIndicator><svg lucideCheck></svg></span>
              </div>
            }
          </div>
        </ng-container>
      </div>
      <div uiCommand [filter]="filter()">
        <input
          uiCommandInput
          aria-label="Search commands"
          placeholder="Try “nf”, “zo in” or “smiley”"
        />
        <div uiCommandEmpty>No results found.</div>
        <div uiCommandList>
          @for (command of commands; track command.label) {
            <div
              uiCommandItem
              [value]="command.label"
              [keywords]="command.keywords"
            >
              {{ command.label }}
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly commands: { label: string; keywords?: string[] }[] = [
    { label: "Home" },
    { label: "Inbox", keywords: ["mail", "messages"] },
    { label: "Documents" },
    { label: "Downloads" },
    { label: "New file" },
    { label: "New folder" },
    { label: "Copy" },
    { label: "Paste" },
    { label: "Delete", keywords: ["remove", "trash"] },
    { label: "Zoom in" },
    { label: "Zoom out" },
    { label: "Search emoji", keywords: ["smiley", "face"] },
    { label: "Keyboard shortcuts", keywords: ["hotkeys"] },
    { label: "Settings", keywords: ["preferences"] },
  ]
  protected readonly modes: { value: Mode; label: string }[] = [
    { value: "fuzzy", label: "Fuzzy" },
    { value: "contains", label: "Contains" },
    { value: "startsWith", label: "Starts with" },
    { value: "words", label: "Words" },
  ]
  protected readonly mode = signal<Mode>("fuzzy")
  protected readonly filter = computed(() => {
    const mode = this.mode()
    return mode === "words" ? this.words : mode
  })

  protected setMode(next: unknown) {
    if (next) {
      this.mode.set(next as Mode)
    }
  }

  protected words(item: { label: string }, query: string) {
    return query
      .toLowerCase()
      .split(/\s+/)
      .every((word) =>
        item.label
          .toLowerCase()
          .split(" ")
          .some((part) => part.startsWith(word))
      )
  }
}

export { Example }
