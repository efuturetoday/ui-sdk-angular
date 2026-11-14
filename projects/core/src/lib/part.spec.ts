import { Component, Directive, input, output } from "@angular/core"
import { TestBed } from "@angular/core/testing"
import { toggle } from "@ui-sdk/core/toggle"
import { injectPart } from "./part"
import { injectPrimitive, provideRoot } from "./primitive"

// A directive of one's own, with no ngOnInit: the primitive and the part
// start on their own once Angular has set the inputs.
@Directive({
  selector: "[uiOwnToggle]",
  providers: [provideRoot(toggle, () => OwnToggle)],
})
class OwnToggle {
  readonly defaultPressed = input(false)
  readonly pressedChange = output<boolean>()
  readonly handle = injectPrimitive(toggle, () => ({
    defaultPressed: this.defaultPressed(),
    onPressedChange: (pressed: boolean) => this.pressedChange.emit(pressed),
  }))
  readonly state = injectPart(this.handle, "root").state
}

@Component({
  selector: "ui-own-wrapper",
  hostDirectives: [
    {
      directive: OwnToggle,
      inputs: ["defaultPressed"],
      outputs: ["pressedChange"],
    },
  ],
  template: "<ng-content />",
})
class OwnWrapper {}

@Component({
  imports: [OwnToggle, OwnWrapper],
  template: `
    <button
      uiOwnToggle
      [defaultPressed]="true"
      (pressedChange)="pressed = $event"
    >
      Bold
    </button>
    <ui-own-wrapper tabindex="0" (pressedChange)="wrapped = $event">
      Italic
    </ui-own-wrapper>
  `,
})
class Host {
  pressed: boolean | undefined
  wrapped: boolean | undefined
}

async function render() {
  const fixture = TestBed.createComponent(Host)
  await fixture.whenStable()
  return fixture
}

describe("a part with no ngOnInit", () => {
  it("has its attributes from the first render, with its inputs", async () => {
    const fixture = await render()
    const button = fixture.nativeElement.querySelector("button") as HTMLElement
    expect(button.getAttribute("aria-pressed")).toBe("true")
    expect(button.dataset["slot"]).toBe("toggle")
  })

  it("behaves, and emits through its output", async () => {
    const fixture = await render()
    const button = fixture.nativeElement.querySelector("button") as HTMLElement
    button.click()
    await fixture.whenStable()
    expect(fixture.componentInstance.pressed).toBe(false)
    expect(button.getAttribute("aria-pressed")).toBe("false")
  })

  it("works as a host directive of a component of one's own", async () => {
    const fixture = await render()
    const wrapper = fixture.nativeElement.querySelector(
      "ui-own-wrapper"
    ) as HTMLElement
    expect(wrapper.getAttribute("aria-pressed")).toBe("false")
    wrapper.click()
    await fixture.whenStable()
    expect(fixture.componentInstance.wrapped).toBe(true)
    expect(wrapper.getAttribute("aria-pressed")).toBe("true")
  })
})
