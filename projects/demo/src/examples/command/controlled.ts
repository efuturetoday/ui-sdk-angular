import { Component, signal } from "@angular/core"
import {
  UiCommand,
  UiCommandInput,
  UiCommandItem,
  UiCommandList,
  UiCommandPage,
} from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiCommand,
    UiCommandInput,
    UiCommandItem,
    UiCommandList,
    UiCommandPage,
  ],
  template: `
    <div
      uiCommand
      [(value)]="value"
      [(query)]="query"
      [(pages)]="pages"
      [onAction]="ran"
      (beforeValueChange)="
        log(
          'Highlighted ' +
            ($event.value ?? 'nothing') +
            ' (' +
            $event.details.reason +
            ')'
        )
      "
      (beforeQueryChange)="
        log('Query “' + $event.query + '” (' + $event.details.reason + ')')
      "
      (beforePagesChange)="
        log(
          'Pages [' +
            $event.pages.join(', ') +
            '] (' +
            $event.details.reason +
            ')'
        )
      "
    >
      <input
        uiCommandInput
        aria-label="Search themes"
        placeholder="Search themes…"
      />
      <div uiCommandList>
        <ng-container *uiCommandPage>
          <div uiCommandItem value="theme" page="theme">Change theme…</div>
        </ng-container>
        <ng-container *uiCommandPage="'theme'">
          @for (theme of themes; track theme.value) {
            <div uiCommandItem [value]="theme.value">{{ theme.label }}</div>
          }
        </ng-container>
      </div>
    </div>
  `,
})
class Example {
  protected readonly themes = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ]
  protected readonly value = signal<string | null | undefined>("dark")
  protected readonly query = signal<string | undefined>("")
  protected readonly pages = signal<string[] | undefined>(["theme"])
  protected readonly log = injectLog()
  protected readonly ran = (value: string) => this.log(`Ran ${value}`)
}

export { Example }
