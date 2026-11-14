import { computed, Directive, inject, input, output } from "@angular/core"
import type { CommitDetails, SlotName } from "@ui-sdk/core"
import {
  fileInput,
  type FileInputController,
  type FileInputDropzoneTarget,
  type FileInputOptions,
  type FileInputPasteTarget,
  type FileInputPrimitive,
  type FileInputState,
  type FileInputValueChangeDetails,
  type FileInputValueChangeReason,
  type FileRejection,
} from "@ui-sdk/core/file-input"
import { fileKey } from "@ui-sdk/core/renderer"
import {
  injectFieldControl,
  ɵinjectInputInside as injectInputInside,
  optionalBoolean,
  ɵbindPart as bindPart,
  injectConnectedPart,
  injectPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  ɵUiIds as UiIds,
} from "@ngx-ui-sdk/core"

/**
 * The files a user chose, dropped or pasted, as its value. Put its trigger,
 * dropzone and list inside. A hidden native input after its content takes part
 * in a form.
 * @experimental
 */
@Directive({
  selector: "[uiFileInput]",
  exportAs: "uiFileInput",
  providers: [provideRoot(fileInput, () => UiFileInput)],
})
class UiFileInput {
  /** The files. Bind it, or `[(value)]`, to control it. */
  readonly value = input<File[]>()
  /** The files at first, when uncontrolled. */
  readonly defaultValue = input<File[]>()
  /** Which files it takes: a comma-separated list of types and extensions, or an array. */
  readonly accept = input<FileInputOptions["accept"]>()
  /** Whether it takes several files. */
  readonly multiple = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether it takes folders. */
  readonly directory = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Opens the camera on phones: `true`, `"user"` or `"environment"`. */
  readonly capture = input<FileInputOptions["capture"]>()
  /** The most files it holds. */
  readonly maxFiles = input<number>()
  /** The biggest file, in bytes. */
  readonly maxSize = input<number>()
  /** The smallest file, in bytes. */
  readonly minSize = input<number>()
  /** Rejects files with reasons of your own. */
  readonly validate = input<FileInputOptions["validate"]>()
  /** The name the files submit under. Inside a field, the field's name when left out. */
  readonly name = input<string>()
  /** The id of the form it belongs to, when it isn't inside it. */
  readonly form = input<string>()
  /** Requires a file for the form to submit. */
  readonly required = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Disables it. Inside a field, the field's `disabled` does too. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** What screen readers hear after a change. */
  readonly announcement = input<FileInputOptions["announcement"]>()
  /** Adds, removes and reads files, and opens the picker, from anywhere. Create one with `createFileInputController()`. */
  readonly controller = input<FileInputController>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Emits the new files once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<File[]>()
  /** Emits before the files change. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: File[]
    details: FileInputValueChangeDetails
  }>()
  /** Emits the files it turned away, with the reasons. */
  readonly reject = output<{
    rejected: FileRejection[]
    details: CommitDetails<FileInputValueChangeReason>
  }>()
  readonly #field = injectFieldControl()
  readonly handle: PrimitiveHandle<FileInputPrimitive> = injectPrimitive(
    fileInput,
    () => ({
      value: this.value(),
      defaultValue: this.defaultValue(),
      accept: this.accept(),
      multiple: this.multiple(),
      directory: this.directory(),
      capture: this.capture(),
      maxFiles: this.maxFiles(),
      maxSize: this.maxSize(),
      minSize: this.minSize(),
      validate: this.validate(),
      name: this.name() ?? this.#field?.name(),
      form: this.form(),
      required: this.required(),
      disabled: this.disabled() || this.#field?.disabled(),
      announcement: this.announcement(),
      controller: this.controller(),
      debug: this.debug(),
      onValueChange: (value: File[], details: FileInputValueChangeDetails) => {
        this.beforeValueChange.emit({ value, details })
        if (!details.canceled) {
          this.valueChange.emit(value)
        }
      },
      onReject: (
        rejected: FileRejection[],
        details: CommitDetails<FileInputValueChangeReason>
      ) => this.reject.emit({ rejected, details }),
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The file input's state. */
  readonly state = this.#part.state
  readonly #hidden = bindPart(
    () => this.handle,
    "input" as SlotName<FileInputPrimitive>,
    () => ({}) as never,
    injectInputInside()
  )
}

const unconnected: FileInputState = {
  value: [],
  disabled: false,
  required: false,
  dragging: false,
}

/**
 * The button that opens the file picker. A trigger outside the file input
 * connects through `controller`.
 * @experimental
 */
@Directive({
  selector: "[uiFileInputTrigger]",
  exportAs: "uiFileInputTrigger",
})
class UiFileInputTrigger {
  /** Connects a trigger outside the file input to the one with this controller. */
  readonly controller = input<FileInputController>()
  readonly #field = injectFieldControl()
  readonly #part = injectConnectedPart(
    fileInput,
    this.controller,
    "trigger",
    () => ({}),
    { attrs: () => ({ type: "button" }), state: () => unconnected },
    { join: this.#field?.join }
  )
  /** The trigger's state. */
  readonly state = this.#part.state
}

/**
 * Takes files dropped on it, or pasted while focus is inside it.
 * @experimental
 */
@Directive({
  selector: "[uiFileInputDropzone]",
  exportAs: "uiFileInputDropzone",
})
class UiFileInputDropzone {
  /** Where it takes drops. `"document"` takes files dropped anywhere on the page. */
  readonly target = input<FileInputDropzoneTarget>()
  /** Somewhere else to take pasted files from: `"document"`, an element, a CSS selector, or a function that returns an element. */
  readonly pasteTarget = input<FileInputPasteTarget>()
  readonly #id = inject(UiIds).next()
  readonly #part = injectPart(injectHandle(fileInput), "dropzone", () => ({
    id: this.#id,
    target: this.target(),
    pasteTarget: this.pasteTarget(),
  }))
  /** The zone's state, with whether files are `dragging` over it. */
  readonly state = this.#part.state
}

