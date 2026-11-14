import { Component } from "@angular/core"
import { CodeBlock } from "./code"

@Component({
  selector: "app-guide",
  imports: [CodeBlock],
  styleUrl: "./guide.css",
  template: `
    <p>You need an app on Angular 22 or newer.</p>

    <section id="install" data-title="Install the Packages">
      <h3>Install the Packages</h3>
      <app-code lang="bash" code="npm install @ngx-ui-sdk/core @ui-sdk/core" />
      <p>
        <code>@ngx-ui-sdk/core</code>
        contains the directives.
        <code>@ui-sdk/core</code>
        contains the behavior. It is a peer dependency, so your app and the
        directives share one copy.
      </p>
    </section>

    <section id="import" data-title="Import a Component">
      <h3>Import a Component</h3>
      <p>
        Every component has its own entry point. Your app only bundles what it
        imports.
      </p>
      <app-code [code]="importToggle" />
      <p>
        A dialog has several parts: a trigger, the content and a title. All of
        them come from the same entry point.
      </p>
      <app-code [code]="importDialog" />
      <p>
        Add them to the
        <code>imports</code>
        of your component. You don't need providers or a module.
      </p>
    </section>

    <section id="styles" data-title="Add Your Styles">
      <h3>Add Your Styles</h3>
      <p>
        The directives add no styles. Use your own CSS or the default theme.
        <a href="?doc=styling">Styling and Animation</a>
        explains both.
      </p>
    </section>

    <section id="rtl" data-title="Right to Left">
      <h3>Right to Left</h3>
      <p>
        Set
        <code>dir="rtl"</code>
        on the page or on a container. Arrow keys and popups follow it. You
        don't need a provider. Use logical CSS properties in your styles, for
        example
        <code>padding-inline-start</code>
        .
      </p>
    </section>

    <p>
      Next,
      <a href="?doc=first-component">First Component</a>
      adds a working toggle to your app.
    </p>
  `,
})
class Page {
  protected readonly importToggle = `import { UiButton } from "@ngx-ui-sdk/core/button"
import { UiToggle } from "@ngx-ui-sdk/core/toggle"`
  protected readonly importDialog = `import {
  UiDialog,
  UiDialogContent,
  UiDialogTitle,
  UiDialogTrigger,
} from "@ngx-ui-sdk/core/dialog"`
}

export { Page }
