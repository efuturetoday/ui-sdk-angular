import { Component, signal } from "@angular/core"
import { LucideArrowLeft, LucideMoon, LucideUsers } from "@lucide/angular"
import {
  createCommandController,
  UiCommand,
  UiCommandEmpty,
  UiCommandGroup,
  UiCommandGroupLabel,
  UiCommandInput,
  UiCommandItem,
  UiCommandItemIcon,
  UiCommandList,
  UiCommandPage,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    LucideArrowLeft,
    LucideMoon,
    LucideUsers,
    UiCommand,
    UiCommandEmpty,
    UiCommandGroup,
    UiCommandGroupLabel,
    UiCommandInput,
    UiCommandItem,
    UiCommandItemIcon,
    UiCommandList,
    UiCommandPage,
  ],
  template: `
    <div
      uiCommand
      [(pages)]="pages"
      [controller]="command"
      [onAction]="onAction"
    >
      <div data-slot="row">
        @for (page of pages(); track page) {
          <span data-slot="badge">{{ page }}</span>
        }
      </div>
      <input
        uiCommandInput
        aria-label="Search commands"
        [placeholder]="
          pages().length
            ? 'Search… (Backspace to go back)'
            : 'What do you need?'
        "
      />
      <div uiCommandEmpty>No results found.</div>
      <div uiCommandList>
        <ng-container *uiCommandPage>
          <div uiCommandGroup>
            <div uiCommandGroupLabel>Workspace</div>
            <div uiCommandItem value="theme" page="theme">
              <span uiCommandItemIcon><svg lucideMoon></svg></span>
              Change theme…
            </div>
            <div uiCommandItem value="teams" page="teams">
              <span uiCommandItemIcon><svg lucideUsers></svg></span>
              Switch team…
            </div>
          </div>
        </ng-container>
        <ng-container *uiCommandPage="'theme'">
          @for (theme of themes; track theme.value) {
            <div uiCommandItem [value]="theme.value">{{ theme.label }}</div>
          }
        </ng-container>
        <ng-container *uiCommandPage="'teams'">
          @for (team of teams; track team.value) {
            <div uiCommandItem [value]="team.value">{{ team.label }}</div>
          }
        </ng-container>
        @if (pages().length > 0) {
          <div uiCommandItem value="back">
            <span uiCommandItemIcon mirror><svg lucideArrowLeft></svg></span>
            Go back
          </div>
        }
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
  protected readonly teams = [
    { value: "design", label: "Design" },
    { value: "engineering", label: "Engineering" },
    { value: "marketing", label: "Marketing" },
  ]
  protected readonly command = createCommandController()
  protected readonly pages = signal<string[]>([])

  protected readonly onAction = (value: string) => {
    if (value === "back") {
      this.command.pop()
    }
  }
}

export { Example }
