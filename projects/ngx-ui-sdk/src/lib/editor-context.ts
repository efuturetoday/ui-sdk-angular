import { InjectionToken } from "@angular/core"
import type { TextEditorAdapter } from "@ui-sdk/core/trigger-menu"

/**
 * The text editor a trigger menu inside suggests into, like a token input's,
 * apart from the token input, so a trigger menu doesn't bundle it.
 * @experimental
 */
const EditorToken = new InjectionToken<() => TextEditorAdapter | undefined>(
  "text-editor"
)

export { EditorToken }
