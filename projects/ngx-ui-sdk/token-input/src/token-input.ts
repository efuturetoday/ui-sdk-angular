import { isPlatformBrowser } from "@angular/common"
import {
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  forwardRef,
  inject,
  InjectionToken,
  Injector,
  input,
  output,
  PLATFORM_ID,
  Renderer2,
  TemplateRef,
  untracked,
  ViewContainerRef,
  type EmbeddedViewRef,
  type OnInit,
} from "@angular/core"
import type { SlotName } from "@ui-sdk/core"
import {
  tokenInput,
  type Token,
  type TokenCodec,
  type TokenDeletion,
  type TokenInputController,
  type TokenInputPrimitive,
  type TokenInputSubmitDetails,
  type TokenInputValue,
  type TokenInputValueChangeDetails,
  type UndoStackOptions,
} from "@ui-sdk/core/token-input"
import {
  EditorToken,
  ɵFieldContextToken as FieldContextToken,
  injectFieldControl,
  optionalBoolean,
  ɵbindPart as bindPart,
  injectPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
} from "ngx-ui-sdk"

// The token a token's parts are inside.
const TokenScope = new InjectionToken<string>("token-input-token")

/**
 * A text field with atomic tokens. It renders no element of its own, so it
 * goes on an `ng-container` around its editor; a `uiTriggerMenu` inside
 * suggests into it. With `name`, it makes the hidden field a form submits.
 * @experimental
 */
@Directive({
  selector: "[uiTokenInput]",
  exportAs: "uiTokenInput",
  providers: [
    provideRoot(tokenInput, () => UiTokenInput),
    {
      provide: EditorToken,
      useFactory: () => {
        const root = inject(forwardRef(() => UiTokenInput))
        return () => root.handle.api.editor
      },
    },
  ],
})
class UiTokenInput implements OnInit {
  /** The tokens and text. Bind it, or `[(value)]`, to control it. */
  readonly value = input<TokenInputValue>()
  /** The tokens and text at first, when uncontrolled, and after a form reset. */
  readonly defaultValue = input<TokenInputValue>()
  /** Which keys submit: `"enter"`, with Shift+Enter for a new line, or `"mod+enter"`. */
  readonly submitShortcut = input<"enter" | "mod+enter">()
  /** How Backspace removes a token: at once, or after selecting it first. */
  readonly tokenDeletion = input<TokenDeletion>()
  /** What a copy puts on the clipboard: the codec's text, or the labels. */
  readonly copy = input<"codec" | "label">()
  /** How tokens are written as text, for pasting, copying and the form. */
  readonly codec = input<TokenCodec>()
  /** What a screen reader says for a token, like its kind. */
  readonly getTokenDescription = input<(token: Token) => string>()
  /** Undo and redo's limits. */
  readonly history = input<UndoStackOptions>()
  /** Stops it from changing. Inside a field, the field's `disabled` does too. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Shows the value without letting it change. */
  readonly readOnly = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether a form needs a value. */
  readonly required = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The name the text submits under in a native form. Inside a field, the field's name when left out. */
  readonly name = input<string>()
  /** The id of the form it belongs to, if it isn't inside it. */
  readonly form = input<string>()
  /** Inserts tokens and text from anywhere. Create one with `createTokenInputController()`. */
  readonly controller = input<TokenInputController>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Runs on the submit shortcut instead of submitting the form. */
  readonly onSubmit =
    input<(value: TokenInputValue, details: TokenInputSubmitDetails) => void>()
  /** Emits the new value once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<TokenInputValue>()
  /** Emits before the value changes. `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: TokenInputValue
    details: TokenInputValueChangeDetails
  }>()
  readonly #field = inject(FieldContextToken, { optional: true })
  readonly handle: PrimitiveHandle<TokenInputPrimitive> = injectPrimitive(
    tokenInput,
    () => ({
      value: this.value(),
      defaultValue: this.defaultValue(),
      submitShortcut: this.submitShortcut(),
      tokenDeletion: this.tokenDeletion(),
      copy: this.copy(),
      codec: this.codec(),
      getTokenDescription: this.getTokenDescription(),
      history: this.history(),
      disabled: this.disabled() || this.#field?.disabled(),
      readOnly: this.readOnly(),
      required: this.required(),
      name: this.name() ?? this.#field?.name(),
      form: this.form(),
      controller: this.controller(),
      debug: this.debug(),
      onSubmit: this.onSubmit(),
      onValueChange: (
        value: TokenInputValue,
        details: TokenInputValueChangeDetails
      ) => {
        this.beforeValueChange.emit({ value, details })
        if (!details.canceled) {
          this.valueChange.emit(value)
        }
      },
    })
  )
  /** The token input's state. */
  readonly state = this.handle.state
  readonly #formInput = this.#makeFormInput()

  // The hidden field a form submits, which it makes after itself while it
  // has a name: infrastructure, as in Vue.
  #makeFormInput() {
    const renderer = inject(Renderer2)
    const anchor = inject(ElementRef).nativeElement as Node
    const browser = isPlatformBrowser(inject(PLATFORM_ID))
    let made: HTMLElement | undefined
    inject(DestroyRef).onDestroy(() => {
      if (made?.parentNode) {
        renderer.removeChild(made.parentNode, made)
      }
    })
    return bindPart(
      () => this.handle,
      "form-input" as SlotName<TokenInputPrimitive>,
      () => ({}) as never,
      {
        show: () => {
          if (!browser || !this.state().name || !anchor.parentNode) {
            return undefined
          }
          if (!made) {
            made = renderer.createElement("textarea") as HTMLElement
            renderer.insertBefore(anchor.parentNode, made, anchor.nextSibling)
          }
          return made
        },
        hide: () => {},
        at: anchor,
      }
    )
  }

  ngOnInit() {
    this.handle.init()
    this.#formInput.init()
  }
}

