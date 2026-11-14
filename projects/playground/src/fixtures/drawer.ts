import { afterNextRender, Component, signal } from "@angular/core"
import {
  drawerFixture,
  drawerOptions,
  drawerParts,
  exposeDrawerFixture,
  recordDrawer,
} from "tests/fixtures/drawer"
import {
  createDrawerController,
  UiDrawer,
  UiDrawerBackdrop,
  UiDrawerClose,
  UiDrawerContent,
  UiDrawerDescription,
  UiDrawerHandle,
  UiDrawerOutlet,
  UiDrawerShortcut,
  UiDrawerTitle,
  UiDrawerTrigger,
  type DrawerOpenChangeDetails,
  type DrawerSnapPointChangeReason,
  type SnapPoint,
} from "ngx-ui-sdk/drawer"
import type { ChangeDetails } from "@ui-sdk/core"

@Component({
  selector: "app-fixture",
  imports: [
    UiDrawer,
    UiDrawerBackdrop,
    UiDrawerClose,
    UiDrawerContent,
    UiDrawerDescription,
    UiDrawerHandle,
    UiDrawerOutlet,
    UiDrawerShortcut,
    UiDrawerTitle,
    UiDrawerTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container
        uiDrawer
        [controller]="controller"
        [defaultOpen]="options.defaultOpen"
        [snapPoints]="options.snapPoints"
        [defaultSnapPoint]="options.defaultSnapPoint"
        [side]="options.side"
        [modalAbove]="options.modalAbove"
        [dismissible]="options.dismissible"
        [expandOnScroll]="options.expandOnScroll"
        [driver]="options.driver"
        [modal]="options.modal"
        [container]="options.container"
        [themeColor]="options.themeColor"
        (beforeOpenChange)="recordOpen('drawer', $event)"
        (beforeSnapPointChange)="recordSnap($event)"
        (dismissAttempt)="record('attempt:' + $event.reason)"
      >
        <button uiDrawerTrigger>{{ drawerFixture.trigger }}</button>
        @if (parts.backdrop) {
          <div *uiDrawerBackdrop class="drawer-backdrop"></div>
        }
        <div *uiDrawerContent class="drawer">
          <button uiDrawerHandle class="handle" [attr.aria-label]="drawerFixture.handle"></button>
          <h2 uiDrawerTitle class="title">{{ drawerFixture.title }}</h2>
          <p uiDrawerDescription class="description">{{ drawerFixture.description }}</p>
          @if (parts.field) {
            <label class="field">
              {{ drawerFixture.field }}
              <input />
            </label>
          }
          @if (parts.scroll) {
            <ul class="scroll" [attr.aria-label]="drawerFixture.scroll.label" tabindex="0">
              @for (item of drawerFixture.scroll.items; track item) {
                <li>{{ item }}</li>
              }
            </ul>
          }
          @if (parts.grow) {
            <button (click)="more.set(true)">{{ drawerFixture.grow.button }}</button>
            @if (more()) {
              <p class="more">{{ drawerFixture.grow.text }}</p>
            }
          }
          <div class="actions">
            <button (click)="action.set('submit')">{{ drawerFixture.action }}</button>
            <button uiDrawerClose>{{ drawerFixture.close }}</button>
          </div>
          @if (parts.nested) {
            <ng-container uiDrawer (beforeOpenChange)="recordOpen('nested', $event)">
              <button uiDrawerTrigger>{{ drawerFixture.nested.trigger }}</button>
              @if (parts.backdrop) {
                <div *uiDrawerBackdrop class="drawer-backdrop"></div>
              }
              <div *uiDrawerContent class="drawer">
                <h2 uiDrawerTitle class="title">{{ drawerFixture.nested.title }}</h2>
                <button uiDrawerClose>{{ drawerFixture.nested.close }}</button>
              </div>
            </ng-container>
          }
        </div>
      </ng-container>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <button (click)="controller.open()">{{ drawerFixture.controller }}</button>
      <button (click)="action.set('page')">{{ drawerFixture.page }}</button>
      @if (parts.shortcut) {
        <button uiDrawerTrigger [controller]="controller" [shortcut]="drawerFixture.shortcut.keys">
          {{ drawerFixture.shortcut.trigger }}
          <span uiDrawerShortcut></span>
        </button>
      }
      @if (parts.outlet) {
        <div
          uiDrawerOutlet
          [controller]="controller"
          class="outlet"
          role="region"
          [attr.aria-label]="drawerFixture.outlet.label"
          [keyframes]="drawerFixture.outlet.keyframes"
        ></div>
      }
    </div>
  `,
})
class Fixture {
  protected readonly drawerFixture = drawerFixture
  protected readonly options = drawerOptions() as {
    defaultOpen?: boolean
    snapPoints?: SnapPoint[]
    defaultSnapPoint?: SnapPoint
    side?: "bottom" | "top" | "left" | "right" | "start" | "end"
    modalAbove?: SnapPoint
    dismissible?: boolean
    expandOnScroll?: boolean
    driver?: "pointer" | "scroll-snap"
    modal?: boolean | "trap-focus"
    container?: HTMLElement | null
    themeColor?: boolean
  }
  protected readonly parts = drawerParts()
  protected readonly controller = createDrawerController()
  protected readonly action = signal("")
  protected readonly more = signal(false)

  constructor() {
    // The specs' hooks live on the window, which the server doesn't have.
    afterNextRender(() => exposeDrawerFixture(this.controller))
  }

  protected record(entry: string) {
    recordDrawer(entry)
  }

  protected recordOpen(
    name: string,
    { open, details }: { open: boolean; details: DrawerOpenChangeDetails }
  ) {
    recordDrawer(`${name}:${open}:${details.reason}`)
  }

  protected recordSnap({
    snapPoint,
    details,
  }: {
    snapPoint: SnapPoint
    details: ChangeDetails<DrawerSnapPointChangeReason>
  }) {
    recordDrawer(`${snapPoint}:${details.reason}`)
  }
}

export { Fixture }
