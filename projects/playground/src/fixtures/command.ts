import { UiText } from "@ngx-ui-sdk/core"
import { NgTemplateOutlet } from "@angular/common"
import { Component, signal } from "@angular/core"
import {
  commandFixture as f,
  commandOptions,
  runAction,
} from "tests/fixtures/command"
import { longItems } from "tests/fixtures/select"
import {
  UiCommand,
  UiCommandEmpty,
  UiCommandGroup,
  UiCommandGroupLabel,
  UiCommandInput,
  UiCommandItem,
  UiCommandItemText,
  UiCommandList,
  UiCommandPage,
  UiCommandSeparator,
  UiCommandShortcut,
  UiCommandStatus,
  type CommandData,
  type CommandDataItem,
} from "@ngx-ui-sdk/core/command"

type Entry = CommandData[number]

// Upstream's fixture. With ?highlight, an item's text is written empty and
// its label is the item's, since a text with content of its own keeps it
// here, where Vue marks plain text as well.

@Component({
  selector: "app-fixture",
  imports: [UiText, 
    NgTemplateOutlet,
    UiCommand,
    UiCommandEmpty,
    UiCommandGroup,
    UiCommandGroupLabel,
    UiCommandInput,
    UiCommandItem,
    UiCommandItemText,
    UiCommandList,
    UiCommandPage,
    UiCommandSeparator,
    UiCommandShortcut,
    UiCommandStatus,
  ],
  template: `
    <!-- The data's commands, groups and separators, styled like the composed ones. -->
    <div class="fixture">
      <button>Before</button>
      <div
        uiCommand
        class="command"
        [items]="items"
        [defaultValue]="o.defaultValue"
        [defaultPages]="o.defaultPages"
        [autoHighlight]="o.autoHighlight"
        [filter]="o.filter"
        [status]="o.status"
        [onAction]="onAction"
        (beforeValueChange)="
          lastHighlight.set($event.value + ':' + $event.details.reason)
        "
      >
        <ng-template #data let-entries>
          @for (entry of asEntries(entries); track keyOf(entry, $index)) {
            @if (kindOf(entry) === "separator") {
              <div uiCommandSeparator class="separator"></div>
            } @else if (kindOf(entry) === "group") {
              <div uiCommandGroup>
                @if (groupOf(entry).label) {
                  <div uiCommandGroupLabel class="label">
                    {{ groupOf(entry).label }}
                  </div>
                }
                <ng-container
                  [ngTemplateOutlet]="data"
                  [ngTemplateOutletContext]="{ $implicit: groupOf(entry).items }"
                />
              </div>
            } @else {
              <div
                uiCommandItem
                class="item"
                [value]="commandOf(entry).value"
                [label]="commandOf(entry).label"
                [keywords]="commandOf(entry).keywords"
                [disabled]="commandOf(entry).disabled"
                [shortcut]="commandOf(entry).shortcut"
              >
                @if (o.highlight) {
                  <span uiCommandItemText uiText></span>
                } @else {
                  {{ commandOf(entry).label }}
                }
                @if (commandOf(entry).shortcut) {
                  <span uiCommandShortcut class="shortcut" uiText></span>
                }
              </div>
            }
          }
        </ng-template>
        <input uiCommandInput class="input" [attr.aria-label]="f.input" />
        <div uiCommandEmpty class="empty">{{ f.empty }}</div>
        <div uiCommandStatus #status="uiCommandStatus" class="status">
          {{ status.state().loading ? "Loading…" : "" }}
        </div>
        @if (items) {
          <div uiCommandList #list="uiCommandList" class="command-list">
            <ng-container
              [ngTemplateOutlet]="data"
              [ngTemplateOutletContext]="{ $implicit: list.state().items }"
            />
          </div>
        } @else {
          <div uiCommandList class="command-list">
            <ng-container *uiCommandPage>
              @for (group of f.groups; track group.label; let index = $index) {
                @if (index > 0) {
                  <div uiCommandSeparator class="separator"></div>
                }
                <div uiCommandGroup>
                  <div uiCommandGroupLabel class="label">{{ group.label }}</div>
                  @for (item of group.items; track item.value) {
                    <div
                      uiCommandItem
                      class="item"
                      [value]="o.unvalued ? undefined : item.value"
                      [keywords]="field(item, 'keywords')"
                      [disabled]="field(item, 'disabled')"
                      [shortcut]="field(item, 'shortcut')"
                      [page]="field(item, 'page')"
                      [label]="o.highlight ? item.label : undefined"
                    >
                      @if (o.highlight) {
                        <span uiCommandItemText uiText></span>
                      } @else {
                        {{ item.label }}
                      }
                      @if (field(item, "shortcut")) {
                        <span uiCommandShortcut class="shortcut" uiText></span>
                      }
                    </div>
                  }
                </div>
              }
            </ng-container>
            <ng-container *uiCommandPage="'theme'">
              @for (item of f.theme; track item.value) {
                <div uiCommandItem class="item" [value]="item.value">
                  {{ item.label }}
                </div>
              }
            </ng-container>
          </div>
        }
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Last highlight">{{
        lastHighlight()
      }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly o = commandOptions()
  protected readonly action = signal("")
  protected readonly lastHighlight = signal("")
  protected readonly items: CommandData | undefined = this.o.long
    ? longItems()
    : undefined

  protected readonly onAction = (value: string) => {
    this.action.set(`action:${value}`)
    return runAction(this.o.slow, this.o.fail)
  }

  // An item's optional field, which only some of the fixture's items have.
  protected field<K extends string>(item: object, key: K) {
    return (item as Record<K, any>)[key]
  }

  protected asEntries(entries: unknown) {
    return entries as CommandData
  }

  protected kindOf(entry: Entry) {
    return typeof entry === "string" || !("type" in entry) ? "item" : entry.type
  }

  protected groupOf(entry: Entry) {
    return entry as { label?: string; items: CommandData }
  }

  // A plain string is a command whose value is its label.
  protected commandOf(entry: Entry): CommandDataItem {
    return typeof entry === "string"
      ? { value: entry, label: entry }
      : (entry as CommandDataItem)
  }

  // Groups keep their key while filtering hides the ones before them.
  protected keyOf(entry: Entry, index: number) {
    return typeof entry === "string"
      ? entry
      : !("type" in entry)
        ? entry.value
        : entry.type === "group"
          ? `group-${entry.label ?? index}`
          : `separator-${index}`
  }
}

export { Fixture }
