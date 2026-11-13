# Design

How ui-sdk-angular renders a ui-sdk primitive in Angular, and why. The behavior lives in `@ui-sdk/core`; this package only hands Angular's elements, inputs and lifecycle to it. Upstream's own architecture is in `vendor/ui/contributing/architecture.md`, and its rendering contract holds here too.

## The contract

Every part follows upstream's contract: the same parts, names, props, state, data attributes and behavior as `@ui-sdk/react`, `@ui-sdk/vue` and the rest. Upstream's Playwright specs check it (`playwright.upstream.config.ts`), unchanged, against the fixtures in `projects/playground`.

## Parts are directives on your elements

Every part is a directive on an element you write: `<button uiDialogTrigger>`. Core writes the part's attributes and attaches its behavior to that element.

This is how Angular's own unstyled libraries work, the CDK (`cdkListbox`) and Angular Aria (`ngTabs`). A component would add a host element around the part, and Angular has no `render` to replace it. Upstream's shape still holds: the same parts, names, props and nesting, with `<Switch>` written as `uiSwitch` on an element.

The package has no components and no styles. Styled components, like a design system's, are a layer above it: components that compose the parts with `hostDirectives`, so their host element is the part. Styled layers, like one with Tailwind, may ship later as packages of their own. A structural part can't be a host directive, since it needs a template; a styled panel takes its content as a template too, never as `<ng-content>` inside an `ng-template`, which Angular creates eagerly.

- **The root** is the directive that makes the instance (`injectPrimitive`) and provides it to its parts through DI (`provideRoot`). A root without an element of its own, like Dialog's, goes on an `ng-container`.
- **A part** injects its root (`injectHandle`) and makes its element one part (`injectPart`). Outside its root it throws.
- **Selectors** are `ui` plus the part's name in camel case, as attributes: `uiDialog`, `uiDialogContent`. `exportAs` is the same name, so `#dialog="uiDialog"` reads the state.

### Present or not: structural parts

A part whose presence core decides, like a dialog's content or a collapsible's panel (`conditional(part)` in core), is a structural directive: `<div *uiDialogContent class="dialog">`. Its element is created while the part is present and removed when it isn't, after its exit animation, as React and Vue unmount it. A closed dialog's content is never instantiated.

- Its props are inputs written in Angular's microsyntax, as `*ngFor` takes `trackBy`. A part with a required value takes it first: `*uiTabsPanel="tab.value; keepMounted: true"`. A part without one starts with `let state`, since Angular's grammar allows no key first: `*uiDialogContent="let state; initialFocus: 'content'"`. Each prop is an input named after the directive, `uiDialogContentInitialFocus`, for the long form on an `<ng-template>`.
- `let state` is the part's state as a signal.
- The part is the embedded view's first element.
- A part that appears or leaves renders a microtask later, as Vue renders, so core finishes the change, like its open steps, before the part binds.
- A new view renders at once (`detectChanges()` on it), with the parts inside it, since core binds the part and moves focus into it as it appears. It's the only render the package triggers.

Every other part is an attribute directive and its element always exists.

### Parts outside their root

A trigger can sit outside its root, like one per table row, and name the root's `controller`: `<button uiDialogTrigger [controller]="edit">`. A root registers with its controller after its first render in a browser, so the server and the first client render show the same plain button; the trigger binds once the root is there (`injectConnectedPart`). Parts inside such a trigger, like its Shortcut, take the dialog it opens from it.

### Parts inside parts

A part that takes a prop from the part around it, like a radio's indicator its radio's `value`, injects that part's directive: `inject(UiRadio)`. Core's schema names these props with `from`; Angular's DI is how they arrive, so no prop is written twice.

### Controls in a field

A control takes what's around it through DI, as upstream's adapters do through context:

- **A group** hands its checkboxes its api (`group: () => api`), and is the field's control in their place.
- **A field** hands its controls its `name` and `disabled` (`injectFieldControl()`), and joins their element: the control's root directive makes its element the field's `control` part too (`injectPart(…, join)`). Both instances bind it, and their attributes merge into one write, where the field decides the id and names the control unless the author did.
- **A radio** joins only a field of its own. In the group's field, the group is the control.
- **Outside a field**, a label, description, error or control is a plain element with its `data-slot`, so a label around a whole field labels the control inside it natively, and core warns in development when it labels nothing.

