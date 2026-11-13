// Parts render and bind as React and Vue commit: changes wait a microtask, then
// render in template order and attach children first, so no part renders inside
// another and a popup binds with its whole content. See contributing/design.md.
let rendering = 0
const due = new Map<() => void, Node>()
const pending: { attach: () => void; el: Node }[] = []

const inPageOrder = (a: Node, b: Node) =>
  a === b
    ? 0
    : a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
      ? -1
      : 1

const childrenFirst = (a: Node, b: Node) =>
  a !== b && a.contains(b)
    ? 1
    : a !== b && b.contains(a)
      ? -1
      : inPageOrder(a, b)

// Renders now; what attaches meanwhile waits for the outermost render to end.
function inRender(render: () => void) {
  rendering++
  try {
    render()
  } finally {
    rendering--
  }
  if (rendering) {
    return
  }
  const ready = pending.splice(0).sort((a, b) => childrenFirst(a.el, b.el))
  ready.forEach(({ attach }) => attach())
}

// Attaches once the render around it is done, or now outside one.
function afterRendered(el: Node, attach: () => void) {
  if (rendering) {
    pending.push({ attach, el })
  } else {
    attach()
  }
}

function commit() {
  const syncs = [...due]
    .sort(([, a], [, b]) => inPageOrder(a, b))
    .map(([sync]) => sync)
  due.clear()
  inRender(() => syncs.forEach((sync) => sync()))
}

// Renders a part in the next commit, once however often it's asked. `at` is
// its place in the template.
function schedule(sync: () => void, at: Node) {
  if (!due.size) {
    queueMicrotask(commit)
  }
  due.set(sync, at)
}

export { afterRendered, inRender, schedule }
