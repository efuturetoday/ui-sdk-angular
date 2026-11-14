import { Component, signal } from "@angular/core"
import { TestBed } from "@angular/core/testing"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import { UiInput } from "@ngx-ui-sdk/core/input"
import { createAgent } from "./public-api"

@Component({
  imports: [UiField, UiFieldLabel, UiInput],
  template: `
    <div uiField>
      <label uiFieldLabel>Project name</label>
      <input uiInput [(value)]="name" />
    </div>
  `,
})
class Host {
  readonly name = signal("Apollo")
}

describe("an agent", () => {
  it("reads the components and changes them through their API", async () => {
    const agent = createAgent()
    const fixture = TestBed.createComponent(Host)
    await fixture.whenStable()
    const input = agent
      .snapshot()
      .find((component) => component.label === "Project name")
    expect(input).toMatchObject({ value: "Apollo" })
    expect(input?.actions).toContain("setValue")
    await agent.act({
      steps: [{ ref: "Project name", action: "setValue", args: ["Atlas"] }],
    })
    await fixture.whenStable()
    expect(fixture.componentInstance.name()).toBe("Atlas")
    expect(
      (fixture.nativeElement.querySelector("input") as HTMLInputElement).value
    ).toBe("Atlas")
  })
})
