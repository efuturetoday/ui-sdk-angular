import { Component } from "@angular/core"
import { injectAsyncOptions } from "ngx-ui-sdk"
import {
  UiCommand,
  UiCommandEmpty,
  UiCommandInput,
  UiCommandItem,
  UiCommandList,
  UiCommandStatus,
} from "ngx-ui-sdk/command"

function searchIssues(query: string, { signal }: { signal: AbortSignal }) {
  const issues = [
    "Fix login redirect",
    "Dark mode flicker",
    "Add billing page",
    "Search is slow",
    "Update dependencies",
    "Crash on upload",
    "Export to CSV",
    "Keyboard shortcuts help",
  ]
  return new Promise<{ value: string; label: string }[]>((resolve, reject) => {
    const timer = setTimeout(() => {
      const needle = query.trim().toLowerCase()
      resolve(
        issues
          .filter((issue) => issue.toLowerCase().includes(needle))
          .map((issue) => ({
            value: issue.toLowerCase().replaceAll(" ", "-"),
            label: issue,
          }))
      )
    }, 400)
    signal.addEventListener("abort", () => {
      clearTimeout(timer)
      reject(new DOMException("Aborted", "AbortError"))
    })
  })
}

@Component({
  selector: "app-example",
  imports: [
    UiCommand,
    UiCommandEmpty,
    UiCommandInput,
    UiCommandItem,
    UiCommandList,
    UiCommandStatus,
  ],
  template: `
    <div
      uiCommand
      [filter]="false"
      [status]="issues.state().status"
      (queryChange)="issues.setQuery($event)"
      (loadMore)="issues.loadMore()"
    >
      <input
        uiCommandInput
        aria-label="Search issues"
        placeholder="Search issues…"
      />
      <div uiCommandStatus #status="uiCommandStatus">
        {{
          status.state().loading
            ? "Searching…"
            : status.state().count +
              " " +
              (status.state().count === 1 ? "issue" : "issues")
        }}
      </div>
      <div uiCommandEmpty #empty="uiCommandEmpty">
        @if (empty.state().empty && !empty.state().loading) {
          No issues match “{{ empty.state().query }}”.
        }
      </div>
      <div uiCommandList>
        @for (issue of issues.state().items; track issue.value) {
          <div uiCommandItem [value]="issue.value" [label]="issue.label">
            {{ issue.label }}
          </div>
        }
      </div>
    </div>
  `,
})
class Example {
  protected readonly issues = injectAsyncOptions(searchIssues, {
    debounce: 250,
    immediate: true,
  })
}

export { Example }
