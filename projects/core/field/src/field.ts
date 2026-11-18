import {
  afterNextRender,
  computed,
  Directive,
  effect,
  ElementRef,
  forwardRef,
  inject,
  InjectionToken,
  input,
  PLATFORM_ID,
  signal,
  TemplateRef,
  untracked,
  ViewContainerRef,
  type Signal,
  type OnInit,
} from "@angular/core"
import { isPlatformBrowser } from "@angular/common"
import {
  field,
  fieldGroup,
  fieldSet,
  type FieldErrorProps,
  type FieldErrorState,
  type FieldGroupPrimitive,
  type FieldPrimitive,
  type FieldSetPrimitive,
} from "@ui-sdk/core/field"
import {
  applyAttrs,
  checkFieldOutside,
  fieldOutsideAttrs,
  fieldOutsideErrorShown,
  fieldOutsideState,
  type FieldOutsideSlot,
} from "@ui-sdk/core/renderer"
import {
  type FieldContext,
  ɵFieldContextToken as FieldContextToken,
  optionalBoolean,
  injectPart,
  type JoinedPart,
  injectPresentPart,
  type PresentPartContext,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  ɵUiIds as UiIds,
  showText,
  TextSource,
} from "@ngx-ui-sdk/core"

// What a description describes: the nearest field, or a field set when no
// field is closer.
const DescribedToken = new InjectionToken<{
  handle: PrimitiveHandle<FieldPrimitive>
}>("field-described")

// A part outside any field: a plain element with the slot's attributes, so a
// label is a native <label> that labels the control it wraps.
function injectOutside(slot: FieldOutsideSlot) {
  const el = inject(ElementRef).nativeElement as HTMLElement
  if (isPlatformBrowser(inject(PLATFORM_ID))) {
    afterNextRender(() => checkFieldOutside(el, slot))
  }
  // Like a part, it starts in `ngOnInit`, or on its own in its first effect run.
  let started = false
  const init = () => {
    if (!started) {
      started = true
      applyAttrs(el, fieldOutsideAttrs(slot), "field-outside")
    }
  }
  effect(() => untracked(init))
  return { init }
}

/**
 * Ties a form control to its label, description and error messages. Controls
 * inside take its `name` and `disabled`.
 * @experimental
 */
