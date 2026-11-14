import { Component, signal } from "@angular/core"
import {
  scrollAreaFixture,
  scrollAreaOptions,
} from "tests/fixtures/scroll-area"
import {
  UiScrollArea,
  UiScrollAreaContent,
  UiScrollAreaCorner,
  UiScrollAreaScrollbar,
  UiScrollAreaScrollToEnd,
  UiScrollAreaThumb,
  UiScrollAreaViewport,
} from "ui-sdk-angular"

const { tags, gallery, short, chat } = scrollAreaFixture

@Component({
  selector: "app-fixture",
  imports: [
    UiScrollArea,
    UiScrollAreaContent,
    UiScrollAreaCorner,
    UiScrollAreaScrollbar,
    UiScrollAreaScrollToEnd,
    UiScrollAreaThumb,
    UiScrollAreaViewport,
  ],
  template: `
    <div class="fixture scroll-fixture">
      <button>Before</button>
      <div uiScrollArea class="scroll-area" [type]="options.type" [scrollHideDelay]="options.scrollHideDelay">
        <div uiScrollAreaViewport class="scroll-area-viewport" role="region" [attr.aria-label]="tags.label">
          <div uiScrollAreaContent>
            @for (item of tags.items; track item) {
              <p class="scroll-area-item">{{ item }}</p>
            }
          </div>
        </div>
        @if (!native) {
          <div uiScrollAreaScrollbar class="scroll-area-scrollbar">
            <div uiScrollAreaThumb class="scroll-area-thumb"></div>
          </div>
        }
      </div>
      <div uiScrollArea class="scroll-area is-wide" [type]="options.type" [scrollHideDelay]="options.scrollHideDelay">
        <div uiScrollAreaViewport class="scroll-area-viewport" role="region" [attr.aria-label]="gallery.label">
          <div uiScrollAreaContent class="scroll-area-grid">
            @for (item of gallery.items; track item) {
              <a [href]="'#' + item">{{ item }}</a>
            }
          </div>
        </div>
        <div uiScrollAreaScrollbar class="scroll-area-scrollbar">
          <div uiScrollAreaThumb class="scroll-area-thumb"></div>
        </div>
        <div uiScrollAreaScrollbar class="scroll-area-scrollbar" orientation="horizontal">
          <div uiScrollAreaThumb class="scroll-area-thumb"></div>
        </div>
        <div uiScrollAreaCorner class="scroll-area-corner"></div>
      </div>
      <div uiScrollArea class="scroll-area" [type]="options.type" [scrollHideDelay]="options.scrollHideDelay">
        <div uiScrollAreaViewport class="scroll-area-viewport" role="region" [attr.aria-label]="short.label">
          <div uiScrollAreaContent>
            @for (item of short.items; track item) {
              <p class="scroll-area-item">{{ item }}</p>
            }
          </div>
        </div>
        <div uiScrollAreaScrollbar class="scroll-area-scrollbar">
          <div uiScrollAreaThumb class="scroll-area-thumb"></div>
        </div>
      </div>
      <div uiScrollArea class="scroll-area is-chat" stickToEnd [type]="options.type" [scrollHideDelay]="options.scrollHideDelay">
        <div uiScrollAreaViewport class="scroll-area-viewport" role="region" [attr.aria-label]="chat.label">
          <div uiScrollAreaContent>
            @for (message of messages(); track $index) {
              <p class="scroll-area-message">
                {{ message.text }}
                @if (message.image) {
                  <span
                    role="img"
                    aria-label="Image"
                    style="display: block"
                    [style.height]="imagesLoaded() ? chat.imageHeight + 'px' : '0px'"
                  ></span>
                }
              </p>
            }
          </div>
        </div>
        <div uiScrollAreaScrollbar class="scroll-area-scrollbar">
          <div uiScrollAreaThumb class="scroll-area-thumb"></div>
        </div>
        <button uiScrollAreaScrollToEnd class="scroll-area-end">{{ chat.jump }}</button>
      </div>
      <button (click)="addMessage()">Add message</button>
      <button (click)="stream()">Stream</button>
      <button (click)="addMessage(true)">Add image</button>
      <button (click)="imagesLoaded.set(true)">Load images</button>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      <div class="scroll-fixture-spacer"></div>
    </div>
  `,
})
class Fixture {
  protected readonly tags = tags
  protected readonly gallery = gallery
  protected readonly short = short
  protected readonly chat = chat
  protected readonly options = (() => {
    const { native: _native, ...options } = scrollAreaOptions()
    return options
  })()
  protected readonly native = scrollAreaOptions().native
  protected readonly messages = signal<{ text: string; image?: boolean }[]>(
    chat.messages.map((text) => ({ text }))
  )
  protected readonly imagesLoaded = signal(false)

  protected addMessage(image = false) {
    this.messages.update((messages) => [
      ...messages,
      { text: `Message ${messages.length + 1}`, image },
    ])
  }

  protected stream() {
    this.messages.update((messages) => [
      ...messages.slice(0, -1),
      {
        ...messages[messages.length - 1]!,
        text: messages[messages.length - 1]!.text + chat.streamed,
      },
    ])
  }
}

export { Fixture }
