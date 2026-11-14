import {
  afterNextRender,
  Component,
  type EmbeddedViewRef,
  type TemplateRef,
  viewChild,
  ViewContainerRef,
} from "@angular/core"
import { presentationOption } from "tests/fixtures/presentation"
import {
  UiAlertDialog,
  UiAlertDialogBackdrop,
  UiAlertDialogClose,
  UiAlertDialogContent,
  UiAlertDialogTitle,
  UiAlertDialogTrigger,
} from "@ngx-ui-sdk/core/alert-dialog"
import {
  UiDialog,
  UiDialogBackdrop,
  UiDialogClose,
  UiDialogContent,
  UiDialogTitle,
  UiDialogTrigger,
} from "@ngx-ui-sdk/core/dialog"
import {
  UiDrawer,
  UiDrawerBackdrop,
  UiDrawerClose,
  UiDrawerContent,
  UiDrawerTitle,
  UiDrawerTrigger,
} from "@ngx-ui-sdk/core/drawer"
import {
  UiPopover,
  UiPopoverClose,
  UiPopoverContent,
  UiPopoverTitle,
  UiPopoverTrigger,
} from "@ngx-ui-sdk/core/popover"

// Two pages in one outlet: the profile page is detached while the other
// shows, as a RouteReuseStrategy keeps a route. Like upstream's, it takes
// ?popup=dialog|alert-dialog|drawer|popover, ?container=id and ?presentation.
@Component({
  selector: "app-fixture",
  imports: [
    UiAlertDialog,
    UiAlertDialogBackdrop,
    UiAlertDialogClose,
    UiAlertDialogContent,
    UiAlertDialogTitle,
    UiAlertDialogTrigger,
    UiDialog,
    UiDialogBackdrop,
    UiDialogClose,
    UiDialogContent,
    UiDialogTitle,
    UiDialogTrigger,
    UiDrawer,
    UiDrawerBackdrop,
    UiDrawerClose,
    UiDrawerContent,
    UiDrawerTitle,
    UiDrawerTrigger,
    UiPopover,
    UiPopoverClose,
    UiPopoverContent,
    UiPopoverTitle,
    UiPopoverTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container #outlet></ng-container>
    </div>

    <ng-template #profile>
      @switch (popup) {
        @case ("dialog") {
          <ng-container uiDialog [container]="container" [presentation]="presentation.presentation">
            <button uiDialogTrigger>Edit profile</button>
            <div *uiDialogBackdrop class="dialog-backdrop"></div>
            <div *uiDialogContent class="dialog">
              <h2 uiDialogTitle class="title">Edit profile</h2>
              <label class="field">
                Name
                <input />
              </label>
              <div class="actions">
                <button (click)="leave()">Leave page</button>
                <button uiDialogClose>Close</button>
              </div>
            </div>
          </ng-container>
        }
        @case ("alert-dialog") {
          <ng-container uiAlertDialog [container]="container">
            <button uiAlertDialogTrigger>Edit profile</button>
            <div *uiAlertDialogBackdrop class="dialog-backdrop"></div>
            <div *uiAlertDialogContent class="dialog">
              <h2 uiAlertDialogTitle class="title">Edit profile</h2>
              <label class="field">
                Name
                <input />
              </label>
              <div class="actions">
                <button (click)="leave()">Leave page</button>
                <button uiAlertDialogClose>Close</button>
              </div>
            </div>
          </ng-container>
        }
        @case ("drawer") {
          <ng-container uiDrawer [container]="container">
            <button uiDrawerTrigger>Edit profile</button>
            <div *uiDrawerBackdrop class="dialog-backdrop"></div>
            <div *uiDrawerContent class="drawer">
              <h2 uiDrawerTitle class="title">Edit profile</h2>
              <label class="field">
                Name
                <input />
              </label>
              <div class="actions">
                <button (click)="leave()">Leave page</button>
                <button uiDrawerClose>Close</button>
              </div>
            </div>
          </ng-container>
        }
        @case ("popover") {
          <ng-container
            uiPopover
            [modal]="true"
            [container]="container"
            [presentation]="popoverPresentation"
          >
            <button uiPopoverTrigger>Edit profile</button>
            <div *uiPopoverContent class="popup">
              <h2 uiPopoverTitle class="title">Edit profile</h2>
              <label class="field">
                Name
                <input />
              </label>
              <div class="actions">
                <button (click)="leave()">Leave page</button>
                <button uiPopoverClose>Close</button>
              </div>
            </div>
          </ng-container>
        }
      }
    </ng-template>


    <ng-template #other>
      <button (click)="back()">Back to profile</button>
    </ng-template>
  `,
})
class Fixture {
  protected readonly popup = new URLSearchParams(location.search).get("popup") ?? "dialog"
  protected readonly container = (() => {
    const id = new URLSearchParams(location.search).get("container")
    return id ? document.getElementById(id) : undefined
  })()
  protected readonly presentation = presentationOption() as {
    presentation?: "auto" | "sheet"
  }
  protected readonly popoverPresentation = this.presentation.presentation
  private readonly outlet = viewChild.required("outlet", { read: ViewContainerRef })
  private readonly profile = viewChild.required<TemplateRef<unknown>>("profile")
  private readonly other = viewChild.required<TemplateRef<unknown>>("other")
  private cached: EmbeddedViewRef<unknown> | undefined

  constructor() {
    afterNextRender(() => this.outlet().createEmbeddedView(this.profile()))
  }

  protected leave() {
    this.cached = this.outlet().detach() as EmbeddedViewRef<unknown>
    this.outlet().createEmbeddedView(this.other())
  }

  protected back() {
    this.outlet().clear()
    this.outlet().insert(this.cached!)
  }
}

export { Fixture }
