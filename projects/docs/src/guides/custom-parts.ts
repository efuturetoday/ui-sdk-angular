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
      Every component here is built from the same few helpers, and you can use
      them for a component of your own. This page turns the star rating from
      ui-sdk's
      <a href="https://ui-sdk.dev/docs/core/compose-behaviors"
        >Compose Behaviors</a
      >
      guide into Angular directives.
    </p>
    <div class="preview"><app-rating-example /></div>

    <section id="primitive" data-title="The Primitive">
      <h3>The Primitive</h3>
      <p>
        A primitive defines a component's options, state, behavior and parts,
        with no framework in it. This one is ui-sdk's rating, unchanged: it
        handles selection, arrow keys and focus, and has two parts,
        <code>root</code> and <code>star</code>.
      </p>
      <app-code file="rating.ts" [code]="primitive.value() ?? ''" />
    </section>

    <section id="root" data-title="Write the Root">
      <h3>Write the Root</h3>
      <p>
        The root directive owns the instance. <code>injectPrimitive</code>
        creates it and keeps its options current from your signal inputs.
        <code>provideRoot</code> lets the parts inside find it, and
        <code>injectPart</code> makes the directive's element the
        <code>root</code> part.
      </p>
      <p>
        Call the helpers in field initializers. They start once Angular has set
        the inputs, and the instance is destroyed with the directive. There's no
        <code>ngOnInit</code> to write.
      </p>
    </section>

    <section id="part" data-title="Write a Part">
      <h3>Write a Part</h3>
      <p>
        A part injects the instance of the root around it with
        <code>injectHandle</code> and binds its own slot. Its props, like the
        star's <code>value</code>, come from a getter, so they stay current. Its
        <code>state</code> is a signal you can read in templates.
      </p>
      <app-code file="rating-parts.ts" [code]="parts.value() ?? ''" />
    </section>

    <section id="use" data-title="Use It">
      <h3>Use It</h3>
      <p>
        The directives work like the built-in ones: on your own elements, styled
        by the attributes the primitive sets, like
        <code>data-filled</code>.
      </p>
      <app-code file="rating-example.ts" [code]="example.value() ?? ''" />
    </section>

    <section id="more" data-title="More Helpers">
      <h3>More Helpers</h3>
      <ul>
        <li>
          <code>injectPresentPart</code> makes a structural directive a part
          that core shows and hides, like a dialog's content.
        </li>
        <li>
          <code>injectPopupPart</code> does the same for a popup, placed beside
          its anchor.
        </li>
        <li>
          <code>injectTargetPart</code> and <code>injectConnectedPart</code>
          bind a part to an instance outside its root, like a trigger connected
          through a controller.
        </li>
      </ul>
      <p>
        ui-sdk's
        <a href="https://ui-sdk.dev/docs/core">Core documentation</a> covers
        writing primitives and the behaviors they're built from.
      </p>
    </section>
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
