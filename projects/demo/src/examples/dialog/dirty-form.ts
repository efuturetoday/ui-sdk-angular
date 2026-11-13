import { Component, signal } from "@angular/core"
import {
  UiDialog,
  UiDialogBackdrop,
  UiDialogClose,
  UiDialogContent,
  UiDialogDescription,
  UiDialogTitle,
  UiDialogTrigger,
  UiField,
  UiFieldControl,
  UiFieldLabel,
} from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [
    UiDialog,
    UiDialogBackdrop,
    UiDialogClose,
    UiDialogContent,
    UiDialogDescription,
    UiDialogTitle,
    UiDialogTrigger,
    UiField,
    UiFieldControl,
    UiFieldLabel,
  ],
  template: `
    <ng-container
      uiDialog
      [open]="open()"
      [dismissible]="!dirty()"
      (openChange)="$event ? open.set(true) : close()"
      (dismissAttempt)="asking.set(true)"
    >
      <button uiDialogTrigger>Write a Post</button>
      <div *uiDialogBackdrop></div>
      <div *uiDialogContent>
        <div data-slot="stack">
          <h2 uiDialogTitle>New post</h2>
          <p uiDialogDescription>Share an update with your team.</p>
        </div>
        <div uiField>
          <label uiFieldLabel>Post</label>
          <textarea
            uiFieldControl
            placeholder="What's new?"
            (input)="onInput($event)"
          ></textarea>
        </div>
        @if (asking()) {
          <div data-slot="row" role="alert">
            Discard your changes?
            <div data-slot="row">
              <button type="button" (click)="keepEditing()">
                Keep Editing
              </button>
              <button data-variant="solid" type="button" (click)="close()">
                Discard
              </button>
            </div>
          </div>
        } @else {
          <div data-slot="row">
            <button uiDialogClose data-variant="solid" value="post">
              Post
            </button>
          </div>
        }
      </div>
    </ng-container>
  `,
})
class Example {
  protected readonly open = signal(false)
  protected readonly dirty = signal(false)
  protected readonly asking = signal(false)
  #post: HTMLTextAreaElement | undefined

  protected onInput(event: Event) {
    this.#post = event.target as HTMLTextAreaElement
    this.dirty.set(this.#post.value !== "")
  }

  protected close() {
    this.open.set(false)
    this.dirty.set(false)
    this.asking.set(false)
  }

  protected keepEditing() {
    this.asking.set(false)
    this.#post?.focus()
  }
}

export { Example }
