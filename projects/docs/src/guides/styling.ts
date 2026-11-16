import { Component } from "@angular/core"
import { CodeBlock } from "./code"

@Component({
  selector: "app-guide",
  imports: [CodeBlock],
  styleUrl: "./guide.css",
  template: `
    <p>
      The directives add no styles. They set attributes on your elements. You
      style these attributes with your own CSS or with Tailwind CSS.
    </p>

    <section id="state" data-title="Style the State">
      <h3>Style the State</h3>
      <p>
        Parts show their state as data attributes. Examples are
        <code>data-open</code>
        ,
        <code>data-pressed</code>
        ,
        <code>data-highlighted</code>
        ,
        <code>data-selected</code>
        and
        <code>data-disabled</code>
        . Each component's page lists its own.
      </p>
      <app-code lang="css" [code]="stateCss" />
      <p>In Tailwind CSS, use the data variants.</p>
      <app-code lang="html" [code]="tailwind" />
    </section>

    <section id="slots" data-title="Style Every Instance">
      <h3>Style Every Instance</h3>
      <p>
        Every part has a
        <code>data-slot</code>
        , for example
        <code>data-slot="dialog-content"</code>
        . With it, one stylesheet styles a component everywhere.
      </p>
      <app-code lang="css" [code]="slotCss" />
    </section>

    <section id="variables" data-title="CSS Variables">
      <h3>CSS Variables</h3>
      <p>
        Some values only the browser knows. They come as CSS variables. A popup
        has
        <code>--anchor-width</code>
        ,
        <code>--available-height</code>
        and
        <code>--transform-origin</code>
        . A tabs indicator has the position and size of the selected tab.
      </p>
      <app-code lang="css" [code]="variablesCss" />
    </section>

    <section id="animation" data-title="Animate In and Out">
      <h3>Animate In and Out</h3>
      <p>
        A part that opens and closes gets
        <code>data-starting-style</code>
        while it enters and
        <code>data-ending-style</code>
        while it leaves. Style the hidden state with both and add a transition.
        Angular removes the element when the transition ends.
      </p>
      <app-code lang="css" [code]="animationCss" />
      <p>
        Without a transition, the element disappears at once. Keep the animation
        short or turn it off for people who prefer reduced motion.
      </p>
    </section>

    <p>
      To start from finished styles instead,
      <a href="?doc=themes">Themes</a>
      shows how to install a theme and change it.
    </p>
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
}

export { Page }
