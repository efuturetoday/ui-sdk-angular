import { NgTemplateOutlet } from "@angular/common"
import { Component, signal } from "@angular/core"
import {
  exposeLayers,
  leakComponent,
  leakTreeItems,
  leakWaterfallItems,
  perfItems,
} from "tests/fixtures/perf"
import {
  UiAccordion,
  UiAccordionHeader,
  UiAccordionItem,
  UiAccordionPanel,
  UiAccordionTrigger,
  UiAutocomplete,
  UiAutocompleteContent,
  UiAutocompleteInput,
  UiAutocompleteItem,
  UiAutocompleteList,
  UiCollapsible,
  UiCollapsiblePanel,
  UiCollapsibleTrigger,
  UiCombobox,
  UiComboboxContent,
  UiComboboxInput,
  UiComboboxItem,
  UiComboboxList,
  UiDialog,
  UiDialogClose,
  UiDialogContent,
  UiDialogDescription,
  UiDialogTitle,
  UiDialogTrigger,
  UiDrawer,
  UiDrawerBackdrop,
  UiDrawerClose,
  UiDrawerContent,
  UiDrawerDescription,
  UiDrawerTitle,
  UiDrawerTrigger,
  UiHoverCard,
  UiHoverCardContent,
  UiHoverCardTrigger,
  UiMenu,
  UiMenuContent,
  UiMenuItem,
  UiMenuTrigger,
  UiPopover,
  UiPopoverClose,
  UiPopoverContent,
  UiPopoverTrigger,
  UiResizable,
  UiResizableHandle,
  UiResizablePanel,
  UiScrollArea,
  UiScrollAreaContent,
  UiScrollAreaScrollbar,
  UiScrollAreaThumb,
  UiScrollAreaViewport,
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectTrigger,
  UiSelectValue,
  UiSlider,
  UiSliderControl,
  UiSliderIndicator,
  UiSliderThumb,
  UiSliderTrack,
  UiTabs,
  UiTabsIndicator,
  UiTabsList,
  UiTabsPanel,
  UiTabsTab,
  UiToolbar,
  UiToolbarButton,
  UiTooltip,
  UiTooltipContent,
  UiTooltipTrigger,
  UiTree,
  UiTreeGroup,
  UiTreeItem,
  UiTreeItemLabel,
  UiWaterfall,
  UiWaterfallBar,
  UiWaterfallRow,
  UiWaterfallRowHeader,
  type TreeItemData,
} from "ui-sdk-angular"

