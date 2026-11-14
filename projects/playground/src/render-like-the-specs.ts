import type { ApplicationRef } from "@angular/core"

// The specs read the page right after an event, as Vue and React render by
// then; zoneless Angular renders a task later. See the playground's README.
const events = [
  "pointerdown",
  "pointerup",
  "click",
  "keydown",
  "keyup",
  "input",
  "change",
  "submit",
  "focusin",
  "focusout",
]

function renderLikeTheSpecs(app: ApplicationRef) {
  let queued = false
  const tick = () => {
    queued = false
    app.tick()
  }
  for (const type of events) {
    window.addEventListener(type, () => {
      if (!queued) {
        queued = true
        // After the adapter's commit: Angular counts view changes right after a tick as a loop.
        queueMicrotask(() => queueMicrotask(tick))
      }
    })
  }
}

export { renderLikeTheSpecs }
