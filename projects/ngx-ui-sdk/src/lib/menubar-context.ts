import { InjectionToken } from "@angular/core"
import type { MenubarApi } from "@ui-sdk/core/menubar"

/**
 * The menubar a menu belongs to, provided by a menubar: its api, as a
 * function. A menu inside another menu's content belongs to none.
 * @experimental
 */
const MenubarToken = new InjectionToken<() => MenubarApi>("menubar-api")

export { MenubarToken }
