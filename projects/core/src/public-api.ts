export {
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  type PrimitiveRoot,
  provideRoot,
} from "./lib/primitive"

export {
  injectConnectedPart,
  injectPart,
  injectTargetPart,
  type JoinedPart,
  type Unbound,
} from "./lib/part"

export {
  injectPresentPart,
  type Placement,
  type PresentPartContext,
} from "./lib/structural"

export { injectPopupPart, type PopupContainer } from "./lib/popup-layer"

export { optionalBoolean } from "./lib/inputs"

export {
  type FormValue,
  injectFormValue,
  provideValueAccessor,
  UiValueAccessor,
} from "./lib/forms"

export {
  ListHighlight,
  UiVirtualFor,
  type VirtualForContext,
  VirtualIndex,
} from "./lib/virtual-for"

export {
  ariaKeyshortcuts,
  formatShortcut,
  matchesShortcut,
  registerShortcut,
  shortcuts,
  type ShortcutHandler,
  type ShortcutInfo,
  type ShortcutKeys,
  type ShortcutOptions,
  type Shortcuts,
  type InjectShortcutOptions,
  injectShortcut,
  injectShortcutHint,
} from "./lib/shortcuts"

export {
  asyncOptions,
  type AsyncOptions,
  type AsyncOptionsContext,
  type AsyncOptionsOptions,
  type AsyncOptionsState,
  type AsyncOptionsStatus,
  createAsyncOptions,
  injectAsyncOptions,
} from "./lib/async-options"

export { injectFieldControl, type FieldContext } from "./lib/field-context"

export { MenubarToken } from "./lib/menubar-context"

export { EditorToken } from "./lib/editor-context"

// Shared with the entry points, not public API.
export { UiIds as ɵUiIds, tokenOf as ɵtokenOf } from "./lib/primitive"

export {
  type JoinedPart as ɵJoinedPart,
  createBinding as ɵcreateBinding,
} from "./lib/binding"

export {
  bindPart as ɵbindPart,
  injectStatePart as ɵinjectStatePart,
} from "./lib/part"

export {
  injectContentOwner as ɵinjectContentOwner,
  injectDefaultText as ɵinjectDefaultText,
  injectShownText as ɵinjectShownText,
} from "./lib/content"

export { leaves as ɵleaves } from "./lib/forms"

export {
  checkHiddenInput as ɵcheckHiddenInput,
  linkHiddenInput as ɵlinkHiddenInput,
} from "./lib/hidden-input"

export {
  injectFormInputs as ɵinjectFormInputs,
  injectInputInside as ɵinjectInputInside,
} from "./lib/form-inputs"

export {
  type TriggerContext as ɵTriggerContext,
  injectShortcutPart as ɵinjectShortcutPart,
  provideTrigger as ɵprovideTrigger,
  unboundTrigger as ɵunboundTrigger,
} from "./lib/trigger"

export {
  ToolbarGroupDisabled as ɵToolbarGroupDisabled,
  ToolbarToken as ɵToolbarToken,
  injectToolbarScope as ɵinjectToolbarScope,
} from "./lib/toolbar-context"

export { FieldContextToken as ɵFieldContextToken } from "./lib/field-context"
