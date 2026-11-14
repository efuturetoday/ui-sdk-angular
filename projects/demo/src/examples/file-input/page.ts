import { Component } from "@angular/core"
import { LucideFile, LucideUpload, LucideX } from "@lucide/angular"
import {
  formatFileSize,
  UiFileInput,
  UiFileInputDropzone,
  UiFileInputItem,
  UiFileInputItemRemove,
  UiFileInputList,
  UiFileInputTrigger,
} from "@ngx-ui-sdk/core/file-input"

@Component({
  selector: "app-example",
  imports: [
    LucideFile,
    LucideUpload,
    LucideX,
    UiFileInput,
    UiFileInputDropzone,
    UiFileInputItem,
    UiFileInputItemRemove,
    UiFileInputList,
    UiFileInputTrigger,
  ],
  template: `
    <div uiFileInput multiple>
      <div data-slot="row">
        <p data-slot="hint">Drop files anywhere.</p>
        <button uiFileInputTrigger>Upload Files</button>
      </div>
      <div uiFileInputDropzone target="document" data-variant="overlay">
        <div data-slot="stack">
          <svg lucideUpload aria-hidden="true"></svg>
          <p>Drop to attach</p>
        </div>
      </div>
      <div uiFileInputList #list="uiFileInputList" aria-label="Attachments">
        @for (file of list.state().value; track file) {
          <div uiFileInputItem [file]="file">
            <svg lucideFile aria-hidden="true"></svg>
            <span>{{ file.name }}</span>
            <span data-slot="hint">{{ formatFileSize(file.size) }}</span>
            <button uiFileInputItemRemove>
              <svg lucideX aria-hidden="true"></svg>
            </button>
          </div>
        }
      </div>
    </div>
  `,
})
class Example {
  protected readonly formatFileSize = formatFileSize
}

export { Example }
