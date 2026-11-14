import { Component, signal } from "@angular/core"
import {
  UiMenu,
  UiMenuContent,
  UiMenuItemIndicator,
  UiMenuRadioGroup,
  UiMenuRadioItem,
  UiMenuTrigger,
  UiMenubar,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    UiMenu,
    UiMenuContent,
    UiMenuItemIndicator,
    UiMenuRadioGroup,
    UiMenuRadioItem,
    UiMenuTrigger,
    UiMenubar,
  ],
  template: `
    <div data-slot="stack">
      <div uiMenubar>
        <ng-container uiMenu>
          <button uiMenuTrigger>Profiles</button>
          <div *uiMenuContent="let state">
            <div uiMenuRadioGroup defaultValue="ines">
              @for (profile of profiles; track profile.value) {
                <div uiMenuRadioItem [value]="profile.value">
                  <span *uiMenuItemIndicator></span>
                  {{ profile.label }}
                </div>
              }
            </div>
          </div>
        </ng-container>
        <ng-container uiMenu>
          <button uiMenuTrigger>Theme</button>
          <div *uiMenuContent="let state">
            <div uiMenuRadioGroup [(value)]="theme">
              @for (option of themes; track option.value) {
                <div uiMenuRadioItem [value]="option.value">
                  <span *uiMenuItemIndicator></span>
                  {{ option.label }}
                </div>
              }
            </div>
          </div>
        </ng-container>
      </div>
      <output data-slot="output">Theme: {{ theme() }}</output>
    </div>
  `,
})
class Example {
  protected readonly profiles = [
    { value: "hollis", label: "Hollis" },
    { value: "ines", label: "Inès" },
    { value: "kofi", label: "Kofi" },
  ]
  protected readonly themes = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ]
  protected readonly theme = signal<string | null | undefined>("system")
}

export { Example }
