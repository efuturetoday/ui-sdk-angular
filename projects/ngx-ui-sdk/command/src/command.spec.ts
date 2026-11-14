import { Component, viewChild } from "@angular/core"
import { TestBed } from "@angular/core/testing"
import {
  UiCommand,
  UiCommandInput,
  UiCommandItem,
  UiCommandList,
} from "./command"

const items = ["Copy", "Paste", "Cut"].map((label) => ({
  value: label.toLowerCase(),
  label,
}))

@Component({
  imports: [UiCommand, UiCommandInput, UiCommandItem, UiCommandList],
  template: `
    <div
      uiCommand
      [items]="items"
      (valueChange)="value = $event"
      (beforeValueChange)="cancel && $event.details.cancel()"
    >
      <input uiCommandInput aria-label="Search" />
      <div uiCommandList #list="uiCommandList">
        @for (item of $any(list.state().items); track item.value) {
          <div uiCommandItem [value]="item.value" [label]="item.label">
            {{ item.label }}
          </div>
        }
      </div>
    </div>
  `,
})
class Host {
  readonly items = items
  value: string | null = null
  cancel = false
  readonly command = viewChild.required(UiCommand)
}

async function settle(fixture: { whenStable: () => Promise<unknown> }) {
  await fixture.whenStable()
  await new Promise((resolve) => setTimeout(resolve))
  await fixture.whenStable()
}

describe("UiCommand", () => {
  it("gives a virtual list the highlighted command's index as arrow keys move it", async () => {
    const fixture = TestBed.createComponent(Host)
    await settle(fixture)
    pressArrowDown(fixture.nativeElement)
    await settle(fixture)
    expect(fixture.componentInstance.value).toBe("paste")
    expect(fixture.componentInstance.command().highlighted()).toBe(1)
  })

  it("leaves the index where it was when the change is canceled", async () => {
    const fixture = TestBed.createComponent(Host)
    fixture.componentInstance.cancel = true
    await settle(fixture)
    pressArrowDown(fixture.nativeElement)
    await settle(fixture)
    expect(fixture.componentInstance.value).toBeNull()
    expect(fixture.componentInstance.command().highlighted()).toBe(-1)
  })
})

function pressArrowDown(root: HTMLElement) {
  const input = root.querySelector("input")!
  input.focus()
  input.dispatchEvent(
    new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
  )
}
