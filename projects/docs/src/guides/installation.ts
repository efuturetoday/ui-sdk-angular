import { Component } from "@angular/core"
import { CodeBlock } from "./code"

@Component({
  selector: "app-guide",
  imports: [CodeBlock],
  styleUrl: "./guide.css",
  template: `
    <p>Start with an app on Angular 22 or newer.</p>

    <section id="install" data-title="Install the Packages">
      <h3>Install the Packages</h3>
      <app-code lang="bash" code="npm install @ngx-ui-sdk/core @ui-sdk/core" />
      <p>
        <code>@ngx-ui-sdk/core</code> has the directives.
        <code>@ui-sdk/core</code> has their behavior and is a peer dependency,
        so your app and the directives share one copy.
      </p>
    </section>

    <section id="import" data-title="Import a Component">
      <h3>Import a Component</h3>
      <p>
        Each component has its own entry point. Your app only bundles the
        components it imports.
      </p>
      <app-code [code]="importToggle" />
      <p>
        A dialog has separate parts for its trigger, content and title. Import
        them from the same entry point:
      </p>
      <app-code [code]="importDialog" />
      <p>
        Add them to your component's <code>imports</code>. There are no
        providers to register and no module to import.
      </p>
    </section>

    <section id="styles" data-title="Add Your Styles">
      <h3>Add Your Styles</h3>
      <p>
        The directives add no styles. Style them with your own CSS, or start
        from the default theme.
        <a href="?doc=styling">Styling and Animation</a> covers both.
      </p>
    </section>

    <section id="rtl" data-title="Right to Left">
      <h3>Right to Left</h3>
      <p>
        Set <code>dir="rtl"</code> on the page or a container. Arrow keys and
        popup placement follow it without a provider. Use logical CSS
        properties, like <code>padding-inline-start</code>, in your styles.
      </p>
    </section>

    <section id="server-rendering" data-title="Server Rendering">
      <h3>Server Rendering</h3>
      <p class="note">
        Server rendering isn't tested yet. ui-sdk's server rendering tests don't
        run against this package so far.
      </p>
    </section>

    <p>
      Continue with <a href="?doc=first-component">First Component</a> to add a
      working toggle to your app.
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
