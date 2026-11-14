import { computed, inject, InjectionToken } from "@angular/core"
import type { ToolbarApi } from "@ui-sdk/core/toolbar"

// The toolbar a toggle or toggle group sits in, apart from the toolbar, so a
// toggle can join one without bundling it.
const ToolbarToken = new InjectionToken<() => ToolbarApi>("toolbar")

// Whether the toolbar group an item, toggle or toggle group sits in is disabled.
const ToolbarGroupDisabled = new InjectionToken<() => boolean>("toolbar-group")

// The arrow keys and tab stop of the toolbar this sits in, if any, for a
// primitive's `toolbar` option. Computed, so it follows the group's disabled.
function injectToolbarScope() {
  const toolbar = inject(ToolbarToken, { optional: true })
  const groupDisabled = inject(ToolbarGroupDisabled, { optional: true })
  return computed(() => {
    if (!toolbar) {
      return undefined
    }
    const disabled = groupDisabled?.() ?? false
    return () => toolbar().internal.scopeIn(disabled)
  })
}

export { injectToolbarScope, ToolbarGroupDisabled, ToolbarToken }
