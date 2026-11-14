import { Component } from "@angular/core"

@Component({
  selector: "app-guide",
  styleUrl: "./guide.css",
  template: `
    <p>
      <code>@ngx-ui-sdk/core</code>
      brings
      <a href="https://github.com/vercel-labs/ui">ui-sdk</a>
      to Angular. It handles keyboard navigation, focus, dismissal and ARIA for
      components like Select, Dialog and Tabs. Every part of a component is a
      directive. You put it on your own element. You write the markup and the
      styles.
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
          <span>Add your first component and style it.</span>
        </a>
        <a href="?doc=wrap-parts">
          <strong>Your Own Components</strong>
          <span>Wrap the parts in your own components or build new ones.</span>
        </a>
      </div>
    </section>

    <section id="styles" data-title="Styles">
      <h3>Styles</h3>
      <p>
        The parts have no styles. Use your own CSS, or start with
        <code>@ngx-ui-sdk/theme-default</code>
        . That is the theme of this site.
        <a href="?doc=styling">Styling and Animation</a>
        explains both.
      </p>
    </section>

    <section id="ui-sdk-docs" data-title="ui-sdk's Documentation">
      <h3>ui-sdk's Documentation</h3>
      <p>
        The components behave the same as in ui-sdk's other frameworks. Their
        options, events and keys are described in the
        <a href="https://ui-sdk.dev/docs">ui-sdk documentation</a>
        . Only the names differ:
        <code>DialogTrigger</code>
        there is
        <code>uiDialogTrigger</code>
        here.
      </p>
    </section>

    <section id="agents" data-title="Agents">
      <h3>Agents</h3>
      <p>
        AI agents can read and use your components. Import
        <code>createAgent</code>
        from
        <code>@ngx-ui-sdk/core/agent</code>
        . The
        <a href="https://ui-sdk.dev/docs/agents">ui-sdk documentation</a>
        explains how it works.
      </p>
    </section>

    <section id="tested" data-title="Tested">
      <h3>Tested</h3>
      <p>
        This is not an official ui-sdk package. It runs ui-sdk's own end-to-end
        tests without changes. There are more than 4,000 of them. The server
        rendering tests don't run yet.
      </p>
    </section>
  `,
})
class Page {}

export { Page }
