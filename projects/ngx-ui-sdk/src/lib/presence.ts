// Angular takes a view out of the document without destroying it, like a route
// a RouteReuseStrategy keeps, and tells its directives nothing, so one observer
// reports when a place in the template leaves the document and comes back.
type Presence = {
  at: Node
  leave: () => void
  back: () => void
}

const watched = new Map<Presence, boolean>()
let observer: MutationObserver | undefined

// All that left or came back count as such before any of them acts, since
// letting go of the page changes state that others follow.
function check() {
  const changed = [...watched].filter(
    ([presence, away]) => presence.at.isConnected === away
  )
  changed.forEach(([presence, away]) => watched.set(presence, !away))
  changed.forEach(([presence, away]) =>
    away ? presence.back() : presence.leave()
  )
}

function watchPresence(presence: Presence) {
  watched.set(presence, false)
  if (!observer) {
    observer = new MutationObserver(check)
    observer.observe(document, { childList: true, subtree: true })
  }
}

function unwatchPresence(presence: Presence) {
  watched.delete(presence)
  if (!watched.size) {
    observer?.disconnect()
    observer = undefined
  }
}

export { type Presence, unwatchPresence, watchPresence }
