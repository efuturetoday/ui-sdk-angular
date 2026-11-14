import {
  Component,
  Directive,
  effect,
  inject,
  input,
  signal,
  TemplateRef,
  ViewContainerRef,
  type OnInit,
} from "@angular/core"
import { TestBed } from "@angular/core/testing"

// The adapter starts parts in their first effect run, so they need no
// ngOnInit. That holds while Angular runs it with the inputs set, a root's
// before its parts', wherever the directive sits.
const log: string[] = []

function firstRun(name: () => string, label: string) {
  let done = false
  effect(() => {
    if (done) {
      return
    }
    done = true
    try {
      log.push(`${label}:effect:${name()}`)
    } catch (error) {
      log.push(`${label}:effect:throws ${(error as Error).message}`)
    }
  })
}

@Directive({ selector: "[uiProbeRoot]" })
class ProbeRoot implements OnInit {
  readonly name = input.required<string>({ alias: "uiProbeRoot" })
  constructor() {
    firstRun(() => this.name(), "root")
  }
  ngOnInit() {
    log.push(`root:onInit:${this.name()}`)
  }
}

@Directive({ selector: "[uiProbePart]" })
class ProbePart implements OnInit {
  readonly name = input.required<string>({ alias: "uiProbePart" })
  readonly root = inject(ProbeRoot, { optional: true })
  constructor() {
    firstRun(() => this.name(), "part")
  }
  ngOnInit() {
    log.push(`part:onInit:${this.name()}`)
  }
}

// A structural directive that renders its template at once, like a popup's
// content does when it opens.
@Directive({ selector: "[uiProbeShow]" })
class ProbeShow {
  constructor() {
    inject(ViewContainerRef).createEmbeddedView(inject(TemplateRef))
  }
}

@Component({
  selector: "probe-wrapped",
  hostDirectives: [{ directive: ProbePart, inputs: ["uiProbePart: label"] }],
  template: "",
})
class Wrapped {}

@Component({
  imports: [ProbeRoot, ProbePart, ProbeShow, Wrapped],
  template: `
    <div [uiProbeRoot]="'r1'">
      <span [uiProbePart]="'p1'"></span>
      @for (item of items(); track item) {
        <span [uiProbePart]="item"></span>
      }
      <probe-wrapped label="hosted" />
      <div *uiProbeShow><span [uiProbePart]="'structural'"></span></div>
    </div>
  `,
})
class Host {
  readonly items = signal(["loop1"])
}

describe("a directive's first effect run", () => {
  beforeEach(async () => {
    log.length = 0
    await TestBed.createComponent(Host).whenStable()
  })

  it("sees its inputs: on an element, as a host directive, in @for and in a structural directive", () => {
    expect(log.filter((line) => line.includes(":effect:"))).toEqual([
      "root:effect:r1",
      "part:effect:p1",
      "part:effect:hosted",
      "part:effect:loop1",
      "part:effect:structural",
    ])
  })

  it("comes after the directive's ngOnInit", () => {
    for (const name of ["r1", "p1", "hosted", "loop1", "structural"]) {
      const onInit = log.findIndex((line) => line.endsWith(`:onInit:${name}`))
      const firstEffect = log.findIndex((line) =>
        line.endsWith(`:effect:${name}`)
      )
      expect(onInit).toBeLessThan(firstEffect)
    }
  })
})
