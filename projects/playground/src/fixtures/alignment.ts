import { Component, signal } from "@angular/core"
import {
  alignmentFixture,
  alignmentOptions,
} from "tests/fixtures/alignment"
import {
  createMenuController,
  UiMenu,
  UiMenuCheckboxItem,
  UiMenuContent,
  UiMenuContextTrigger,
  UiMenuItem,
  UiMenuItemIndicator,
  UiMenuRadioGroup,
  UiMenuRadioItem,
  UiMenuTrigger,
  type MenuDataItem,
} from "@ngx-ui-sdk/core/menu"
import {
  createPopoverController,
  UiPopover,
  UiPopoverContent,
  UiPopoverTitle,
} from "@ngx-ui-sdk/core/popover"
import {
  createTabsController,
  UiTabs,
  UiTabsList,
  UiTabsPanel,
  UiTabsTab,
} from "@ngx-ui-sdk/core/tabs"

@Component({
  selector: "app-fixture",
  imports: [
    UiMenu,
    UiMenuCheckboxItem,
    UiMenuContent,
    UiMenuContextTrigger,
    UiMenuItem,
    UiMenuItemIndicator,
    UiMenuRadioGroup,
    UiMenuRadioItem,
    UiMenuTrigger,
    UiPopover,
    UiPopoverContent,
    UiPopoverTitle,
    UiTabs,
    UiTabsList,
    UiTabsPanel,
    UiTabsTab,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>

      <ul class="rows">
        @for (row of f.rows; track row) {
          <li>
            Row {{ row }}
            <button
              uiMenuTrigger
              [controller]="rowMenu"
              [payload]="row"
              [attr.aria-label]="'Actions for ' + row"
              >…</button
            >
          </li>
        }
      </ul>
      <ng-container
        uiMenu
        [controller]="rowMenu"
        [onAction]="onRowAction"
        (openChangeComplete)="complete.set($event ? 'open' : 'closed')"
      >
        <div *uiMenuContent="let state; keepMounted: keepMounted" class="popup">
          <div class="payload">Row {{ state().payload }}</div>
          @for (item of f.rowActions; track item.value) {
            <div
              uiMenuItem
              class="item"
              [value]="item.value"
              [onSelect]="onSelect(item.value)"
            >
              {{ item.label }}
            </div>
          }
        </div>
      </ng-container>

      <ng-container uiPopover [controller]="details" modal="trap-focus">
        <div *uiPopoverContent="let state" class="popup">
          <form method="dialog">
            <h2 uiPopoverTitle class="title">Details</h2>
            <p class="payload">Details for {{ state().payload }}</p>
            <button value="save">Save</button>
            <button value="cancel">Cancel</button>
          </form>
        </div>
      </ng-container>
      <button (click)="showDetails('button')">Show details</button>

      <ng-container uiMenu [onAction]="onCanvasAction">
        <div uiMenuContextTrigger class="canvas">Canvas</div>
        <div *uiMenuContent="let state" class="popup">
          @for (item of f.canvasActions; track item.value) {
            <div uiMenuItem class="item" [value]="item.value">
              {{ item.label }}
            </div>
          }
        </div>
      </ng-container>

      <ng-container
        uiMenu
        [items]="dataItems"
        (checkedChange)="
          change.set('checked:' + $event.details.value + ':' + $event.checked)
        "
        (valueChange)="
          change.set('value:' + $any($event.details).group + ':' + $event.value)
        "
      >
        <button uiMenuTrigger>Data</button>
        <div *uiMenuContent="let state" class="popup">
          @for (entry of dataItems; track $index) {
            @if (entry.type === "checkbox") {
              <div uiMenuCheckboxItem class="item" [value]="entry.value">
                <span *uiMenuItemIndicator class="indicator">✓</span>
                {{ entry.label }}
              </div>
            } @else if (entry.type === "radio-group") {
              <div uiMenuRadioGroup [name]="entry.name">
                @for (radio of entry.items; track radio.value) {
                  <div uiMenuRadioItem class="item" [value]="radio.value">
                    <span *uiMenuItemIndicator class="indicator">•</span>
                    {{ radio.label }}
                  </div>
                }
              </div>
            }
          }
        </div>
      </ng-container>

      <ng-container uiMenu>
        <button uiMenuTrigger>View</button>
        <div *uiMenuContent="let state" class="popup">
          @for (value of views; track value) {
            <div uiMenuCheckboxItem class="item" [value]="value">
              <span *uiMenuItemIndicator class="indicator">✓</span>
              {{ value === "ruler" ? "Ruler" : "Guides" }}
            </div>
          }
        </div>
      </ng-container>

      <div
        uiTabs
        class="tabs"
        [controller]="sections"
        hiddenUntilFound
        (valueChange)="tabChanges.update((count) => count + 1)"
      >
        <div uiTabsList class="tablist scrolling" aria-label="Sections">
          @for (section of f.sections; track section) {
            <button uiTabsTab class="tab" [value]="section.toLowerCase()">
              {{ section }}
            </button>
          }
        </div>
        @for (section of f.sections; track section) {
          <div *uiTabsPanel="section.toLowerCase()" class="panel">
            The {{ section }} section
          </div>
        }
      </div>
      <button (click)="sections.select('hotel')">Show the last section</button>

      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output aria-label="Last result">{{ result() }}</output>
      <output aria-label="Last complete">{{ complete() }}</output>
      <output aria-label="Last change">{{ change() }}</output>
      <output aria-label="Tab changes">{{ tabChanges() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly f = alignmentFixture
  protected readonly views = ["ruler", "guides"]
  protected readonly rowMenu = createMenuController<string>()
  protected readonly details = createPopoverController<string>()
  protected readonly sections = createTabsController()
  protected readonly keepMounted = alignmentOptions().keepMounted
  protected readonly action = signal("")
  protected readonly result = signal("")
  protected readonly complete = signal("")
  protected readonly change = signal("")
  protected readonly tabChanges = signal(0)
  protected readonly dataItems: MenuDataItem[] = [
    { type: "checkbox", value: "grid", label: "Grid" },
    {
      type: "radio-group",
      name: "sort",
      items: [
        { value: "name", label: "Name" },
        { value: "date", label: "Date" },
      ],
    },
  ]

  protected readonly onRowAction = (value: string) =>
    this.action.set(`${value}:${this.rowMenu.getPayload()}`)
  protected readonly onCanvasAction = (value: string) => this.action.set(value)

  protected showDetails(payload: string) {
    this.details.open({ payload }).then((closed) => {
      this.result.set(`${closed.reason}:${closed.returnValue ?? ""}`)
    })
  }

  protected onSelect(value: string) {
    return () => {
      if (value === "details") {
        this.showDetails(String(this.rowMenu.getPayload()))
      }
    }
  }
}

export { Fixture }