/**
 * The editable text, on the element it's written on. Core owns what's
 * inside it; style it, and show a placeholder with `data-empty`. Inside a
 * field, the field's label names it.
 * @experimental
 */
@Directive({
  selector: "[uiTokenInputEditor]",
  exportAs: "uiTokenInputEditor",
})
class UiTokenInputEditor implements OnInit {
  /** What it says while empty, for `data-empty` styles and screen readers. */
  readonly placeholder = input<string>()
  // The editor is the field's control, on its own element.
  readonly #field = injectFieldControl()
  readonly #part = injectPart(
    injectHandle(tokenInput),
    "editor",
    () => ({ placeholder: this.placeholder() }),
    this.#field?.join
  )
  /** The editor's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Each token's content, as a template rendered into the token's place in the
 * editor: `<ng-template uiTokenInputTokens let-token>`. Inside it,
 * `uiTokenInputToken` and `uiTokenInputTokenRemove` are the token's parts.
 * Without it, core writes a token's label.
 * @experimental
 */
@Directive({ selector: "ng-template[uiTokenInputTokens]" })
class UiTokenInputTokens implements OnInit {
  readonly #handle = injectHandle(tokenInput)
  readonly #template = inject<TemplateRef<{ $implicit: Token }>>(TemplateRef)
  readonly #container = inject(ViewContainerRef)
  readonly #injector = inject(Injector)
  readonly #renderer = inject(Renderer2)
  readonly #views = new Map<
    string,
    { view: EmbeddedViewRef<{ $implicit: Token }>; host: HTMLElement }
  >()

  constructor() {
    // A view for each token core made a place for, moved into that place.
    effect(() => {
      this.#handle.version()
      const hosts = this.#handle.api.internal.hosts()
      untracked(() => {
        const ids = new Set(hosts.map(({ id }) => id))
        for (const [id, { view }] of this.#views) {
          if (!ids.has(id)) {
            view.destroy()
            this.#views.delete(id)
          }
        }
        for (const { id, token, host } of hosts) {
          const current = this.#views.get(id)
          if (current?.host === host) {
            current.view.context.$implicit = token
            continue
          }
          current?.view.destroy()
          const view = this.#container.createEmbeddedView(
            this.#template,
            { $implicit: token },
            {
              injector: Injector.create({
                providers: [{ provide: TokenScope, useValue: id }],
                parent: this.#injector,
              }),
            }
          )
          for (const node of view.rootNodes) {
            this.#renderer.appendChild(host, node)
          }
          view.detectChanges()
          this.#views.set(id, { view, host })
        }
      })
    })
    inject(DestroyRef).onDestroy(() =>
      this.#handle.api.internal.setCustom(false)
    )
  }

  static ngTemplateContextGuard(
    _directive: UiTokenInputTokens,
    _context: unknown
  ): _context is { $implicit: Token } {
    return true
  }

  ngOnInit() {
    this.#handle.api.internal.setCustom(true)
  }
}

// The token this part is inside, from the tokens template.
function injectToken(part: string) {
  const id = inject(TokenScope, { optional: true })
  if (!id) {
    throw new Error(`${part} must be used inside uiTokenInputTokens.`)
  }
  return id
}

/**
 * A token's content, inside the tokens template, with its state for styling.
 * @experimental
 */
@Directive({ selector: "[uiTokenInputToken]", exportAs: "uiTokenInputToken" })
class UiTokenInputToken implements OnInit {
  readonly #id = injectToken("uiTokenInputToken")
  readonly #part = injectPart(injectHandle(tokenInput), "token", () => ({
    id: this.#id,
    token: this.#id,
  }))
  /** The token's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Removes its token when pressed. Hidden from assistive technology: the
 * keyboard's way is Backspace.
 * @experimental
 */
@Directive({
  selector: "[uiTokenInputTokenRemove]",
  exportAs: "uiTokenInputTokenRemove",
})
class UiTokenInputTokenRemove implements OnInit {
  readonly #id = injectToken("uiTokenInputTokenRemove")
  readonly #part = injectPart(injectHandle(tokenInput), "token-remove", () => ({
    id: this.#id,
    token: this.#id,
  }))

  ngOnInit() {
    this.#part.init()
  }
}

export {
  createTokenInputController,
  defaultCodec,
  fromText,
  toLabel,
  toText,
} from "@ui-sdk/core/token-input"
export type {
  TextEditorAdapter,
  TextRange,
  Token,
  TokenCodec,
  TokenDeletion,
  TokenInputApi,
  TokenInputChangeOptions,
  TokenInputController,
  TokenInputEditorProps,
  TokenInputEditorState,
  TokenInputOptions,
  TokenInputPrimitive,
  TokenInputSubmitDetails,
  TokenInputTokenProps,
  TokenInputTokenState,
  TokenInputValue,
  TokenInputValueChangeDetails,
  TokenInputValueChangeReason,
  TokenInsert,
  UndoStackOptions,
} from "@ui-sdk/core/token-input"

export {
  UiTokenInput,
  UiTokenInputEditor,
  UiTokenInputToken,
  UiTokenInputTokenRemove,
  UiTokenInputTokens,
}
