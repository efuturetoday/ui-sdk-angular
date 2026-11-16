import { Component } from "@angular/core"
import { CodeBlock } from "./code"

@Component({
  selector: "app-guide",
  imports: [CodeBlock],
  styleUrl: "./guide.css",
  template: `
    <p>
      A theme styles every component by its parts' attributes, so your templates
      stay as they are. Install one, change it with CSS variables, or write your
      own.
    </p>

    <section id="install" data-title="Install a Theme">
      <h3>Install a Theme</h3>
      <p>The default theme is ui-sdk's example styling, as on this site.</p>
      <app-code lang="bash" code="npm install @ngx-ui-sdk/theme-default" />
      <p>
        Add it to
        <code>angular.json</code>
        , before your own styles:
      </p>
      <app-code lang="json" [code]="angularJson" />
      <p>
        The theme only styles elements inside
        <code>data-ui-theme</code>
        . Put it on
        <code>&lt;body&gt;</code>
        to style the whole app, or on a part of the page.
      </p>
      <app-code lang="html" [code]="body" />
      <p>
        Colors use
        <code>light-dark()</code>
        , so set
        <code>color-scheme</code>
        on your page for light, dark or both. The font comes from your app.
      </p>
    </section>

    <section id="less-css" data-title="Load Less CSS">
      <h3>Load Less CSS</h3>
      <p>
        Instead of
        <code>all.css</code>
        , import the variables, the base styles and only the components you use.
      </p>
      <app-code lang="css" [code]="lessCss" />
    </section>

    <section id="customize" data-title="Change Its Look">
      <h3>Change Its Look</h3>
      <p>
        The theme's colors, corners, spacing and sizes are CSS variables, all
        starting with
        <code>--ui-</code>
        . Set them on the same element to change every component at once.
      </p>
      <app-code lang="css" [code]="customizeCss" />
      <p>
        Variables that follow from another change with it: the focus ring
        follows
        <code>--ui-primary</code>
        , and the corners of rows, controls and popups follow
        <code>--ui-radius</code>
        .
      </p>
      <p>
        A shape no variable gives, like round buttons, is a rule of your own,
        after the theme:
      </p>
      <app-code lang="css" [code]="shapeCss" />
    </section>

    <section id="own" data-title="Make Your Own Theme">
      <h3>Make Your Own Theme</h3>
      <p>
        A theme is plain CSS for the parts'
        <code>data-slot</code>
        and state attributes, inside a scope, so you can write one from scratch.
        <a href="?doc=styling">Styling and Animation</a>
        lists what to style.
      </p>
      <app-code lang="css" [code]="ownCss" />
      <p>
        To start from the default theme's look instead, keep its variables and
        replace the rest: put
        <code>data-ui-tokens</code>
        on an element instead of
        <code>data-ui-theme</code>
        . It sets only the variables, for styles of your own.
      </p>
      <app-code lang="html" [code]="tokens" />
      <p>
        The variables are also in the package's
        <code>tokens/</code>
        folder, in the
        <a href="https://www.designtokens.org/">Design Tokens</a>
        format, for tools like Figma plugins and Style Dictionary.
        <code>base.json</code>
        holds what both color modes share, and
        <code>light.json</code>
        and
        <code>dark.json</code>
        hold the colors.
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
  protected readonly angularJson = `"styles": ["@ngx-ui-sdk/theme-default/all.css", "src/styles.css"]`
  protected readonly body = `<body data-ui-theme></body>`
  protected readonly lessCss = `@import "@ngx-ui-sdk/theme-default/tokens.css";
@import "@ngx-ui-sdk/theme-default/base.css";
@import "@ngx-ui-sdk/theme-default/dialog.css";`
  protected readonly customizeCss = `[data-ui-theme] {
  --ui-primary: #2563eb;
  --ui-radius: 4px;
}`
  protected readonly shapeCss = `[data-ui-theme] [data-slot="button"] {
  border-radius: 999px;
}`
  protected readonly ownCss = `@scope ([data-my-theme]) {
  [data-slot="button"] {
    padding: 0 12px;
    border-radius: 8px;
    background: #171717;
    color: white;
  }

  [data-slot="toggle"][data-pressed] {
    background: #f4f4f3;
  }
}`
  protected readonly tokens = `<body data-ui-tokens></body>`
}

export { Page }
