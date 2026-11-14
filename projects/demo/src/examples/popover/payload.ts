import { Component, computed, signal } from "@angular/core"
import { UiField, UiFieldControl, UiFieldLabel } from "ngx-ui-sdk/field"
import {
  createPopoverController,
  UiPopover,
  UiPopoverContent,
  UiPopoverDescription,
  UiPopoverTitle,
  UiPopoverTrigger,
} from "ngx-ui-sdk/popover"
import { injectLog } from "../../shared/log"

type Member = { name: string; role: string }

@Component({
  selector: "app-example",
  imports: [
    UiField,
    UiFieldControl,
    UiFieldLabel,
    UiPopover,
    UiPopoverContent,
    UiPopoverDescription,
    UiPopoverTitle,
    UiPopoverTrigger,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="editNewest($event)">
          Edit Newest Member
        </button>
      </div>
      <ul data-slot="list">
        @for (member of members(); track member.name) {
          <li data-slot="row">
            {{ member.name }}
            <span data-slot="hint">{{ member.role }}</span>
            <button
              uiPopoverTrigger
              [controller]="popover"
              [payload]="member"
              [disabled]="member.role === 'Owner'"
              data-size="sm"
              data-variant="ghost"
              [attr.aria-label]="'Edit ' + member.name"
            >
              Edit
            </button>
          </li>
        }
      </ul>
      <ng-container
        uiPopover
        [controller]="popover"
        (payloadChange)="onPayloadChange($event.payload)"
      >
        <div *uiPopoverContent="let state; align: 'end'; sideOffset: 8">
          <h2 uiPopoverTitle>{{ memberOf(state().payload)?.name }}</h2>
          <p uiPopoverDescription>Roles decide what they can change.</p>
          <form
            data-slot="stack"
            method="dialog"
            (submit)="save($event, memberOf(state().payload))"
          >
            @for (member of [memberOf(state().payload)]; track member?.name) {
              <div uiField>
                <label uiFieldLabel>Role</label>
                <select uiFieldControl name="role">
                  @for (role of roles; track role) {
                    <option [selected]="role === member?.role">
                      {{ role }}
                    </option>
                  }
                </select>
              </div>
            }
            <div data-slot="row">
              <button type="submit" value="cancel" formnovalidate>
                Cancel
              </button>
              <button type="submit" value="save" data-variant="solid">
                Save
              </button>
            </div>
          </form>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly roles = ["Admin", "Editor", "Viewer"]
  protected readonly log = injectLog()
  protected readonly popover = createPopoverController<Member>()
  protected readonly members = signal<Member[]>([
    { name: "Hollis Grant", role: "Owner" },
    { name: "Inès Moreau", role: "Editor" },
    { name: "Kofi Mensah", role: "Viewer" },
    { name: "Wren Takahashi", role: "Viewer" },
  ])
  protected readonly newest = computed(() => this.members().at(-1)!)

  protected memberOf(payload: unknown) {
    return payload as Member | undefined
  }

  protected async editNewest(event: MouseEvent) {
    const result = await this.popover.open({
      payload: this.newest(),
      anchor: event.currentTarget as HTMLElement,
    })
    this.log(
      `Closed (${result.reason}), returned ${result.returnValue ?? "nothing"}`
    )
  }

  protected onPayloadChange(payload: unknown) {
    const member = this.memberOf(payload)
    if (member) {
      this.log(`Editing ${member.name}`)
    }
  }

  protected save(event: Event, member: Member | undefined) {
    const submitter = (event as SubmitEvent).submitter as HTMLButtonElement
    if (submitter.value !== "save" || !member) {
      return
    }
    const role = String(
      new FormData(event.currentTarget as HTMLFormElement).get("role")
    )
    this.members.update((members) =>
      members.map((entry) =>
        entry.name === member.name ? { ...entry, role } : entry
      )
    )
  }
}

export { Example }
