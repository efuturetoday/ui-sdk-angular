import { Component, DestroyRef, inject, signal } from "@angular/core"
import {
  LucideArrowUp,
  LucideCheck,
  LucideClock,
  LucideCode,
  LucideFile,
  LucideX,
} from "@lucide/angular"
import {
  createTokenInputController,
  toText,
  type TokenInputValue,
  type TriggerDefinition,
  type TriggerMenuDataItem,
  type TriggerMenuSelectDetails,
  UiTokenInput,
  UiTokenInputEditor,
  UiTokenInputToken,
  UiTokenInputTokenRemove,
  UiTokenInputTokens,
  UiTriggerMenu,
  UiTriggerMenuContent,
  UiTriggerMenuEmpty,
  UiTriggerMenuHint,
  UiTriggerMenuItem,
  UiTriggerMenuList,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

const loadFile = () => new Promise<void>((resolve) => setTimeout(resolve, 800))

@Component({
  selector: "app-example",
  imports: [
    LucideArrowUp,
    LucideCheck,
    LucideClock,
    LucideCode,
    LucideFile,
    LucideX,
    UiTokenInput,
    UiTokenInputEditor,
    UiTokenInputToken,
    UiTokenInputTokenRemove,
    UiTokenInputTokens,
    UiTriggerMenu,
    UiTriggerMenuContent,
    UiTriggerMenuEmpty,
    UiTriggerMenuHint,
    UiTriggerMenuItem,
    UiTriggerMenuList,
  ],
  template: `
    <ng-container uiTokenInput [controller]="prompt" [onSubmit]="send">
      <div data-slot="card">
        <div
          uiTokenInputEditor
          aria-label="Prompt"
          placeholder="Ask anything. Type @ or /"
        ></div>
        <div data-slot="row">
          <button
            type="button"
            data-size="sm"
            (mousedown)="$event.preventDefault()"
            (click)="attachReadme()"
          >
            Attach README
          </button>
          <button
            type="button"
            data-variant="solid"
            data-size="sm"
            data-shape="round"
            [attr.aria-label]="running() ? 'Running' : 'Send'"
            [disabled]="running()"
            (click)="send(prompt.getValue())"
          >
            @if (running()) {
              <svg lucideClock aria-hidden="true"></svg>
            } @else {
              <svg lucideArrowUp aria-hidden="true"></svg>
            }
          </button>
        </div>
      </div>
      <ng-container uiTriggerMenu [triggers]="triggers" [onSelect]="onSelect">
        <span uiTriggerMenuHint></span>
        <div *uiTriggerMenuContent="let state">
          <div uiTriggerMenuEmpty>No matches</div>
          <div uiTriggerMenuList #list="uiTriggerMenuList">
            @for (item of itemsOf(list.state().items); track item.value) {
              <div
                uiTriggerMenuItem
                [value]="item.value"
                [label]="item.label"
                [disabled]="item.disabled"
              >
                {{ item.label }}
              </div>
            }
          </div>
        </div>
      </ng-container>
      <ng-template uiTokenInputTokens let-token>
        <span uiTokenInputToken>
          @if (token.type === "skill") {
            <svg lucideCode aria-hidden="true"></svg>
          } @else {
            <svg lucideFile aria-hidden="true"></svg>
          }
          {{ token.type === "skill" ? "/" + token.label : token.label }}
          @if (token.data?.["run"] === "running") {
            <svg lucideClock aria-hidden="true"></svg>
          }
          @if (token.data?.["run"] === "done") {
            <svg lucideCheck aria-hidden="true"></svg>
          }
          <span uiTokenInputTokenRemove
            ><svg lucideX aria-hidden="true"></svg
          ></span>
        </span>
      </ng-template>
    </ng-container>
  `,
})
class Example {
  protected readonly files = [
    { value: "src/app.tsx", label: "app.tsx", keywords: ["src"] },
    { value: "src/routes.ts", label: "routes.ts", keywords: ["src"] },
    { value: "src/styles.css", label: "styles.css", keywords: ["src"] },
    { value: "README.md", label: "README.md" },
    { value: "package.json", label: "package.json" },
  ]
  protected readonly skills = [
    {
      value: "search",
      label: "search",
      arguments: [{ name: "query", hint: "<query>", required: true }],
    },
    { value: "review", label: "review" },
    { value: "summarize", label: "summarize" },
  ]
  protected readonly triggers: TriggerDefinition[] = [
    { char: "@", type: "file", items: this.files },
    { char: "/", boundary: "start", type: "skill", items: this.skills },
  ]
  protected readonly log = injectLog()
  protected readonly prompt = createTokenInputController()
  protected readonly running = signal(false)
  #sendTimer: ReturnType<typeof setTimeout> | undefined

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.#sendTimer))
  }

  protected readonly send = (value: TokenInputValue) => {
    if (this.running() || !this.prompt.getLabel().trim()) {
      return
    }
    this.running.set(true)
    const skillTokens = value.filter(
      (segment) => typeof segment !== "string" && segment.type === "skill"
    )
    for (const skill of skillTokens) {
      if (typeof skill !== "string") {
        this.prompt.updateToken(skill.id!, {
          data: { ...skill.data, run: "running" },
        })
      }
    }
    this.#sendTimer = setTimeout(() => {
      for (const skill of skillTokens) {
        if (typeof skill !== "string") {
          this.prompt.updateToken(skill.id!, {
            data: { ...skill.data, run: "done" },
          })
        }
      }
      this.log(`Sent ${toText(this.prompt.getValue())}`)
      this.prompt.clear()
      this.running.set(false)
    }, 1500)
  }

  protected readonly onSelect = (
    _value: string,
    details: TriggerMenuSelectDetails<string>
  ) => (details.trigger === "@" ? loadFile() : undefined)

  protected attachReadme() {
    this.prompt.insert(
      { type: "file", value: "README.md", label: "README.md" },
      { resolve: loadFile() }
    )
  }

  protected itemsOf(items: unknown) {
    return items as TriggerMenuDataItem[]
  }
}

export { Example }
