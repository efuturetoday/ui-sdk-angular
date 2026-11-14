import { Component, resource } from "@angular/core"
import { CodeBlock } from "./code"
import { RatingExample } from "./live/rating-example"

const text = (load: () => Promise<unknown>) => () =>
  load().then((module) => (module as { default: string }).default)

@Component({
  selector: "app-guide",
  imports: [CodeBlock, RatingExample],
  styleUrl: "./guide.css",
  template: `
    <p>
      Some components have no directives yet. You can write their parts with the
      same helpers this package uses. This page turns the star rating from
      ui-sdk's
      <a href="https://ui-sdk.dev/docs/core/compose-behaviors">
        Compose Behaviors
      </a>
      guide into Angular directives. To wrap a component that already exists,
      see
      <a href="?doc=wrap-parts">Wrap Parts</a>
      .
    </p>
    <div class="preview"><app-rating-example /></div>

    <section id="primitive" data-title="The Primitive">
      <h3>The Primitive</h3>
      <p>
        A primitive describes a component without a framework. It has options,
        state, behavior and parts. This is ui-sdk's rating without changes. It
        handles selection, arrow keys and focus. It has two parts:
        <code>root</code>
        and
        <code>star</code>
        .
      </p>
      <app-code file="rating.ts" [code]="primitive.value() ?? ''" />
    </section>

    <section id="root" data-title="Write the Root">
      <h3>Write the Root</h3>
      <p>
        The root directive owns the instance.
        <code>injectPrimitive</code>
        creates it and keeps its options in sync with your inputs.
        <code>provideRoot</code>
        lets the parts inside find it.
        <code>injectPart</code>
        makes the directive's element the
        <code>root</code>
        part.
      </p>
      <p>
        Call these helpers in field initializers. They start when Angular has
        set the inputs. The instance is destroyed together with the directive.
        You don't need
        <code>ngOnInit</code>
        .
      </p>
    </section>

    <section id="part" data-title="Write a Part">
      <h3>Write a Part</h3>
      <p>
        A part gets the instance of its root with
        <code>injectHandle</code>
        . Then it binds its own slot. Its props, like the star's
        <code>value</code>
        , come from a function, so they stay up to date. Its
        <code>state</code>
        is a signal for your templates.
      </p>
      <app-code file="rating-parts.ts" [code]="parts.value() ?? ''" />
    </section>

    <section id="text" data-title="Show Text">
      <h3>Show Text</h3>
      <p>
        A directive can provide text for
        <code>uiText</code>
        . It provides itself as a
        <code>TextSource</code>
        . Its
        <code>attach</code>
        says how the text is written. Use
        <code>showText</code>
        for plain text and
        <code>showMarked</code>
        for text with search matches. You can also write your own.
        <code>appRatingValue</code>
        above shows how many stars are set.
      </p>
    </section>

    <section id="use" data-title="Use It">
      <h3>Use It</h3>
      <p>
        The directives work like the built-in ones.
        <code>app-rating</code>
        is a component with the root directive as a host directive. So the
        element itself is the root. The stars stay buttons, so they get focus
        and react to Enter and Space. Style them with the attributes of the
        primitive, like
        <code>data-filled</code>
        .
      </p>
      <app-code file="rating-example.ts" [code]="example.value() ?? ''" />
    </section>

    <p>
      ui-sdk's
      <a href="https://ui-sdk.dev/docs/core">Core documentation</a>
      explains how to write primitives and the behaviors behind them.
    </p>
  `,
})
class Page {
  protected readonly primitive = resource({
    loader: text(() => import("./live/rating", { with: { loader: "text" } })),
  })
  protected readonly parts = resource({
    loader: text(
      () => import("./live/rating-parts", { with: { loader: "text" } })
    ),
  })
  protected readonly example = resource({
    loader: text(
      () => import("./live/rating-example", { with: { loader: "text" } })
    ),
  })
}

export { Page }
