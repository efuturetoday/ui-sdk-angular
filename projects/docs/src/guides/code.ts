import { Component, inject, input, resource } from "@angular/core"
import { DomSanitizer } from "@angular/platform-browser"

// A highlighted code block. It shows the plain code until the highlighter
// loads, so the page doesn't move when it does.
@Component({
  selector: "app-code",
  template: `
    @if (file(); as file) {
      <p class="file">{{ file }}</p>
    }
    @if (html.value(); as html) {
      <div class="highlighted" [innerHTML]="html"></div>
    } @else {
      <pre><code>{{ code() }}</code></pre>
    }
  `,
  styles: `
    :host {
      display: block;
      margin: 1rem 0 1.5rem;
      border: 1px solid var(--frame-line);
      border-radius: var(--ui-radius-surface);
      background: var(--frame-paper);
      overflow: hidden;
    }

    .file {
      margin: 0;
      padding: 8px 16px;
      border-block-end: 1px solid var(--frame-line);
      color: var(--frame-muted);
      font:
        12px var(--font-geist-mono),
        ui-monospace,
        monospace;
    }

    pre,
    .highlighted ::ng-deep pre {
      margin: 0;
      padding: 14px 16px;
      overflow-x: auto;
      background: transparent !important;
      font:
        13px / 1.6 var(--font-geist-mono),
        ui-monospace,
        monospace;
    }

    :host-context(:root[style*="dark"]) .highlighted ::ng-deep :is(pre, span) {
      color: var(--shiki-dark) !important;
    }
  `,
})
class CodeBlock {
  /** The code, as it's shown. */
  readonly code = input.required<string>()
  /** Its language for highlighting, like "bash" or "css". */
  readonly lang = input("angular-ts")
  /** A file name shown above it. */
  readonly file = input<string>()
  readonly #sanitizer = inject(DomSanitizer)
  protected readonly html = resource({
    params: () => ({ code: this.code().trim(), lang: this.lang() }),
    loader: async ({ params }) => {
      const { highlight } = await import("../shared/highlight")
      return this.#sanitizer.bypassSecurityTrustHtml(
        await highlight(params.code, params.lang)
      )
    },
  })
}

export { CodeBlock }
