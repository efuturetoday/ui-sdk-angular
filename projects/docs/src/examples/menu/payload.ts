import { Component } from "@angular/core"
import { LucideEllipsis } from "@lucide/angular"
import {
  createMenuController,
  UiMenu,
  UiMenuContent,
  UiMenuGroup,
  UiMenuGroupLabel,
  UiMenuItem,
  UiMenuSeparator,
  UiMenuTrigger,
} from "@ngx-ui-sdk/core/menu"
import { injectLog } from "../../shared/log"

type File = { name: string; size: string }

const files: File[] = [
  { name: "Roadmap.pdf", size: "2.4 MB" },
  { name: "Budget.xlsx", size: "860 KB" },
  { name: "Team photo.jpg", size: "5.1 MB" },
]

@Component({
  selector: "app-example",
  imports: [
    LucideEllipsis,
    UiMenu,
    UiMenuContent,
    UiMenuGroup,
    UiMenuGroupLabel,
    UiMenuItem,
    UiMenuSeparator,
    UiMenuTrigger,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button (click)="openFirst($event)">
          Open {{ files[0].name }} Actions
        </button>
      </div>
      <ul data-slot="list">
        @for (file of files; track file.name) {
          <li data-slot="row">
            {{ file.name }}
            <span data-slot="hint">{{ file.size }}</span>
            <button
              uiMenuTrigger
              [controller]="menu"
              [payload]="file"
              [attr.aria-label]="'Actions for ' + file.name"
              data-variant="ghost"
              data-size="sm"
            >
              <svg lucideEllipsis aria-hidden="true"></svg>
            </button>
          </li>
        }
      </ul>
      <ng-container uiMenu [controller]="menu" [onAction]="onAction">
        <div *uiMenuContent="let state; align: 'end'">
          <div uiMenuGroup>
            <div uiMenuGroupLabel>{{ payload(state().payload)?.name }}</div>
            <div uiMenuItem value="open">Open</div>
            <div uiMenuItem value="rename">Rename</div>
            <div uiMenuItem value="duplicate">Duplicate</div>
          </div>
          <div uiMenuSeparator></div>
          <div uiMenuItem value="delete">Delete</div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly #log = injectLog()
  protected readonly files = files
  protected readonly menu = createMenuController<File>()
  protected readonly onAction = (action: string) =>
    this.#log(`${action} ${this.menu.getPayload()?.name}`)

  protected payload(value: unknown) {
    return value as File | undefined
  }

  protected async openFirst(event: MouseEvent) {
    const result = await this.menu.open({
      payload: files[0],
      anchor: event.currentTarget as HTMLElement,
    })
    this.#log(`Closed with ${result.reason}`)
  }
}

export { Example }
