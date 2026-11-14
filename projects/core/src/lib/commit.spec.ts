import { afterRendered, inRender, schedule } from "./commit"

describe("commit", () => {
  it("renders what's scheduled once, a microtask later", async () => {
    const at = document.body.appendChild(document.createElement("div"))
    const sync = vi.fn()
    schedule(sync, at)
    schedule(sync, at)
    expect(sync).not.toHaveBeenCalled()
    await Promise.resolve()
    expect(sync).toHaveBeenCalledTimes(1)
    at.remove()
  })

  it("renders in the order of the page, whatever the order asked", async () => {
    const first = document.body.appendChild(document.createElement("div"))
    const second = document.body.appendChild(document.createElement("div"))
    const order: string[] = []
    schedule(() => order.push("second"), second)
    schedule(() => order.push("first"), first)
    await Promise.resolve()
    expect(order).toEqual(["first", "second"])
    first.remove()
    second.remove()
  })

  it("attaches once the render around it ends, children first", () => {
    const parent = document.createElement("div")
    const child = parent.appendChild(document.createElement("span"))
    const order: string[] = []
    inRender(() => {
      afterRendered(parent, () => order.push("parent"))
      afterRendered(child, () => order.push("child"))
      expect(order).toEqual([])
    })
    expect(order).toEqual(["child", "parent"])
  })

  it("attaches at once outside a render", () => {
    const attach = vi.fn()
    afterRendered(document.createElement("div"), attach)
    expect(attach).toHaveBeenCalled()
  })
})