/**
 * The list of files. Render an item for each file in its state's `value`.
 * @experimental
 */
@Directive({ selector: "[uiFileInputList]", exportAs: "uiFileInputList" })
class UiFileInputList {
  readonly #part = injectPart(injectHandle(fileInput), "list")
  /** The list's state, with the `value` to render. */
  readonly state = this.#part.state
}

/**
 * One file in the list.
 * @experimental
 */
@Directive({ selector: "[uiFileInputItem]", exportAs: "uiFileInputItem" })
class UiFileInputItem {
  /** The file this item shows. */
  readonly file = input.required<File>()
  readonly #part = injectPart(injectHandle(fileInput), "item", () => ({
    file: this.file(),
    value: fileKey(this.file()),
  }))
  /** The item's state, with its `file`. */
  readonly state = this.#part.state
}

/**
 * The button that removes its item's file, inside the item or given a `file`.
 * @experimental
 */
@Directive({
  selector: "[uiFileInputItemRemove]",
  exportAs: "uiFileInputItemRemove",
})
class UiFileInputItemRemove {
  /** The file to remove, when the button isn't inside its item. */
  readonly file = input<File>()
  readonly #item = inject(UiFileInputItem, { optional: true })
  readonly #current = computed(() => {
    const file = this.file() ?? this.#item?.file()
    if (!file) {
      throw new Error(
        "uiFileInputItemRemove must be used inside a uiFileInputItem, or be given a file."
      )
    }
    return file
  })
  readonly #part = injectPart(injectHandle(fileInput), "item-remove", () => ({
    file: this.#current(),
    value: fileKey(this.#current()),
  }))
  /** The button's state. */
  readonly state = this.#part.state
}

export {
  createFileInputController,
  formatFileSize,
  relativePath,
} from "@ui-sdk/core/file-input"
export type {
  FileInputApi,
  FileInputChange,
  FileInputChangeOptions,
  FileInputController,
  FileInputDropzoneProps,
  FileInputDropzoneState,
  FileInputDropzoneTarget,
  FileInputItemProps,
  FileInputItemRemoveState,
  FileInputItemState,
  FileInputOptions,
  FileInputPasteTarget,
  FileInputPrimitive,
  FileInputState,
  FileInputTriggerProps,
  FileInputValueChangeDetails,
  FileInputValueChangeReason,
  FileLike,
  FileRejection,
  FileRejectionReason,
  FileRules,
} from "@ui-sdk/core/file-input"

export {
  UiFileInput,
  UiFileInputDropzone,
  UiFileInputItem,
  UiFileInputItemRemove,
  UiFileInputList,
  UiFileInputTrigger,
}
