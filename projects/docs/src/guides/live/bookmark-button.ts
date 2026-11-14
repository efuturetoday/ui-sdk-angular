import { Component } from "@angular/core"
import { UiToggle } from "@ngx-ui-sdk/core/toggle"

@Component({
  selector: "app-bookmark-button",
  imports: [UiToggle],
  template: `<button uiToggle class="bookmark">Bookmark</button>`,
  styles: `
    .bookmark {
      height: 32px;
      padding: 0 12px;
      border: 1px solid #d4d4d4;
      border-radius: 6px;
      background: transparent;
      color: inherit;
      font: inherit;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }

    .bookmark:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }

    .bookmark[data-pressed] {
      border-color: #171717;
      background: #171717;
      color: #fff;
    }
  `,
})
class BookmarkButton {}

export { BookmarkButton }
