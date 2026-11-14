import { Component, resource } from "@angular/core"
import { CodeBlock } from "./code"
import { DesignTabsExample } from "./live/design-tabs-example"

const text = (load: () => Promise<unknown>) => () =>
  load().then((module) => (module as { default: string }).default)

@Component({
  selector: "app-guide",
  imports: [CodeBlock, DesignTabsExample],
  styleUrl: "./guide.css",
  template: `
    <p>
      You can wrap parts in your own components, like a design system does. Use
      Angular's
      <code>hostDirectives</code>
      for that. Your component then is the part. It gets the behavior, the ARIA
      and the attributes. You add the styles.
    </p>
    <div class="preview"><app-design-tabs-example /></div>

    <section id="wrap" data-title="Wrap a Part">
      <h3>Wrap a Part</h3>
      <p>
        Add the part's directive to
        <code>hostDirectives</code>
        . List the inputs and outputs your component should offer.
      </p>
      <app-code file="design-tabs.ts" [code]="tabs.value() ?? ''" />
      <p>
        You can rename an input. With
        <code>"value: appTab"</code>
        , the tab's value goes into its selector. Inputs you don't list keep the
        part's defaults.
      </p>
    </section>

    <section id="elements" data-title="Choose the Selector">
      <h3>Choose the Selector</h3>
      <p>The host element becomes the part. So it must be the right element.</p>
      <ul>
        <li>
          Roots and containers can be custom elements, like
          <code>app-tabs</code>
          and
          <code>app-tab-list</code>
          .
        </li>
        <li>
          Parts people press or type in belong on a native
          <code>button</code>
          ,
          <code>a</code>
          or
          <code>input</code>
          . Examples are a tab, a trigger or an item. Use an attribute selector
          like
          <code>button[appTab]</code>
          . A custom element can't get focus, Enter and Space don't press it,
          and it isn't part of a form.
        </li>
      </ul>
    </section>

    <section id="use" data-title="Use It">
      <h3>Use It</h3>
      <app-code file="design-tabs-example.ts" [code]="example.value() ?? ''" />
      <p>
        Attributes on your component reach the part, for example
        <code>aria-label</code>
        . The element is the part.
      </p>
    </section>

    <section id="text" data-title="Text">
      <h3>Text</h3>
      <p>
        A part with its own text shows it with
        <code>uiText</code>
        . Add
        <code>UiText</code>
        as a host directive as well. Then your component always shows the text.
      </p>
      <app-code [code]="valueCode" />
    </section>

    <section id="structural" data-title="Parts That Come and Go">
      <h3>Parts That Come and Go</h3>
      <p>
        Parts with a
        <code>*</code>
        , like
        <code>*uiTabsPanel</code>
        or
        <code>*uiPopoverContent</code>
        , can't be host directives. They need a template, and a host directive
        has none. Keep them in your template, like the panels above. You can put
        your own components inside them.
      </p>
    </section>

    <section id="new" data-title="A Component That Isn't Here">
      <h3>A Component That Isn't Here</h3>
      <p>
        Some components have no directives yet. You can write their parts
        yourself, as shown in
        <a href="?doc=custom-parts">Custom Parts</a>
        . Your directives wrap the same way.
      </p>
    </section>
  `,
})
class Page {
  protected readonly valueCode = `@Component({
  selector: "app-select-value",
  hostDirectives: [{ directive: UiSelectValue, inputs: ["placeholder"] }, UiText],
  template: "",
})
class SelectValue {}`
  protected readonly tabs = resource({
    loader: text(
      () => import("./live/design-tabs", { with: { loader: "text" } })
    ),
  })
  protected readonly example = resource({
    loader: text(
      () => import("./live/design-tabs-example", { with: { loader: "text" } })
    ),
  })
}

export { Page }