@Directive({
  selector: "[uiField]",
  exportAs: "uiField",
  providers: [
    provideRoot(field, () => UiField),
    { provide: FieldContextToken, useExisting: forwardRef(() => UiField) },
    { provide: DescribedToken, useExisting: forwardRef(() => UiField) },
  ],
})
class UiField implements OnInit, FieldContext {
  /** The name the control submits under, when the control doesn't set its own. */
  readonly name = input<string>()
  /** Disables the control, and marks every part. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /**
   * Whether the field shows as invalid, when your code decides. `true` shows
   * its errors now, `false` shows none. Leave it out for the browser's own validation.
   */
  readonly invalid = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly handle: PrimitiveHandle<FieldPrimitive> = injectPrimitive(
    field,
    () => ({
      name: this.name(),
      disabled: this.disabled(),
      invalid: this.invalid(),
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The field's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

/**
 * The field's label, which names its control. Outside a field it's a plain
 * `<label>`, which labels the control inside it, like a card around a whole field.
 * @experimental
 */
@Directive({ selector: "[uiFieldLabel]", exportAs: "uiFieldLabel" })
class UiFieldLabel implements OnInit {
  readonly #field = inject(FieldContextToken, { optional: true })
  readonly #part = this.#field
    ? injectPart(this.#field.handle, "label")
    : injectOutside("label")

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Describes its field. Right inside a field set, outside any field, it
 * describes the set, so screen readers say it as focus enters the group.
 * @experimental
 */
@Directive({ selector: "[uiFieldDescription]", exportAs: "uiFieldDescription" })
class UiFieldDescription implements OnInit {
  readonly #described = inject(DescribedToken, { optional: true })
  // Each description is keyed by an id of its own, so a control with two is
  // described by both. A field set's description takes the same props.
  readonly #id = inject(UiIds).next()
  readonly #inside = this.#described
    ? injectPart(this.#described.handle, "description", () => ({
        value: this.#id,
      }))
    : undefined
  readonly #part = this.#inside ?? injectOutside("description")
  /**
   * The field's state, like `valid`, for text that follows it:
   * `#hint="uiFieldDescription"`, then `hint.state()?.valid`. Outside any
   * field, it has none.
   */
  readonly state = this.#inside?.state ?? computed(() => undefined)

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Shows while the field shows as invalid, on the element it's written on:
 * `<div *uiFieldError>`. `match` says which problem it shows for:
 * `*uiFieldError="{ match: 'valueMissing' }"`. With `uiText`, it shows the
 * browser's message for the current problem.
 * @experimental
 */
@Directive({
  selector: "[uiFieldError]",
  providers: [{ provide: TextSource, useExisting: UiFieldError }],
})
class UiFieldError implements TextSource {
  /**
   * Which problem it shows for, like `*uiFieldError="let state; match: 'valueMissing'"`.
   * `true` shows it always and `false` never. Without it, any problem shows it.
   */
  readonly match = input<FieldErrorProps["match"]>(undefined, {
    alias: "uiFieldErrorMatch",
  })
  readonly #props = computed<FieldErrorProps>(() => ({ match: this.match() }))
  readonly #field = inject(FieldContextToken, { optional: true })
  // Each error is its own part, keyed by a made value. Core gives the first
  // one that shows the id the control points at before the field binds.
  readonly #id = inject(UiIds).next()
  readonly #part = this.#field
    ? injectPresentPart(
        this.#field.handle,
        "error",
        computed(() => ({ ...this.#props(), value: this.#id }))
      )
    : injectOutsideError(this.#props)

  /** Shows the browser's message where `uiText` is. */
  readonly attach = showText(() => this.#part.state().message)

  static ngTemplateContextGuard(
    _directive: UiFieldError,
    _context: unknown
  ): _context is PresentPartContext<FieldErrorState> {
    return true
  }
}

// An error outside any field has no validation behind it, so only a `match`
// of `true` shows it.
function injectOutsideError(props: () => FieldErrorProps) {
  const template = inject(TemplateRef)
  const viewContainer = inject(ViewContainerRef)
  const element = signal<HTMLElement | undefined>(undefined)
  const state = signal(fieldOutsideState).asReadonly()
  effect(() => {
    const shown = fieldOutsideErrorShown(props())
    untracked(() => {
      if (shown === !!element()) {
        return
      }
      viewContainer.clear()
      if (!shown) {
        return element.set(undefined)
      }
      const view = viewContainer.createEmbeddedView(template, {
        $implicit: state,
      })
      view.detectChanges()
      const el = view.rootNodes.find((node: Node) => node.nodeType === 1)
      if (el) {
        applyAttrs(el, fieldOutsideAttrs("error"), "field-outside")
      }
      element.set(el)
    })
  })
  return { element, state }
}

/**
 * A native control, like an `<input>`, as its field's control.
 * @experimental
 */
@Directive({ selector: "[uiFieldControl]", exportAs: "uiFieldControl" })
class UiFieldControl implements OnInit {
  readonly #el = inject(ElementRef).nativeElement as HTMLElement
  readonly #field = inject(FieldContextToken, { optional: true })
  readonly #part = this.#field
    ? injectPart(this.#field.handle, "control", () => ({
        id: this.#own.id,
        describedBy: this.#own.describedBy,
      }))
    : injectOutside("control")
  readonly #own = {
    id: this.#el.getAttribute("id") ?? undefined,
    describedBy: this.#el.getAttribute("aria-describedby") ?? undefined,
  }

  constructor() {
    const field = this.#field
    if (!field) {
      return
    }
    // The field's name, unless the control has its own.
    const named = this.#el.hasAttribute("name")
    effect(() => {
      const name = field.name()
      if (!named) {
        applyAttrs(this.#el, { name }, "field-name")
      }
    })
  }

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A native `<fieldset>`, so `disabled` disables every control inside it.
 * @experimental
 */
@Directive({
  selector: "[uiFieldSet]",
  exportAs: "uiFieldSet",
  providers: [
    provideRoot(fieldSet, () => UiFieldSet),
    { provide: DescribedToken, useExisting: forwardRef(() => UiFieldSet) },
  ],
})
class UiFieldSet implements OnInit {
  /** Disables every control inside it. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly handle: PrimitiveHandle<FieldSetPrimitive> = injectPrimitive(
    fieldSet,
    () => ({ disabled: this.disabled() })
  )
  readonly #part = injectPart(this.handle, "set")
  /** The field set's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

/**
 * Names the field set. Keep it the set's first child, where a `<legend>` names it natively.
 * @experimental
 */
@Directive({ selector: "[uiFieldLegend]", exportAs: "uiFieldLegend" })
class UiFieldLegend implements OnInit {
  readonly #part = injectPart(injectHandle(fieldSet), "legend")

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Lays fields out. It has no role: a field set is what names and disables a group.
 * @experimental
 */
@Directive({ selector: "[uiFieldGroup]", exportAs: "uiFieldGroup" })
class UiFieldGroup implements OnInit {
  readonly handle: PrimitiveHandle<FieldGroupPrimitive> = injectPrimitive(
    fieldGroup,
    () => ({})
  )
  readonly #part = injectPart(this.handle, "group")

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

export type {
  FieldApi,
  FieldDescriptionState,
  FieldErrorProps,
  FieldErrorState,
  FieldGroupPrimitive,
  FieldOptions,
  FieldPrimitive,
  FieldSetOptions,
  FieldSetPrimitive,
  FieldSetState,
  FieldState,
  ValidityKey,
} from "@ui-sdk/core/field"

export {
  UiField,
  UiFieldControl,
  UiFieldDescription,
  UiFieldError,
  UiFieldGroup,
  UiFieldLabel,
  UiFieldLegend,
  UiFieldSet,
}
