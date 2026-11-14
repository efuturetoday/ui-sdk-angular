import { Component } from "@angular/core"
import { LucideExternalLink } from "@lucide/angular"
import { UiListbox, UiListboxItem } from "@ngx-ui-sdk/core/listbox"

@Component({
  selector: "app-example",
  imports: [LucideExternalLink, UiListbox, UiListboxItem],
  template: `
    <div
      uiListbox
      defaultValue="next"
      activation="manual"
      aria-label="Framework docs">
      @for (framework of frameworks; track framework.value) {
        <a
          uiListboxItem
          #item="uiListboxItem"
          [value]="framework.value"
          [label]="framework.label"
          [href]="'#' + framework.value">
          <span>{{ framework.label }}</span>
          @if (item.state().selected) {
            <svg lucideExternalLink aria-hidden="true"></svg>
          }
        </a>
      }
    </div>
  `,
})
class Example {
  protected readonly frameworks = [
    { value: "next", label: "Next.js" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" },
    { value: "nuxt", label: "Nuxt" },
    { value: "sveltekit", label: "SvelteKit" },
  ]
}

export { Example }
