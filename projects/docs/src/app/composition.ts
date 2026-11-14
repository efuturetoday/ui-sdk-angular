import { Component, computed, input } from "@angular/core"
import type { Node } from "../examples/composition"

// A component's parts as they nest, drawn like a file tree.
@Component({
  selector: "app-composition",
  template: `
    <pre>{{ lines() }}</pre>
  `,
  styles: `
    pre {
      margin: 0 0 2.5rem;
      padding: 1rem 1.25rem;
      overflow-x: auto;
      border: 1px solid var(--frame-line);
      background: var(--frame-paper);
      font:
        13px / 1.7 var(--font-geist-mono),
        ui-monospace,
        monospace;
    }
  `,
})
class Composition {
  /** The component's top-level nodes. */
  readonly nodes = input.required<Node[]>()
  protected readonly lines = computed(() => {
    const out: string[] = []
    const draw = (nodes: Node[], prefix: string, top: boolean) =>
      nodes.forEach((node, index) => {
        const last = index === nodes.length - 1
        const branch = top ? "" : last ? "└── " : "├── "
        const label = `${node.tag} ${node.parts.join(" ")}`
        out.push(prefix + branch + label + (node.each ? "  (each)" : ""))
        draw(node.children, top ? "" : prefix + (last ? "    " : "│   "), false)
      })
    draw(this.nodes(), "", true)
    return out.join("\n")
  })
}

export { Composition }
