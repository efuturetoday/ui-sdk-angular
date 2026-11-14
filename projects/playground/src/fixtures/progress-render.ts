import { Component, signal } from "@angular/core"
import {
  UiAvatar,
  UiAvatarFallback,
  UiOtpInput,
  UiOtpInputSlot,
  UiProgress,
  UiProgressIndicator,
  UiProgressTrack,
  UiProgressValue,
} from "ui-sdk-angular"

@Component({
  selector: "app-fixture",
  imports: [
    UiAvatar,
    UiAvatarFallback,
  UiOtpInput,
  UiOtpInputSlot,
    UiProgress,
    UiProgressIndicator,
    UiProgressTrack,
    UiProgressValue,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <section
        uiProgress
        #progress="uiProgress"
        [value]="value()"
        aria-label="Export"
        [class]="'gauge is-' + (value() >= 100 ? 'complete' : 'progressing')"
      >
        <span uiProgressValue #current="uiProgressValue">{{ current.state().percent }}% done</span>
        <div uiProgressTrack class="gauge-track">
          <div uiProgressIndicator class="gauge-indicator" [attr.data-status]="progress.state().status"></div>
        </div>
      </section>
      <div uiAvatar class="avatar">
        <span *uiAvatarFallback="let state" class="avatar-fallback">
          <span [class]="'is-' + state().loadingStatus">RF</span>
        </span>
      </div>
      <section uiOtpInput aria-label="PIN" [maxLength]="4" class="otp">
        @for (index of slots; track index) {
          <div uiOtpInputSlot #slot="uiOtpInputSlot" [index]="index" class="otp-slot">
            <span [class.is-active]="slot.state().active">{{ slot.state().char ?? "·" }}</span>
          </div>
        }
      </section>
      <button (click)="value.set(100)">Finish</button>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `,
})
class Fixture {
  protected readonly value = signal(40)
  protected readonly slots = [0, 1, 2, 3]
}

export { Fixture }