### A control's hidden input

A checkbox, switch or radio takes part in a native form through a hidden native input, as in every adapter. Here it's a part you write, like every other, after its control and pointing at it, as `[matAutocomplete]` points at its panel:

```html
<button uiCheckbox #terms="uiCheckbox" name="terms"></button>
<input [uiCheckboxInput]="terms" />
```

Inside the control, DI would find it without a reference, but a `<button>` may hold no interactive content, and axe flags a focusable element inside a `role="checkbox"`. A group's input sits inside the group: `<input uiCheckboxGroupInput />`. Where Angular's forms hold the value, leave it out.

An error without content shows the browser's message for the current problem: `<div *uiFieldError></div>`. With content, it shows the content.

### Rendering as another element

There's no `render` and no `as`. A part is whatever element its directive is on. To make your own component a part, compose the directive with `hostDirectives`:

```ts
@Component({
  selector: "app-button",
  hostDirectives: [{ directive: UiDialogTrigger, inputs: ["payload"] }],
})
```

State for classes comes from `exportAs` (`[class.open]="dialog.state().open"`) or from the data attributes (`[data-open]`).

## Inputs, outputs and state

- **Options and props are signal inputs**, named like upstream's: `[defaultOpen]`, `[disabled]`. Boolean ones take `optionalBoolean`, so `<div uiCollapsible disabled>` works and a left-out or `undefined` value stays `undefined`, which core reads as its default. Angular's `booleanAttribute` turns `undefined` into `false`.
- **A controlled value** is an `input()` with its `output()`, so `[(open)]` binds both ways. Never `model()`: a component writing its own input can't tell a bound value from its own, and core reads a set `open` as controlled.
- **`on<Key>Change`** becomes `(before<Key>Change)`, which emits `{ open, details }` before the change and can cancel it with `details.cancel()`. `(<key>Change)` emits the new value once it isn't canceled.
- **Other callbacks** are outputs named without `on`: `(openChangeComplete)`.
- **State** is a signal on every directive, `state()`, which changes with what affects rendering.

## Lifecycle

Angular sets inputs after the constructor, and options like `defaultOpen` count only when an instance is made. So:

- `injectPrimitive` and `injectPart` run in field initializers, and their `init()` runs in `ngOnInit`. A root's `ngOnInit` runs before its parts'.
- A part writes its attributes in `ngOnInit`, on the server too, so the server's HTML has them. It binds its behavior after the app's first render, in the browser only (`afterNextRender`). A part made after that, like one inside a structural part, binds in `ngOnInit`, before the part around it, as React and Vue bind children first.
- The instance is kept after the first render and destroyed with its root (`DestroyRef`), so nothing outlives a server request.
- Ids come from creation order (`UiIds`), so the server and the hydrating client agree.

## Change detection

The package works zoneless, as Angular's default, and with zone.js. Core writes attributes, presence and focus as events run, outside Angular's change detection, so behavior never waits for a render. Only what your templates render does, as in any Angular app. The playground runs zoneless and renders a microtask after each user event for the specs, which read the page right after it ([projects/playground/README.md](../projects/playground/README.md)).

## Testing

- **Upstream's specs** are the contract: `npm run test:upstream`. `vendor/ui` is pinned to the `@ui-sdk/core` release in `package.json`; upgrade both together.
- **A fixture** is a plain copy of upstream's Vue fixture, `src/fixtures/<name>.ts`. As upstream's playground does, a spec file runs unless every fixture it opens is missing. A `-render` fixture uses `hostDirectives` and other elements.
- A spec that fails for a reason that isn't a bug, like a feature still missing, goes in `knownGaps` in the config with its reason, never skipped silently.

## Open questions

- **Your own primitives.** React and Vue make parts from a primitive with `createParts(primitive, { root: "button" })`. Angular compiles directives ahead of time, so a primitive of your own needs a small directive class per part (`injectPrimitive`, `injectPart`). Generic directives, like `<button [uiPrimitive]="muteButton" uiPart="root">`, could close the gap.
