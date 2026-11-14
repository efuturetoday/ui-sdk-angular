import { Component, resource } from "@angular/core"
import { CodeBlock } from "./code"
import { BookmarkButton } from "./live/bookmark-button"

@Component({
  selector: "app-guide",
  imports: [BookmarkButton, CodeBlock],
  styleUrl: "./guide.css",
  template: `
    <p>
      Let's add a Bookmark toggle. Press it once to turn it on, and again to
      turn it off. If you haven't installed the packages yet, start with
      <a href="?doc=installation">Installation</a>.
    </p>

    <section id="create" data-title="Create the Component">
      <h3>Create the Component</h3>
      <p>
        Create <code>bookmark-button.ts</code> and put <code>uiToggle</code> on
        a button:
      </p>
      <app-code file="bookmark-button.ts" [code]="start" />
      <p>
        The button keeps track of whether it's pressed, handles Enter and Space,
        and sets <code>aria-pressed</code> for screen readers.
      </p>
    </section>

    <section id="use" data-title="Use It in Your App">
      <h3>Use It in Your App</h3>
      <p>Import <code>BookmarkButton</code> in your app component:</p>
      <app-code file="app.ts" [code]="app" />
    </section>

    <section id="styles" data-title="Add Styles">
      <h3>Add Styles</h3>
      <p>
        While the toggle is pressed, it has a <code>data-pressed</code>
        attribute. Style it with that:
      </p>
      <app-code file="bookmark-button.ts" [code]="source.value() ?? ''" />
      <p>Try it:</p>
      <div class="preview"><app-bookmark-button /></div>
      <p>
        Keep the label the same in both states. <code>aria-pressed</code>
        tells a screen reader whether it's on.
      </p>
    </section>

    <section id="next" data-title="Keep Going">
      <h3>Keep Going</h3>
      <ul>
        <li>
          <a href="?component=toggle">Toggle</a> covers disabled toggles,
          controlled state and groups.
        </li>
        <li>
          <a href="?doc=parts-and-composition">Parts and Composition</a> shows
          how to put a component with several parts together.
        </li>
        <li>
          <a href="?doc=state-and-events">State and Events</a> shows how to read
          changes and control state from your app.
        </li>
        <li>
          <a href="?doc=styling">Styling and Animation</a> covers state
          attributes, CSS variables and transitions.
        </li>
      </ul>
    </section>
  `,
})
class Page {
  protected readonly start = `import { Component } from "@angular/core"
import { UiToggle } from "@ngx-ui-sdk/core/toggle"

@Component({
  selector: "app-bookmark-button",
  imports: [UiToggle],
  template: \`<button uiToggle>Bookmark</button>\`,
})
class BookmarkButton {}

export { BookmarkButton }`
  protected readonly app = `import { Component } from "@angular/core"
import { BookmarkButton } from "./bookmark-button"

@Component({
  selector: "app-root",
  imports: [BookmarkButton],
  template: \`<app-bookmark-button />\`,
})
class App {}

export { App }`
  protected readonly source = resource({
    loader: () =>
      import("./live/bookmark-button", { with: { loader: "text" } }).then(
        (module: unknown) => (module as { default: string }).default
      ),
  })
}

export { Page }
