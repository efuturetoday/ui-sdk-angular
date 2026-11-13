# Examples

`projects/demo` shows upstream's examples, the ones on ui-sdk.dev, in Angular, with upstream's own CSS. Each is a copy of a Vue example: `vendor/ui/examples/components/<component>/vue/<name>.vue` becomes `projects/demo/src/examples/<component>/<name>.ts`.

`node scripts/check-examples.mjs` (part of `npm run lint`) fails while an example or a spec fixture whose components we have is missing, so a component is done only with all of its examples. `--report` lists what waits on a component we don't have yet. `--write` regenerates the demo's list of examples and its stylesheet; never edit `examples/index.ts` or `examples.css` by hand.

## A file

```ts
import { Component } from "@angular/core"
import { UiSeparator } from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [UiSeparator],
  template: `
    <div data-slot="stack">
      <div uiSeparator></div>
    </div>
  `,
})
class Example {}

export { Example }
```

- One standalone component named `Example`, exported by name, with the selector `app-example`.
- Upstream's rules for examples hold (`vendor/ui/contributing/examples.md`): no comments, the same text, labels, order and `data-slot`, `data-variant` and `data-size` attributes as the Vue file. Upstream's CSS styles through them, never through classes.
- Logic stays the same: Vue's `ref()` is a `signal()`, a `computed()` a `computed()`, `useLog()` is `injectLog()` from `../../shared/log`.

## Components to directives

A Vue component renders a default element; in Angular, write that element with the directive on it. The defaults are in `vendor/ui/packages/vue/src` (`withElement("button", …)`, `createParts(…, { indicator: "span" })`):

| Vue                                                           | Angular                                                                             |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `<Separator />`                                               | `<div uiSeparator></div>`                                                           |
| `<Collapsible>`, `<CollapsibleTrigger>`, `<CollapsiblePanel>` | `<div uiCollapsible>`, `<button uiCollapsibleTrigger>`, `<div *uiCollapsiblePanel>` |
| `<Dialog>`                                                    | `<ng-container uiDialog>`                                                           |
| `<DialogTrigger>`, `<DialogClose>`                            | `<button uiDialogTrigger>`, `<button uiDialogClose>`                                |
| `<DialogBackdrop />`, `<DialogContent>`                       | `<div *uiDialogBackdrop></div>`, `<div *uiDialogContent>`                           |
| `<DialogTitle>`, `<DialogDescription>`                        | `<h2 uiDialogTitle>`, `<p uiDialogDescription>`                                     |
| Alert dialog                                                  | the same with `uiAlertDialog…`                                                      |
| `<Checkbox>`, `<CheckboxIndicator>`                           | `<button uiCheckbox>`, `<span *uiCheckboxIndicator>`                                |
| `<CheckboxGroup>`                                             | `<div uiCheckboxGroup>`                                                             |
| `<Switch>`, `<SwitchThumb />`                                 | `<button uiSwitch>`, `<span uiSwitchThumb></span>`                                  |
| `<RadioGroup>`, `<Radio>`, `<RadioIndicator />`               | `<div uiRadioGroup>`, `<button uiRadio>`, `<span *uiRadioIndicator></span>`         |
| `<Field>`, `<FieldLabel>`, `<FieldDescription>`               | `<div uiField>`, `<label uiFieldLabel>`, `<p uiFieldDescription>`                   |
| `<FieldError>`, `<FieldControl />`                            | `<div *uiFieldError>`, `<input uiFieldControl />`                                   |
| `<FieldSet>`, `<FieldLegend>`, `<FieldGroup>`                 | `<fieldset uiFieldSet>`, `<legend uiFieldLegend>`, `<div uiFieldGroup>`             |

- **Props** are inputs with the same name in camel case: `default-checked` is `defaultChecked`, a static `disabled` stays `disabled`.
- **A structural part's props** take microsyntax: `<CollapsiblePanel keep-mounted>` is `*uiCollapsiblePanel="let state; keepMounted: true"`, `<FieldError match="valueMissing">` is `*uiFieldError="let state; match: 'valueMissing'"`.
- **Events.** `v-model:checked` is `[(checked)]`. `@checked-change` that reads `details` (to cancel, or for its `reason`) is `(beforeCheckedChange)`, which emits `{ checked, details }`; the same for `open`, `value` and the rest. `@open-change-complete` is `(openChangeComplete)`.
- **A slot's state.** `v-slot="{ state }"` on a structural part is its `let state`, a signal: `state().payload`. On any other part, read it through `exportAs`: `#box="uiCheckbox"` and `box.state().checked`.
- **The `render` slot** gives a part another element: put the directive on that element. A component of the example's own composes the part with `hostDirectives`.
- **Hidden inputs.** Vue renders a checkbox's, switch's or radio's hidden input for you, always; here you write it, always, right after the control: `<button uiCheckbox #terms="uiCheckbox" name="terms">…</button><input [uiCheckboxInput]="terms" />`. Only where Angular's forms hold the value is it left out. A required group adds `<input uiCheckboxGroupInput />` inside it.
- **`data-slot` you write.** Core sets every part's `data-slot` itself, like `radio`, for styling headless parts. The ones examples write by hand, like `stack`, `row`, `hint` or `card`, are only layout hooks of upstream's example styles. Keep them as upstream writes them; `check-examples.mjs` fails on a name the styles don't know.
- **Icons.** `@lucide/vue`'s `CheckIcon` is `@lucide/angular`'s `LucideCheck`: `<svg lucideCheck aria-hidden="true"></svg>`.

## Checking one

1. `node scripts/check-examples.mjs --write`.
2. Build: `npx ng build demo`.
3. Open `/?component=<component>` on the demo (`npm start`) and use the example as on ui-sdk.dev: keyboard, pointer, its log.

An example that needs something the adapter doesn't have stays out until it does. Never work around the adapter in an example.
