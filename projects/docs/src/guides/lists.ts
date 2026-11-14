import { Component } from "@angular/core"
import { CodeBlock } from "./code"

@Component({
  selector: "app-guide",
  imports: [CodeBlock],
  styleUrl: "./guide.css",
  template: `
    <p>
      Select, Combobox, Autocomplete, Command, Listbox and Menu show lists. You
      can write the items yourself. You can also pass data and render the items
      the list gives back.
    </p>

    <section id="items" data-title="Items You Write">
      <h3>Items You Write</h3>
      <p>
        Write each item with its
        <code>value</code>
        and its text.
      </p>
      <app-code [code]="written" />
    </section>

    <section id="data" data-title="Items From Data">
      <h3>Items From Data</h3>
      <p>
        Pass the items with
        <code>[items]</code>
        . The list filters and sorts them while people type. Render the items
        from
        <code>state().items</code>
        .
      </p>
      <app-code [code]="data" />
    </section>

    <section id="virtual" data-title="Long Lists">
      <h3>Long Lists</h3>
      <p>
        For thousands of items, use
        <code>*uiVirtualFor</code>
        instead of
        <code>&#64;for</code>
        . It only renders the rows in view. Every row has the same height. Arrow
        keys still reach every item. The list scrolls to the highlighted item.
      </p>
      <app-code [code]="virtual" />
    </section>

    <section id="loading" data-title="Items That Load">
      <h3>Items That Load</h3>
      <p>
        Items that load while people type come from Angular's
        <code>resource()</code>
        or
        <code>httpResource()</code>
        .
        <code>asyncOptions</code>
        turns them into the list's items and its loading status.
      </p>
      <app-code [code]="loading" />
    </section>
  `,
})
class Page {
  protected readonly written = `<div uiSelectList>
  <div uiSelectItem value="apple">Apple</div>
  <div uiSelectItem value="banana">Banana</div>
</div>`
  protected readonly data = `<ng-container uiCombobox [items]="fruits">
  <input uiComboboxInput aria-label="Fruit" />
  <div *uiComboboxContent="let state">
    <div uiComboboxList>
      @for (item of state().items; track item.value) {
        <div uiComboboxItem [value]="item.value">{{ item.label }}</div>
      }
    </div>
  </div>
</ng-container>`
  protected readonly virtual = `<div uiSelectList>
  <div
    *uiVirtualFor="let item of items; rowHeight: 32"
    uiSelectItem
    [value]="item.value"
    [label]="item.label"
  >
    {{ item.label }}
  </div>
</div>`
  protected readonly loading = `import { asyncOptions } from "@ngx-ui-sdk/core"

readonly query = signal("")
readonly countries = resource({
  params: () => this.query(),
  loader: ({ params, abortSignal }) => search(params, abortSignal),
})
readonly options = asyncOptions(this.countries)

// <ng-container uiSelect [(query)]="query" [items]="options.items()"
//   [status]="options.status()" [filter]="false">`
}

export { Page }
