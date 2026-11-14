import { NgComponentOutlet } from "@angular/common"
import {
  afterRenderEffect,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  input,
  resource,
  signal,
  viewChild,
} from "@angular/core"
import { DomSanitizer } from "@angular/platform-browser"
import { LucideRotateCcw } from "@lucide/angular"
import { UiButton } from "@ngx-ui-sdk/core/button"
import {
  UiTabs,
  UiTabsIndicator,
  UiTabsList,
  UiTabsPanel,
  UiTabsTab,
} from "@ngx-ui-sdk/core/tabs"
import {
  UiTooltip,
  UiTooltipContent,
  UiTooltipTrigger,
} from "@ngx-ui-sdk/core/tooltip"
import { examples } from "../examples"
import { ExampleLog } from "../shared/log"

// Shared files an example may import besides the logger, shown beside it.
const sharedSources: Record<string, () => Promise<string>> = {
  id: () =>
    import("../shared/id", { with: { loader: "text" } }).then(
      (module: unknown) => (module as { default: string }).default
    ),
}

@Component({
  selector: "app-example-frame",
  imports: [
    LucideRotateCcw,
    NgComponentOutlet,
    UiButton,
    UiTabs,
    UiTabsIndicator,
    UiTabsList,
    UiTabsPanel,
    UiTabsTab,
    UiTooltip,
    UiTooltipContent,
    UiTooltipTrigger,
  ],
  templateUrl: "./example-frame.html",
  styleUrl: "./example-frame.css",
})
class ExampleFrame {
  /** The example, like "dialog/basic". */
  readonly name = input.required<string>()
  protected readonly caption = computed(() => examples[this.name()]?.caption)
  protected readonly logs = computed(() => !!examples[this.name()]?.logs)
  protected readonly tab = signal<"preview" | "code">("preview")
  protected readonly run = signal(0)
  protected readonly log = signal<string[]>([])
  protected readonly component = resource({
    params: () => this.name(),
    loader: ({ params }) => examples[params]!.load(),
  })
  // The example's own files, read at build time, so the HTML is trusted.
  // They show as you'd copy them, as ui-sdk.dev shows them: the logger is the
  // page's, imported from "./log", and other shared files sit beside it.
  protected readonly source = resource({
    params: () => (this.tab() === "code" ? this.name() : undefined),
    loader: async ({ params }) => {
      const [source, { highlight }] = await Promise.all([
        examples[params]!.source(),
        import("../shared/highlight"),
      ])
      const files = [
        {
          name: `${params.split("/")[1]}.ts`,
          code: source.replace(/from "(?:\.\.\/)+shared\/log"/, 'from "./log"'),
        },
      ]
      for (const [, shared] of source.matchAll(
        /from "(?:\.\.\/)+shared\/([\w-]+)"/g
      )) {
        const load = sharedSources[shared!]
        if (!load) {
          continue
        }
        files[0]!.code = files[0]!.code.replace(
          new RegExp(`from "(?:\\.\\./)+shared/${shared}"`),
          `from "./${shared}"`
        )
        files.push({ name: `${shared}.ts`, code: await load() })
      }
      return Promise.all(
        files.map(async ({ name, code }) => ({
          name,
          html: this.#sanitizer.bypassSecurityTrustHtml(
            await highlight(code.trimEnd())
          ),
        }))
      )
    },
  })
  readonly #sanitizer = inject(DomSanitizer)
  protected readonly injector = Injector.create({
    providers: [
      {
        provide: ExampleLog,
        useValue: (message: string) =>
          this.log.update((entries) => [...entries, message]),
      },
    ],
    parent: inject(Injector),
  })

  protected readonly logList = viewChild<ElementRef<HTMLElement>>("logList")

  constructor() {
    const preview = inject(ElementRef).nativeElement as HTMLElement
    // The preview grows with what opens in it and never shrinks back, so
    // closing a panel doesn't move the page; a reset starts it over.
    let tallest = 0
    // It writes the height a frame later: writing it as the observer reports
    // would resize what it observes in the same frame, which browsers report.
    const observer = new ResizeObserver(([entry]) => {
      const height = entry!.borderBoxSize[0]!.blockSize
      if (height <= tallest) {
        return
      }
      tallest = height
      requestAnimationFrame(() => {
        const box = entry!.target as HTMLElement
        box.style.minHeight = `${tallest}px`
        // The code takes the same height, so switching tabs doesn't jump.
        preview.style.setProperty("--preview-height", `${tallest}px`)
      })
    })
    afterRenderEffect(() => {
      this.run()
      tallest = 0
      const box = preview.querySelector<HTMLElement>(".preview")
      if (box) {
        box.style.minHeight = ""
        observer.disconnect()
        observer.observe(box)
      }
    })
    inject(DestroyRef).onDestroy(() => observer.disconnect())
    afterRenderEffect(() => {
      this.log()
      const list = this.logList()?.nativeElement
      if (list) {
        list.scrollTop = list.scrollHeight
      }
    })
  }

  protected reset() {
    this.log.set([])
    this.run.update((run) => run + 1)
  }
}

export { ExampleFrame }
