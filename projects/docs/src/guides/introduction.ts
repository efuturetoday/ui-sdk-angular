import { Component } from "@angular/core"

@Component({
  selector: "app-guide",
  styleUrl: "./guide.css",
  template: `
    <p>
      <code>@ngx-ui-sdk/core</code> brings
      <a href="https://github.com/vercel-labs/ui">ui-sdk</a> to Angular. Its
      components, like Select, Dialog and Tabs, handle keyboard navigation,
      focus, dismissal and ARIA for you. Each part of a component is a directive
      you put on your own element, so you write the markup and the styles.
    </p>

    <section id="set-it-up" data-title="Set It Up">
      <h3>Set It Up</h3>
      <div class="cards">
        <a href="?doc=installation">
          <strong>Installation</strong>
          <span>Install the packages in your Angular app.</span>
        </a>
        <a href="?doc=first-component">
          <strong>First Component</strong>
          <span>Add and style your first component.</span>
        </a>
      </div>
    </section>

    <section id="learn-the-basics" data-title="Learn the Basics">
      <h3>Learn the Basics</h3>
      <p>
        The guides cover what all components share:
        <a href="?doc=parts-and-composition">putting parts together</a>,
        <a href="?doc=state-and-events">state and events</a> and
        <a href="?doc=styling">styling</a>. Each component has its own page with
        live examples.
      </p>
    </section>

    <section id="ui-sdk-docs" data-title="ui-sdk's Documentation">
      <h3>ui-sdk's Documentation</h3>
      <p>
        The components work the same as in ui-sdk's other frameworks, so its
        <a href="https://ui-sdk.dev/docs">documentation</a> applies here too:
        every component's options, events and keyboard behavior. The names
        follow one rule: ui-sdk's <code>DialogTrigger</code> is
        <code>uiDialogTrigger</code> here.
      </p>
    </section>

    <section id="tested" data-title="Tested Like the Official Adapters">
      <h3>Tested Like the Official Adapters</h3>
      <p>
        This isn't an official ui-sdk package. It runs ui-sdk's own end-to-end
        tests unchanged, more than 4,000 of them, the same ones the React, Vue,
        Svelte, Solid and web component adapters pass.
      </p>
    </section>
  `,
})
class Page {}

export { Page }