// One component for the leak specs, picked with ?component=, and a button
// that mounts and unmounts it. The tree's and the waterfall's rows are
// written out, which Vue renders from their data.
@Component({
  selector: "app-fixture",
  imports: [NgTemplateOutlet, UiAccordion, UiAccordionHeader, UiAccordionItem, UiAccordionPanel, UiAccordionTrigger, UiAutocomplete, UiAutocompleteContent, UiAutocompleteInput, UiAutocompleteItem, UiAutocompleteList, UiCollapsible, UiCollapsiblePanel, UiCollapsibleTrigger, UiCombobox, UiComboboxContent, UiComboboxInput, UiComboboxItem, UiComboboxList, UiDialog, UiDialogClose, UiDialogContent, UiDialogDescription, UiDialogTitle, UiDialogTrigger, UiDrawer, UiDrawerBackdrop, UiDrawerClose, UiDrawerContent, UiDrawerDescription, UiDrawerTitle, UiDrawerTrigger, UiHoverCard, UiHoverCardContent, UiHoverCardTrigger, UiMenu, UiMenuContent, UiMenuItem, UiMenuTrigger, UiPopover, UiPopoverClose, UiPopoverContent, UiPopoverTrigger, UiResizable, UiResizableHandle, UiResizablePanel, UiScrollArea, UiScrollAreaContent, UiScrollAreaScrollbar, UiScrollAreaThumb, UiScrollAreaViewport, UiSelect, UiSelectContent, UiSelectItem, UiSelectTrigger, UiSelectValue, UiSlider, UiSliderControl, UiSliderIndicator, UiSliderThumb, UiSliderTrack, UiTabs, UiTabsIndicator, UiTabsList, UiTabsPanel, UiTabsTab, UiToolbar, UiToolbarButton, UiTooltip, UiTooltipContent, UiTooltipTrigger, UiTree, UiTreeGroup, UiTreeItem, UiTreeItemLabel, UiWaterfall, UiWaterfallBar, UiWaterfallRow, UiWaterfallRowHeader],
  template: `
<div class="fixture">
  <button>Before</button>
  @if (mounted()) {
    @switch (component) {
      @case ("menu") {
        <ng-container uiMenu>
          <button uiMenuTrigger>Open</button>
          <div *uiMenuContent="let state" class="popup">
            @for (item of items; track item.value) {
              <div uiMenuItem class="item" [value]="item.value">{{ item.label }}</div>
            }
          </div>
        </ng-container>
      }
      @case ("select") {
        <ng-container uiSelect [defaultValue]="items[0]!.value">
          <button uiSelectTrigger aria-label="Open" class="trigger">
            <span uiSelectValue></span>
          </button>
          <div *uiSelectContent class="popup list-popup">
            @for (item of items; track item.value) {
              <div uiSelectItem class="item" [value]="item.value" [label]="item.label">{{ item.label }}</div>
            }
          </div>
        </ng-container>
      }
      @case ("combobox") {
        <ng-container uiCombobox>
          <input uiComboboxInput aria-label="Open" class="input" />
          <div *uiComboboxContent class="popup list-popup">
            <div uiComboboxList>
              @for (item of items; track item.value) {
                <div uiComboboxItem class="item" [value]="item.value" [label]="item.label">{{ item.label }}</div>
              }
            </div>
          </div>
        </ng-container>
      }
      @case ("autocomplete") {
        <ng-container uiAutocomplete>
          <input uiAutocompleteInput aria-label="Open" class="input" />
          <div *uiAutocompleteContent class="popup list-popup">
            <div uiAutocompleteList>
              @for (item of items; track item.value) {
                <div uiAutocompleteItem class="item" [value]="item.label">{{ item.label }}</div>
              }
            </div>
          </div>
        </ng-container>
      }
      @case ("popover") {
        <ng-container uiPopover>
          <button uiPopoverTrigger>Open</button>
          <div *uiPopoverContent class="popup" aria-label="Details">
            Details.
            <button uiPopoverClose>Close</button>
          </div>
        </ng-container>
      }
      @case ("dialog") {
        <ng-container uiDialog>
          <button uiDialogTrigger>Open</button>
          <div *uiDialogContent class="dialog">
            <h2 uiDialogTitle class="title">Delete it?</h2>
            <p uiDialogDescription class="description">This can't be undone.</p>
            <button uiDialogClose>Cancel</button>
          </div>
        </ng-container>
      }
      @case ("drawer") {
        <ng-container uiDrawer>
          <button uiDrawerTrigger>Open</button>
          <div *uiDrawerBackdrop class="backdrop"></div>
          <div *uiDrawerContent class="dialog">
            <h2 uiDrawerTitle class="title">Move goal</h2>
            <p uiDrawerDescription class="description">Set your daily goal.</p>
            <button uiDrawerClose>Cancel</button>
          </div>
        </ng-container>
      }
      @case ("hover-card") {
        <ng-container uiHoverCard [delay]="0">
          <a uiHoverCardTrigger href="#profile">Open</a>
          <div *uiHoverCardContent class="hover-card-content">A profile.</div>
        </ng-container>
      }
      @case ("slider") {
        <div uiSlider name="volume" [defaultValue]="50">
          <div uiSliderControl class="slider-control">
            <div uiSliderTrack class="slider-track">
              <div uiSliderIndicator class="slider-indicator"></div>
              <div uiSliderThumb class="slider-thumb" aria-label="Volume"></div>
            </div>
          </div>
        </div>
      }
      @case ("accordion") {
        <div uiAccordion>
          <div uiAccordionItem value="first">
            <h3 uiAccordionHeader>
              <button uiAccordionTrigger class="accordion-trigger">Open</button>
            </h3>
            <div *uiAccordionPanel class="accordion-panel">An answer.</div>
          </div>
          <div uiAccordionItem value="second">
            <h3 uiAccordionHeader>
              <button uiAccordionTrigger class="accordion-trigger">Second</button>
            </h3>
            <div *uiAccordionPanel class="accordion-panel">Another answer.</div>
          </div>
        </div>
      }
      @case ("collapsible") {
        <div uiCollapsible>
          <button uiCollapsibleTrigger>Open</button>
          <div *uiCollapsiblePanel class="collapsible-panel">Details.</div>
        </div>
      }
      @case ("tabs") {
        <div uiTabs class="tabs" [defaultValue]="items[0]!.value">
          <div uiTabsList class="tablist" aria-label="Pages">
            @for (item of items; track item.value) {
              <button uiTabsTab class="tab" [value]="item.value">{{ item.label }}</button>
            }
            <span uiTabsIndicator class="indicator"></span>
          </div>
          @for (item of items; track item.value) {
            <div *uiTabsPanel="item.value" class="panel">{{ item.label }} content.</div>
          }
        </div>
      }
      @case ("toolbar") {
        <div uiToolbar class="toolbar" aria-label="Formatting">
          @for (item of items; track item.value) {
            <button uiToolbarButton>{{ item.label }}</button>
          }
        </div>
      }
      @case ("tree") {
        <div uiTree class="tree" aria-label="Files" [items]="treeItems">
          <ng-template #level let-list>
            @for (item of asTree(list); track item.value) {
              <div uiTreeItem [value]="item.value">
                <span uiTreeItemLabel>{{ item.label }}</span>
                @if (item.children) {
                  <div *uiTreeGroup>
                    <ng-container
                      [ngTemplateOutlet]="level"
                      [ngTemplateOutletContext]="{ $implicit: item.children }"
                    />
                  </div>
                }
              </div>
            }
          </ng-template>
          <ng-container
            [ngTemplateOutlet]="level"
            [ngTemplateOutletContext]="{ $implicit: treeItems }"
          />
        </div>
      }
      @case ("waterfall") {
        <div uiWaterfall #waterfall="uiWaterfall" class="waterfall" aria-label="Trace" [items]="waterfallItems">
          @for (row of waterfall.rows(); track row.value) {
            <div uiWaterfallRow [value]="row.value">
              <div uiWaterfallRowHeader>{{ row.label }}</div>
              <div uiWaterfallBar></div>
            </div>
          }
        </div>
      }
      @case ("resizable") {
        <div uiResizable class="resizable">
          <div uiResizablePanel id="first" [defaultSize]="50" class="resizable-panel"></div>
          <div uiResizableHandle class="resizable-handle" aria-label="Handle"></div>
          <div uiResizablePanel id="second" [defaultSize]="50" class="resizable-panel"></div>
        </div>
      }
      @case ("scroll-area") {
        <div uiScrollArea class="scroll-area" [scrollHideDelay]="50">
          <div uiScrollAreaViewport class="scroll-area-viewport" role="region" aria-label="Items">
            <div uiScrollAreaContent>
              @for (line of lines; track line.value) {
                <p class="scroll-area-item">{{ line.label }}</p>
              }
            </div>
          </div>
          <div uiScrollAreaScrollbar class="scroll-area-scrollbar">
            <div uiScrollAreaThumb class="scroll-area-thumb"></div>
          </div>
        </div>
      }
      @default {
        <ng-container uiTooltip>
          <button uiTooltipTrigger>Open</button>
          <div *uiTooltipContent class="tooltip">A hint.</div>
        </ng-container>
      }
    }
  }
  <button (click)="mounted.set(!mounted())">Toggle</button>
</div>
`,
})
class Fixture {
  protected readonly items = perfItems(3)
  protected readonly lines = perfItems(30)
  protected readonly component = leakComponent()
  protected readonly mounted = signal(true)
  protected readonly treeItems: TreeItemData[] = leakTreeItems()
  protected readonly waterfallItems = leakWaterfallItems()

  constructor() {
    exposeLayers()
  }

  protected asTree(list: unknown) {
    return list as TreeItemData[]
  }
}

export { Fixture }
