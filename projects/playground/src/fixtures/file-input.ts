import { Component, type ElementRef, signal, viewChild } from "@angular/core"
import {
  describeChange,
  fileInputFixture as f,
  fileInputOptions,
  serializeFiles,
} from "tests/fixtures/file-input"
import {
  UiField,
  UiFieldDescription,
  UiFieldError,
  UiFieldLabel,
} from "ngx-ui-sdk/field"
import {
  UiFileInput,
  UiFileInputDropzone,
  UiFileInputItem,
  UiFileInputItemRemove,
  UiFileInputList,
  UiFileInputTrigger,
  type FileInputValueChangeDetails,
  type FileRejection,
} from "ngx-ui-sdk/file-input"

@Component({
  selector: "app-fixture",
  imports: [
    UiField,
    UiFieldDescription,
    UiFieldError,
    UiFieldLabel,
    UiFileInput,
    UiFileInputDropzone,
    UiFileInputItem,
    UiFileInputItemRemove,
    UiFileInputList,
    UiFileInputTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form class="form" [id]="f.formId" [attr.aria-label]="f.formLabel" (submit)="onSubmit($event)">
        <div uiField>
          <label uiFieldLabel>{{ f.field.label }}</label>
          <div
            uiFileInput
            class="file-input"
            [name]="options.name"
            [accept]="f.attachments.accept"
            [multiple]="options.multiple"
            [maxFiles]="options.maxFiles"
            [maxSize]="f.attachments.maxSize"
            [minSize]="f.attachments.minSize"
            [required]="options.required"
            [disabled]="options.disabled"
            [value]="options.controlled ? attachments() : undefined"
            (beforeValueChange)="attachmentsChange($event.value, $event.details)"
            (reject)="attachmentsReject($event.rejected, $event.details)"
          >
            <div
              uiFileInputDropzone
              #zone="uiFileInputDropzone"
              class="zone"
              role="group"
              [attr.aria-label]="f.zone.label"
              [pasteTarget]="pasteTarget"
            >
              <p>{{ zone.state().dragging ? f.zone.dragging : f.zone.text }}</p>
              <button uiFileInputTrigger>{{ f.trigger.label }}</button>
            </div>
            <div uiFileInputList #list="uiFileInputList" [attr.aria-label]="f.list.label" class="file-list">
              @for (file of list.state().value; track file) {
                <div uiFileInputItem [file]="file" class="file-item">
                  <span>{{ file.name }}</span>
                  <button uiFileInputItemRemove>×</button>
                </div>
              }
            </div>
          </div>
          <p uiFieldDescription>{{ f.field.description }}</p>
          <div *uiFieldError="let state; match: 'valueMissing'" class="field-error">{{ f.field.error }}</div>
        </div>
        <label>
          {{ f.note.label }}
          <textarea #note [name]="f.note.name"></textarea>
        </label>
        <div class="row">
          <button type="submit">Send</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <div
        uiFileInput
        [accept]="f.avatar.accept"
        [capture]="f.avatar.capture"
        (beforeValueChange)="avatarChange($event.value, $event.details)"
        (reject)="avatarReject($event.rejected, $event.details)"
      >
        <button uiFileInputTrigger>{{ f.avatar.label }}</button>
      </div>
      <div
        uiFileInput
        directory
        (beforeValueChange)="folderChange($event.value, $event.details)"
        (reject)="folderReject($event.rejected, $event.details)"
      >
        <button uiFileInputTrigger>{{ f.folder.label }}</button>
      </div>
      @if (options.page) {
        <div
          uiFileInput
          multiple
          (beforeValueChange)="pageChange($event.value, $event.details)"
          (reject)="pageReject($event.rejected, $event.details)"
        >
          <div uiFileInputDropzone class="page-zone" role="group" [attr.aria-label]="f.page.label" target="document">
            {{ f.page.text }}
          </div>
        </div>
      }
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Actions">{{ count() }}</output>
      <output role="status" aria-label="Submitted">{{ submitted() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly options = fileInputOptions()
  protected readonly action = signal("")
  protected readonly count = signal(0)
  protected readonly submitted = signal("")
  protected readonly attachments = signal<File[]>([])
  private readonly note = viewChild<ElementRef<HTMLTextAreaElement>>("note")
  protected readonly pasteTarget = () => this.note()?.nativeElement ?? null
  #changed = false

  // A change counts as an action, and shows its rejections too. Rejections
  // without a change only show. Both callbacks run in the same task.
  #onChange(kind: string) {
    return (value: File[], details: FileInputValueChangeDetails) => {
      if (this.options.cancel) {
        details.cancel()
      }
      this.#changed = true
      queueMicrotask(() => (this.#changed = false))
      this.action.set(describeChange(kind, details))
      this.count.update((count) => count + 1)
      const ignored =
        this.options.ignoreRemovals && details.reason === "remove-press"
      if (kind === "attachments" && !details.canceled && !ignored) {
        this.attachments.set(value)
      }
    }
  }

  #onReject(kind: string) {
    return (rejected: FileRejection[], details: { reason: string }) => {
      if (!this.#changed) {
        this.action.set(describeChange(kind, { ...details, rejected }))
      }
    }
  }

  protected readonly attachmentsChange = this.#onChange("attachments")
  protected readonly attachmentsReject = this.#onReject("attachments")
  protected readonly avatarChange = this.#onChange("avatar")
  protected readonly avatarReject = this.#onReject("avatar")
  protected readonly folderChange = this.#onChange("folder")
  protected readonly folderReject = this.#onReject("folder")
  protected readonly pageChange = this.#onChange("page")
  protected readonly pageReject = this.#onReject("page")

  protected onSubmit(event: Event) {
    event.preventDefault()
    this.submitted.set(serializeFiles(event.currentTarget as HTMLFormElement))
  }
}

export { Fixture }
