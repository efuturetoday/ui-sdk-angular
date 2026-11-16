import { Component, computed, input } from "@angular/core"
import type { Node } from "../examples/composition"

// A component's parts as they nest, drawn like a file tree, in the Code tab's
// colors: tags as Shiki's GitHub themes draw them, and the directives as
// attributes.
@Component({
  selector: "app-composition",
  template: `
    <pre>@for (line of lines(); track $index) {<span class="line"><span class="tree">{{ line.tree }}</span><span class="tag">{{ line.tag }}</span>@for (part of line.parts; track part) {&#32;<span class="part">{{ part }}</span>}@if (line.each) {<span class="tree">&#32;&#32;(each)</span>}</span>}</pre>
  `,
  styles: `
    pre {
      margin: 0 0 2.5rem;
      padding: 1rem 1.25rem;
      overflow-x: auto;
      border: 1px solid var(--frame-line);
      border-radius: var(--ui-radius-surface);
      background: var(--frame-paper);
      font:
        13px / 1.7 var(--font-geist-mono),
        ui-monospace,
        monospace;
    }

    .line {
      display: block;
    }

    .tree {
      color: var(--frame-muted);
    }

    .tag {
      color: light-dark(#22863a, #85e89d);
    }

    .part {
      color: light-dark(#6f42c1, #b392f0);
    }
  `,
})
class Composition {
  /** The component's top-level nodes. */
  readonly nodes = input.required<Node[]>()
  protected readonly lines = computed(() => {
    const out: { tree: string; tag: string; parts: string[]; each: boolean }[] =
      []
    const draw = (nodes: Node[], prefix: string, top: boolean) =>
      nodes.forEach((node, index) => {
        const last = index === nodes.length - 1
        const branch = top ? "" : last ? "└── " : "├── "
        out.push({
          tree: prefix + branch,
          tag: node.tag,
          parts: node.parts,
          each: !!node.each,
        })
        draw(node.children, top ? "" : prefix + (last ? "    " : "│   "), false)
      })
    draw(this.nodes(), "", true)
    return out
  })
}

export { Composition }
