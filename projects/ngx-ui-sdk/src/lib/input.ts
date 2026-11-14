import {
  computed,
  Directive,
  effect,
  inject,
  input,
  type OnInit,
  Renderer2,
} from "@angular/core"
import {
  input as inputPrimitive,
  inputGroup,
  textarea as textareaPrimitive,
  type InputGroupPrimitive,
  type InputGroupState,
  type InputPrimitive,
  type TextareaOptions,
  type TextareaPrimitive,
} from "@ui-sdk/core/input"
import { optionalBoolean } from "./inputs"
import { injectPart } from "./part"
import {
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
} from "./primitive"
import { injectPresentPart, type PresentPartContext } from "./structural"
import { UiTextControl } from "./text-control"

/**
 * A native `<input>`, wired to the field it's in. Angular's own value
 * accessor serves `ngModel` and `formControl` on it.
 * @experimental
 */
@Directive({
  selector: "input[uiInput]",
  exportAs: "uiInput",
  host: { "[attr.value]": "defaultAttr()" },
})
class UiInput extends UiTextControl implements OnInit {
  readonly handle: PrimitiveHandle<InputPrimitive> = injectPrimitive(
    inputPrimitive,
    () => this.textOptions()
  )
  // A default is the `value` attribute, which a form reset returns to.
  protected readonly defaultAttr = computed(() =>
    this.value() === undefined ? this.defaultValue() : undefined
  )
  readonly #part = injectPart(
    this.handle,
    "root",
    () => this.controlProps(),
    this.field?.join
  )
  /** The input's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

/**
 * A native `<textarea>`, wired to the field it's in, that can grow with its
 * text. Angular's own value accessor serves `ngModel` and `formControl` on it.
 * @experimental
 */
@Directive({ selector: "textarea[uiTextarea]", exportAs: "uiTextarea" })
class UiTextarea extends UiTextControl implements OnInit {
  /** Grows and shrinks with the text, between its CSS `min-height` and `max-height`. */
  readonly autoResize = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Which keys submit: `"enter"`, with Shift+Enter for a new line, or `"mod+enter"`. */
  readonly submitShortcut = input<"enter" | "mod+enter">()
  /** Runs on the submit shortcut instead of submitting the form. */
  readonly onSubmit = input<TextareaOptions["onSubmit"]>()
  readonly handle: PrimitiveHandle<TextareaPrimitive> = injectPrimitive(
    textareaPrimitive,
    () => ({
      ...this.textOptions(),
      autoResize: this.autoResize(),
      submitShortcut: this.submitShortcut(),
      onSubmit: this.onSubmit(),
    })
  )
  readonly #part = injectPart(
    this.handle,
    "root",
    () => this.controlProps(),
    this.field?.join
  )
  /** The textarea's state. */
  readonly state = this.#part.state

  constructor() {
    super()
    // A default is the textarea's text, which a form reset returns to.
    const renderer = inject(Renderer2)
    effect(() => {
      const text = this.defaultValue()
      if (this.value() === undefined && text !== undefined) {
        renderer.setProperty(this.el, "defaultValue", text)
      }
    })
  }

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

/**
 * Holds an input with icons, text and buttons around it. A press on its text
 * and icons focuses the input.
 * @experimental
 */
@Directive({
  selector: "[uiInputGroup]",
  exportAs: "uiInputGroup",
  providers: [provideRoot(inputGroup, () => UiInputGroup)],
})
class UiInputGroup implements OnInit {
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly handle: PrimitiveHandle<InputGroupPrimitive> = injectPrimitive(
    inputGroup,
    () => ({ debug: this.debug() })
  )
  readonly #part = injectPart(this.handle, "group")
  /** The group's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

/**
 * Empties the input in its group and focuses it, on the element it's written
 * on: `<button *uiInputClear>`. It's there while the input has text to clear.
 * @experimental
 */
@Directive({ selector: "[uiInputClear]" })
class UiInputClear implements OnInit {
  readonly #part = injectPresentPart(injectHandle(inputGroup), "clear")

  static ngTemplateContextGuard(
    _directive: UiInputClear,
    _context: unknown
  ): _context is PresentPartContext<InputGroupState> {
    return true
  }

  ngOnInit() {
    this.#part.init()
  }
}

export { createInputController } from "@ui-sdk/core/input"
export type {
  InputController,
  InputGroupOptions,
  InputGroupPrimitive,
  InputGroupState,
  InputOptions,
  InputPrimitive,
  InputProps,
  InputState,
  InputValueChangeReason,
  TextareaOptions,
  TextareaPrimitive,
  TextareaProps,
  TextareaState,
  TextareaSubmitDetails,
} from "@ui-sdk/core/input"

export { UiInput, UiInputClear, UiInputGroup, UiTextarea }
