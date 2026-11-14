import { Component, signal } from "@angular/core"
import { numberInputScrubFixture as f } from "tests/fixtures/number-input-scrub"
import {
  createNumberInputController,
  UiNumberInput,
  UiNumberInputControl,
  UiNumberInputGroup,
  UiNumberInputScrubArea,
} from "ngx-ui-sdk"

@Component({
  selector: "app-fixture",
  imports: [
    UiNumberInput,
    UiNumberInputControl,
    UiNumberInputGroup,
    UiNumberInputScrubArea,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div role="toolbar" [attr.aria-label]="f.toolbarLabel" class="row">
        <span uiNumberInputScrubArea [controller]="controller" class="number-input-scrub">
          {{ f.toolbarScrub }}
        </span>
      </div>
      <table>
        <thead>
          <tr>
            <th uiNumberInputScrubArea [controller]="controller" class="number-input-scrub">
              {{ f.headerScrub }}
            </th>
          </tr>
        </thead>
      </table>
      <div
        uiNumberInput
        [id]="f.id"
        [controller]="controller"
        [defaultValue]="f.defaultValue"
        [min]="f.min"
        [max]="f.max"
        locale="en-US"
        (valueChange)="action.set(String($event))"
        (valueCommit)="commits.update((all) => [...all, String($event.value)])"
      >
        <div uiNumberInputGroup class="number-input-group">
          <span uiNumberInputScrubArea class="number-input-scrub">{{ f.letterScrub }}</span>
          <input uiNumberInputControl [attr.aria-label]="f.label" class="number-input-control" />
        </div>
        <div>
          <div>
            <div>
              <span uiNumberInputScrubArea class="number-input-scrub">{{ f.nestedScrub }}</span>
            </div>
          </div>
        </div>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Committed">{{ commits().join(" ") }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly String = String
  protected readonly controller = createNumberInputController()
  protected readonly action = signal("")
  protected readonly commits = signal<string[]>([])
}

export { Fixture }
