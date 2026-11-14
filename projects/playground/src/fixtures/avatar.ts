import { Component, signal } from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import { avatarAction, avatarFixture } from "tests/fixtures/avatar"
import {
  UiAvatar,
  UiAvatarFallback,
  UiAvatarImage,
  type AvatarLoadingStatus,
} from "ngx-ui-sdk/avatar"

@Component({
  selector: "app-fixture",
  imports: [UiAvatar, UiAvatarFallback, UiAvatarImage],
  template: `
    <div class="fixture">
      <button>Before</button>
      @for (mount of [mounts()]; track mount) {
        <span uiAvatar class="avatar" (loadingStatusChange)="onStatus($event.status, $event.details)">
          @if (src() !== undefined) {
            <img uiAvatarImage class="avatar-image" [src]="src()" [alt]="first.name" />
          }
          <span *uiAvatarFallback class="avatar-fallback">{{ first.initials }}</span>
        </span>
      }
      @for (item of rest; track item.name) {
        <span uiAvatar class="avatar">
          @if (item.src !== undefined) {
            <img
              uiAvatarImage
              class="avatar-image"
              [src]="item.src"
              [alt]="item.name"
              [attr.referrerpolicy]="item.referrerPolicy"
              [attr.crossorigin]="item.crossOrigin"
            />
          }
          <span *uiAvatarFallback="let state; delay: item.delay" class="avatar-fallback">{{ item.initials }}</span>
        </span>
      }
      <button (click)="src.set(next)">Change image</button>
      <button (click)="src.set(undefined)">Remove image</button>
      <button (click)="mounts.set(mounts() + 1)">Remount</button>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly first = avatarFixture.items[0]!
  protected readonly rest = avatarFixture.items.slice(1)
  protected readonly next = avatarFixture.nextSrc
  protected readonly action = signal("")
  protected readonly src = signal<string | undefined>(this.first.src)
  protected readonly mounts = signal(0)

  protected onStatus(status: AvatarLoadingStatus, details: ChangeDetails) {
    this.action.set(avatarAction(status, details.reason))
  }
}

export { Fixture }
