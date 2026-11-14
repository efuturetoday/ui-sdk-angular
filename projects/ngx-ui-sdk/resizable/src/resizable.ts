import { Directive, inject, input, output, type OnInit } from "@angular/core"
import {
  resizable,
  type ResizableController,
  type ResizableHandleProps,
  type ResizableLayoutChangeDetails,
  type ResizableLayoutCommitDetails,
  type ResizablePanelProps,
  type ResizablePrimitive,
  type ResizableStorage,
} from "@ui-sdk/core/resizable"
import {
  optionalBoolean,
  injectPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  ɵUiIds as UiIds,
} from "ngx-ui-sdk"

/**
 * A group of panels with handles between them, on the element it's written
 * on. Horizontal panels sit side by side, vertical ones stack. Its panels'
 * sizes are percentages, in order.
 * @experimental
 */
@Directive({
  selector: "[uiResizable]",
  exportAs: "uiResizable",
  providers: [provideRoot(resizable, () => UiResizable)],
})
class UiResizable implements OnInit {
  /** Each panel's size in percent, in order. Bind it, or `[(layout)]`, to control the group. */
  readonly layout = input<number[]>()
  /** The layout at first, when uncontrolled. A panel's own `defaultSize` is what a server renders. */
  readonly defaultLayout = input<number[]>()
  /** The direction the panels are laid out in. */
  readonly orientation = input<"horizontal" | "vertical">()
  /** Stops every handle: no drags, no keys, and handles leave the tab order. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** How far an arrow key moves a handle, in percent. */
  readonly step = input<number>()
  /** How far Shift with an arrow key moves a handle, in percent. */
  readonly largeStep = input<number>()
  /** Saves the layout when an interaction completes and restores it on the next visit, under this key. */
  readonly autoSaveId = input<string>()
  /** Where `autoSaveId` saves: anything with `getItem` and `setItem`. `localStorage` by default. */
  readonly storage = input<ResizableStorage>()
  /** Resizes the group from anywhere. Create one with `createResizableController()`. */
  readonly controller = input<ResizableController>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Emits the new layout once a change isn't canceled, for `[(layout)]`. */
  readonly layoutChange = output<number[]>()
  /** Emits before the layout changes, on every frame of a drag. `details.cancel()` keeps it. */
  readonly beforeLayoutChange = output<{
    layout: number[]
    details: ResizableLayoutChangeDetails
  }>()
  /** Emits once an interaction that changed the layout ends, for saving. */
  readonly layoutCommit = output<{
    layout: number[]
    details: ResizableLayoutCommitDetails
  }>()
  readonly handle: PrimitiveHandle<ResizablePrimitive> = injectPrimitive(
    resizable,
    () => ({
      layout: this.layout(),
      defaultLayout: this.defaultLayout(),
      orientation: this.orientation(),
      disabled: this.disabled(),
      step: this.step(),
      largeStep: this.largeStep(),
      autoSaveId: this.autoSaveId(),
      storage: this.storage(),
      controller: this.controller(),
      debug: this.debug(),
      onLayoutChange: (
        layout: number[],
        details: ResizableLayoutChangeDetails
      ) => {
        this.beforeLayoutChange.emit({ layout, details })
        if (!details.canceled) {
          this.layoutChange.emit(layout)
        }
      },
      onLayoutCommit: (
        layout: number[],
        details: ResizableLayoutCommitDetails
      ) => this.layoutCommit.emit({ layout, details }),
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The group's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

/**
 * A panel. Its size is written to `--resizable-panel-size` on every frame of
 * a drag, so it renders for a resize only where it reads `state().size`.
 * @experimental
 */
@Directive({ selector: "[uiResizablePanel]", exportAs: "uiResizablePanel" })
class UiResizablePanel implements OnInit {
  /** Identifies the panel for the controller, `aria-controls` and saved layouts. Generated when left out. */
  readonly id = input<ResizablePanelProps["id"]>()
  /** Where the panel starts, in percent or with a unit, like `30` or `"240px"`. */
  readonly defaultSize = input<ResizablePanelProps["defaultSize"]>()
  /** The smallest the panel gets while open. */
  readonly minSize = input<ResizablePanelProps["minSize"]>()
  /** The largest the panel gets. */
  readonly maxSize = input<ResizablePanelProps["maxSize"]>()
  /** Lets the panel collapse below its minimum to `collapsedSize`. */
  readonly collapsible = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The size a collapsible panel collapses to. At 0, its content leaves the accessibility tree. */
  readonly collapsedSize = input<ResizablePanelProps["collapsedSize"]>()
  readonly #generated = inject(UiIds).next()
  readonly #part = injectPart(injectHandle(resizable), "panel", () => ({
    id: this.id() ?? this.#generated,
    defaultSize: this.defaultSize(),
    minSize: this.minSize(),
    maxSize: this.maxSize(),
    collapsible: this.collapsible(),
    collapsedSize: this.collapsedSize(),
  }))
  /** The panel's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The handle between two panels: a focusable separator to drag, or to move
 * with the arrow keys.
 * @experimental
 */
@Directive({ selector: "[uiResizableHandle]", exportAs: "uiResizableHandle" })
class UiResizableHandle implements OnInit {
  /** Stops this handle: no drags and no keys, and it leaves the tab order. */
  readonly disabled = input<ResizableHandleProps["disabled"], unknown>(
    undefined,
    { transform: optionalBoolean }
  )
  readonly #id = inject(UiIds).next()
  readonly #part = injectPart(injectHandle(resizable), "handle", () => ({
    id: this.#id,
    disabled: this.disabled(),
  }))
  /** The handle's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

export {
  createResizableController,
  resizableStorageKey,
} from "@ui-sdk/core/resizable"
export type {
  ResizableApi,
  ResizableChangeOptions,
  ResizableController,
  ResizableHandleProps,
  ResizableHandleState,
  ResizableLayoutChangeDetails,
  ResizableLayoutChangeReason,
  ResizableLayoutCommitDetails,
  ResizableOptions,
  ResizablePanelProps,
  ResizablePanelState,
  ResizablePrimitive,
  ResizableSize,
  ResizableState,
  ResizableStorage,
} from "@ui-sdk/core/resizable"

export { UiResizable, UiResizableHandle, UiResizablePanel }
