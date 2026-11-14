import { Component } from "@angular/core"
import { CodeBlock } from "./code"

@Component({
  selector: "app-guide",
  imports: [CodeBlock],
  styleUrl: "./guide.css",
  template: `
    <p>
      The directives add no styles. They set attributes on the elements you
      wrote, and you style those with your own CSS or with Tailwind CSS.
    </p>

    <section id="state" data-title="Style the State">
      <h3>Style the State</h3>
      <p>
        Parts show their state as data attributes, like
        <code>data-open</code>, <code>data-pressed</code>,
        <code>data-highlighted</code>, <code>data-selected</code> and
        <code>data-disabled</code>. Each component's page lists its own.
      </p>
      <app-code lang="css" [code]="stateCss" />
      <p>With Tailwind CSS, use its data variants:</p>
      <app-code lang="html" [code]="tailwind" />
    </section>

    <section id="slots" data-title="Style Every Instance">
      <h3>Style Every Instance</h3>
      <p>
        Every part has a <code>data-slot</code>, like
        <code>data-slot="dialog-content"</code>. Use it to style a component
        everywhere it's used, from one stylesheet.
      </p>
      <app-code lang="css" [code]="slotCss" />
    </section>

    <section id="variables" data-title="CSS Variables">
      <h3>CSS Variables</h3>
      <p>
        What only the browser knows comes as CSS variables. A popup has
        <code>--anchor-width</code>, <code>--available-height</code> and
        <code>--transform-origin</code>; a tabs indicator has the selected tab's
        position and size.
      </p>
      <app-code lang="css" [code]="variablesCss" />
    </section>

    <section id="animation" data-title="Animate In and Out">
      <h3>Animate In and Out</h3>
      <p>
        A part that comes and goes has <code>data-starting-style</code> as it
        enters and <code>data-ending-style</code> as it leaves. Style the hidden
        state with both, and use a transition. Angular removes the element once
        the transition ends.
      </p>
      <app-code lang="css" [code]="animationCss" />
      <p>
        Without a transition, the element goes at once. People who prefer
        reduced motion should get a shorter one or none.
      </p>
    </section>

    <section id="theme" data-title="Default Theme">
      <h3>Default Theme</h3>
      <p>
        The examples on this site use ui-sdk's example styles. They're available
        as a separate package:
      </p>
      <app-code lang="bash" code="npm install @ngx-ui-sdk/theme-default" />
      <p>Add it to <code>angular.json</code>:</p>
      <app-code lang="json" [code]="angularJson" />
      <p>
        The theme only styles elements inside <code>data-ui-theme</code>. To
        style the whole app, add it to <code>&lt;body&gt;</code>:
      </p>
      <app-code lang="html" code="<body data-ui-theme>" />
      <p>
        To load less CSS, import <code>tokens.css</code>,
        <code>base.css</code> and only the components you use instead of
        <code>all.css</code>. Colors, radii and sizes are CSS variables you can
        override.
      </p>
    </section>
  `,
})
class Page {
  protected readonly stateCss = `[data-slot="toggle"][data-pressed] {
  background: #171717;
  color: #fff;
}

[data-slot="menu-item"][data-highlighted] {
  background: #f4f4f3;
}`
  protected readonly tailwind = `<button uiToggle class="rounded-md border px-3 data-pressed:bg-neutral-900 data-pressed:text-white">
  Bold
</button>`
  protected readonly slotCss = `[data-slot="dialog-content"] {
  width: min(28rem, 100% - 2rem);
  padding: 1.5rem;
  border-radius: 12px;
  background: white;
}`
  protected readonly variablesCss = `[data-slot="select-content"] {
  min-width: var(--anchor-width);
  max-height: var(--available-height);
  transform-origin: var(--transform-origin);
}`
  protected readonly animationCss = `[data-slot="popover-content"] {
  transition:
    opacity 150ms,
    scale 150ms;
}

[data-slot="popover-content"]:is([data-starting-style], [data-ending-style]) {
  opacity: 0;
  scale: 0.96;
}`
  protected readonly angularJson = `"styles": ["@ngx-ui-sdk/theme-default/all.css", "src/styles.css"]`
}

export { Page }
