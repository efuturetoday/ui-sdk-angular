import { Component, Directive, input, output } from "@angular/core"
import {
  injectHandle,
  injectPart,
  injectPrimitive,
  provideRoot,
  showText,
  TextSource,
} from "@ngx-ui-sdk/core"
import { rating } from "./rating"

@Directive({
  selector: "[appRating]",
  providers: [provideRoot(rating, () => AppRating)],
})
class AppRating {
  readonly value = input<number>()
  readonly defaultValue = input<number>()
  readonly valueChange = output<number>()
  readonly handle = injectPrimitive(rating, () => ({
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: (value, details) => {
      if (!details.canceled) {
        this.valueChange.emit(value)
      }
    },
  }))
  readonly state = injectPart(this.handle, "root").state
}

@Directive({ selector: "button[appRatingStar]" })
class AppRatingStar {
  readonly value = input.required<string>({ alias: "appRatingStar" })
  readonly state = injectPart(injectHandle(rating), "star", () => ({
    value: this.value(),
  })).state
}

@Directive({
  selector: "[appRatingValue]",
  providers: [{ provide: TextSource, useExisting: AppRatingValue }],
})
class AppRatingValue implements TextSource {
  readonly #handle = injectHandle(rating)
  readonly attach = showText(() => `${this.#handle.state().value} of 5`)
}

@Component({
  selector: "app-rating",
  hostDirectives: [
    {
      directive: AppRating,
      inputs: ["value", "defaultValue"],
      outputs: ["valueChange"],
    },
  ],
  template: "<ng-content />",
})
class Rating {}

export { AppRating, AppRatingStar, AppRatingValue, Rating }
