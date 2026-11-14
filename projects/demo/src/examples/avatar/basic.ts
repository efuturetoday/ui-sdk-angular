import { Component } from "@angular/core"
import { UiAvatar, UiAvatarFallback, UiAvatarImage } from "ngx-ui-sdk/avatar"

@Component({
  selector: "app-example",
  imports: [UiAvatar, UiAvatarFallback, UiAvatarImage],
  template: `
    <div data-slot="row">
      <span uiAvatar>
        <img uiAvatarImage [src]="person.src" [alt]="person.name" />
        <span *uiAvatarFallback
          ><span aria-hidden="true">CN</span
          ><span data-slot="visually-hidden">shadcn</span></span
        >
      </span>
    </div>
  `,
})
class Example {
  protected readonly person = {
    name: "shadcn",
    src: "https://github.com/shadcn.png",
  }
}

export { Example }
