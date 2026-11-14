import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { UiListbox, UiListboxItem, UiListboxItemIndicator } from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [LucideCheck, UiListbox, UiListboxItem, UiListboxItemIndicator],
  template: `
    <div uiListbox readOnly defaultValue="nuxt" aria-label="Framework">
      @for (framework of frameworks; track framework.value) {
        <div uiListboxItem [value]="framework.value">
          {{ framework.label }}
          <span *uiListboxItemIndicator
            ><svg lucideCheck aria-hidden="true"></svg
          ></span>
        </div>
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
