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
} from "ui-sdk-angular"

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
      <div uiFileInputDropzone>
        <svg lucideUpload aria-hidden="true"></svg>
        <p>Drag and drop files here</p>
        <p data-slot="hint">Or paste them from your clipboard.</p>
        <button uiFileInputTrigger>Browse Files</button>
      </div>
      <div uiFileInputList #list="uiFileInputList" aria-label="Files">
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
