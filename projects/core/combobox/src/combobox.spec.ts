import { Component, signal } from "@angular/core"
import { TestBed } from "@angular/core/testing"
import { UiCombobox, UiComboboxInput } from "./combobox"

const items = [
  { value: "on", label: "Ontario" },
  { value: "qc", label: "Quebec" },
]

@Component({
  imports: [UiCombobox, UiComboboxInput],
  template: `
    <ng-container
      uiCombobox
      [items]="items"
      [itemToValue]="toValue"
      [itemToLabel]="toLabel"
      [(value)]="value">
      <input uiComboboxInput aria-label="State" />
    </ng-container>
  `,
})
class Host {
  readonly items = items
  readonly toValue = (item: (typeof items)[number]) => item.value
  readonly toLabel = (item: (typeof items)[number]) => item.label
  readonly value = signal<unknown>(items[0])
}

async function settle(fixture: { whenStable: () => Promise<unknown> }) {
  await fixture.whenStable()
  await new Promise((resolve) => setTimeout(resolve))
  await fixture.whenStable()
}

describe("UiCombobox", () => {
  it("clears the selection when a controlled value is set to null", async () => {
    const fixture = TestBed.createComponent(Host)
    await settle(fixture)
    const input = fixture.nativeElement.querySelector("input")
    expect(input.value).toBe("Ontario")
    fixture.componentInstance.value.set(null)
    await settle(fixture)
    expect(input.value).toBe("")
  })
})
