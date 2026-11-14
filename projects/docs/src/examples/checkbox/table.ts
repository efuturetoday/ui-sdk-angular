import { Component, signal } from "@angular/core"
import { LucideCheck, LucideMinus } from "@lucide/angular"
import {
  UiCheckbox,
  UiCheckboxInput,
  UiCheckboxGroup,
  UiCheckboxIndicator,
} from "@ngx-ui-sdk/core/checkbox"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideMinus,
    UiCheckbox,
    UiCheckboxInput,
    UiCheckboxGroup,
    UiCheckboxIndicator,
  ],
  template: `
    <div
      uiCheckboxGroup
      [(value)]="selected"
      aria-label="Team members"
      [allValues]="ids"
      (valueChange)="log($event.length + ' of ' + people.length + ' selected')"
    >
      <table>
        <caption data-slot="visually-hidden">
          Team members
        </caption>
        <thead>
          <tr>
            <th>
              <button
                uiCheckbox
                #box="uiCheckbox"
                aria-label="Select all"
                parent
              >
                <span *uiCheckboxIndicator>
                  <svg lucideCheck aria-hidden="true"></svg>
                  <svg lucideMinus aria-hidden="true"></svg>
                </span>
              </button>
              <input [uiCheckboxInput]="box" />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          @for (person of people; track person.id) {
            <tr>
              <td>
                <button
                  uiCheckbox
                  #box2="uiCheckbox"
                  [value]="person.id"
                  [attr.aria-label]="'Select ' + person.name"
                >
                  <span *uiCheckboxIndicator>
                    <svg lucideCheck aria-hidden="true"></svg>
                  </span>
                </button>
                <input [uiCheckboxInput]="box2" />
              </td>
              <td>{{ person.name }}</td>
              <td>{{ person.email }}</td>
              <td>{{ person.role }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
class Example {
  protected readonly people = [
    {
      id: "hollis",
      name: "Hollis Grant",
      email: "hollis@example.com",
      role: "Owner",
    },
    {
      id: "ines",
      name: "Inès Moreau",
      email: "ines@example.com",
      role: "Editor",
    },
    {
      id: "kofi",
      name: "Kofi Mensah",
      email: "kofi@example.com",
      role: "Viewer",
    },
    {
      id: "wren",
      name: "Wren Takahashi",
      email: "wren@example.com",
      role: "Editor",
    },
  ]
  protected readonly ids = this.people.map((person) => person.id)
  protected readonly log = injectLog()
  protected readonly selected = signal(["hollis"])
}

export { Example }
