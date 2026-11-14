import { Component, resource } from "@angular/core"
import { CodeBlock } from "./code"
import { BookmarkButton } from "./live/bookmark-button"

@Component({
  selector: "app-guide",
  imports: [BookmarkButton, CodeBlock],
  styleUrl: "./guide.css",
  template: `
    <p>
      Let's build a Bookmark toggle. Press it once to turn it on. Press it again
      to turn it off. Install the packages first, as shown in
      <a href="?doc=installation">Installation</a>
      .
    </p>

    <section id="create" data-title="Create the Component">
      <h3>Create the Component</h3>
      <p>
        Create
        <code>bookmark-button.ts</code>
        and put
        <code>uiToggle</code>
        on a button.
      </p>
      <app-code file="bookmark-button.ts" [code]="start" />
      <p>
        The button now remembers if it is pressed. It reacts to Enter and Space.
        It also sets
        <code>aria-pressed</code>
        for screen readers.
      </p>
    </section>

    <section id="use" data-title="Use It in Your App">
      <h3>Use It in Your App</h3>
      <p>
        Import
        <code>BookmarkButton</code>
        in your app component.
      </p>
      <app-code file="app.ts" [code]="app" />
    </section>

    <section id="styles" data-title="Add Styles">
      <h3>Add Styles</h3>
      <p>
        A pressed toggle has the attribute
        <code>data-pressed</code>
        . Use it in your CSS.
      </p>
      <app-code file="bookmark-button.ts" [code]="source.value() ?? ''" />
      <p>Try it:</p>
      <div class="preview"><app-bookmark-button /></div>
      <p>
        Keep the label the same in both states. Screen readers learn the state
        from
        <code>aria-pressed</code>
        .
      </p>
    </section>

    <p>
      Next,
      <a href="?doc=parts-and-composition">Parts and Composition</a>
      builds a component with several parts.
    </p>
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
