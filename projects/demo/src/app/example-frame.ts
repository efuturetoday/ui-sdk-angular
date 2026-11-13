import { NgComponentOutlet } from "@angular/common"
import {
  afterRenderEffect,
  Component,
  computed,
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
import { examples } from "../examples"
import { ExampleLog } from "../shared/log"

@Component({
  selector: "app-example-frame",
  imports: [NgComponentOutlet, LucideRotateCcw],
  templateUrl: "./example-frame.html",
  styleUrl: "./example-frame.css",
})
class ExampleFrame {
  /** The example, like "dialog/basic". */
  readonly name = input.required<string>()
  protected readonly caption = computed(() => examples[this.name()]?.caption)
  protected readonly tab = signal<"preview" | "code">("preview")
  protected readonly run = signal(0)
  protected readonly log = signal<string[]>([])
  protected readonly component = resource({
    params: () => this.name(),
    loader: ({ params }) => examples[params]!.load(),
  })
  // The example's own file, read at build time, so the HTML is trusted.
  protected readonly source = resource({
    params: () => (this.tab() === "code" ? this.name() : undefined),
    loader: async ({ params }) => {
      const [source, { highlight }] = await Promise.all([
        examples[params]!.source(),
        import("../shared/highlight"),
      ])
      return this.#sanitizer.bypassSecurityTrustHtml(await highlight(source))
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
