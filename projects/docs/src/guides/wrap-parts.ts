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
      Wrap parts in components of your own, like a design system does, with
      Angular's <code>hostDirectives</code>. Your component is the part: it gets
      the part's behavior, ARIA and attributes, and adds your styles.
    </p>
    <div class="preview"><app-design-tabs-example /></div>

    <section id="wrap" data-title="Wrap a Part">
      <h3>Wrap a Part</h3>
      <p>
        Add the part's directive to <code>hostDirectives</code>, and pass on the
        inputs and outputs your component should have:
      </p>
      <app-code file="design-tabs.ts" [code]="tabs.value() ?? ''" />
      <p>
        An input can take another name, like <code>"value: appTab"</code>, so
        the tab's value goes in its selector. Inputs you don't list stay set by
        the part.
      </p>
    </section>

    <section id="elements" data-title="Choose the Selector">
      <h3>Choose the Selector</h3>
      <p>
        The host element becomes the part, so it has to be the right element for
        it:
      </p>
      <ul>
        <li>
          Roots and containers, like <code>app-tabs</code> and
          <code>app-tab-list</code>, can be elements of their own.
        </li>
        <li>
          Parts people press or type in, like a tab, a trigger or an item,
          belong on a native <code>button</code>, <code>a</code> or
          <code>input</code>, with an attribute selector like
          <code>button[appTab]</code>. A custom element isn't focusable, isn't
          pressed by Enter and Space, and takes no part in forms.
        </li>
      </ul>
    </section>

    <section id="use" data-title="Use It">
      <h3>Use It</h3>
      <app-code file="design-tabs-example.ts" [code]="example.value() ?? ''" />
      <p>
        Attributes you write on your component, like
        <code>aria-label</code>, reach the part, since the element is the part.
      </p>
    </section>

    <section id="structural" data-title="Parts That Come and Go">
      <h3>Parts That Come and Go</h3>
      <p>
        Parts written with a <code>*</code>, like <code>*uiTabsPanel</code> or
        <code>*uiPopoverContent</code>, can't be host directives: they need a
        template, and a host directive has none. Keep them in the template, as
        the panels above are, or put the content of your own inside them.
      </p>
    </section>

    <section id="new" data-title="A Component That Isn't Here">
      <h3>A Component That Isn't Here</h3>
      <p>
        To build a component ui-sdk has no directives for yet, write its parts
        with <a href="?doc=custom-parts">Custom Parts</a>. Your directives wrap
        the same way.
      </p>
    </section>
  `,
})
class Page {
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
