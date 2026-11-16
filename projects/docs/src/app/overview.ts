import { ChangeDetectionStrategy, Component, input } from "@angular/core"
import {
  type LucideIcon,
  LucideAppWindow,
  LucideBell,
  LucideCalendar,
  LucideCalendarDays,
  LucideCalendarSearch,
  LucideChevronsDownUp,
  LucideChevronsUpDown,
  LucideCircleDot,
  LucideCircleExclamationPoint,
  LucideCircleUserRound,
  LucideColumns3,
  LucideCommand,
  LucideCompass,
  LucideComponent,
  LucideCrop,
  LucideDynamicIcon,
  LucideEllipsis,
  LucideGalleryHorizontal,
  LucideGauge,
  LucideGitCommitVertical,
  LucideGripVertical,
  LucideHash,
  LucideIdCard,
  LucideKeyRound,
  LucideList,
  LucideListCollapse,
  LucideListTree,
  LucideLoader,
  LucideLock,
  LucideMenu,
  LucideMessageSquare,
  LucideMessageSquareText,
  LucideMousePointerClick,
  LucidePanelLeft,
  LucidePanelsTopLeft,
  LucidePanelTop,
  LucidePipette,
  LucideRectangleEllipsis,
  LucideRows3,
  LucideScrollText,
  LucideSeparatorHorizontal,
  LucideSettings,
  LucideSlidersHorizontal,
  LucideSquareCheck,
  LucideSquareChevronDown,
  LucideSquareMenu,
  LucideStar,
  LucideTag,
  LucideTags,
  LucideTextCursorInput,
  LucideTextAlignStart,
  LucideToggleLeft,
  LucideToggleRight,
  LucideUpload,
  LucideWrench,
} from "@lucide/angular"

// What each component's tile shows, as a picture of what it is.
const icons: Record<string, LucideIcon> = {
  accordion: LucideListCollapse,
  "alert-dialog": LucideCircleExclamationPoint,
  autocomplete: LucideTextCursorInput,
  avatar: LucideCircleUserRound,
  button: LucideMousePointerClick,
  calendar: LucideCalendar,
  carousel: LucideGalleryHorizontal,
  checkbox: LucideSquareCheck,
  collapsible: LucideChevronsDownUp,
  "color-picker": LucidePipette,
  combobox: LucideChevronsUpDown,
  command: LucideCommand,
  "date-input": LucideCalendarDays,
  "date-picker": LucideCalendarSearch,
  dialog: LucideAppWindow,
  drawer: LucidePanelLeft,
  field: LucideRectangleEllipsis,
  "file-input": LucideUpload,
  "hover-card": LucideIdCard,
  "image-cropper": LucideCrop,
  input: LucideTextCursorInput,
  label: LucideTag,
  listbox: LucideList,
  menu: LucideMenu,
  menubar: LucidePanelTop,
  meter: LucideGauge,
  "navigation-menu": LucideCompass,
  "number-input": LucideHash,
  "otp-input": LucideKeyRound,
  pagination: LucideEllipsis,
  "password-input": LucideLock,
  popover: LucideMessageSquare,
  preferences: LucideSettings,
  progress: LucideLoader,
  radio: LucideCircleDot,
  rating: LucideStar,
  resizable: LucideGripVertical,
  "scroll-area": LucideScrollText,
  "segmented-control": LucideColumns3,
  select: LucideSquareChevronDown,
  separator: LucideSeparatorHorizontal,
  slider: LucideSlidersHorizontal,
  switch: LucideToggleRight,
  tabs: LucidePanelsTopLeft,
  textarea: LucideTextAlignStart,
  timeline: LucideGitCommitVertical,
  toast: LucideBell,
  toggle: LucideToggleLeft,
  "token-input": LucideTags,
  toolbar: LucideWrench,
  tooltip: LucideMessageSquareText,
  tree: LucideListTree,
  "trigger-menu": LucideSquareMenu,
  waterfall: LucideRows3,
}

// Every component as a tile, with its icon and how many examples it has.
@Component({
  selector: "app-overview",
  imports: [LucideDynamicIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
      gap: 12px;
    }

    a {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      border: 1px solid var(--frame-line);
      border-radius: var(--ui-radius-surface);
      color: var(--frame-ink);
      text-decoration: none;
      transition: border-color var(--ui-duration);
    }

    a:hover {
      border-color: var(--frame-muted);
    }

    svg {
      width: 20px;
      height: 20px;
      color: var(--frame-muted);
    }

    .name {
      font-size: 14px;
      font-weight: 500;
    }

    .count {
      margin-block-start: -8px;
      color: var(--frame-muted);
      font-size: 13px;
    }
  `,
  template: `
    @for (component of components(); track component.name) {
      <a [href]="'?component=' + component.name">
        <svg [lucideIcon]="iconOf(component.name)" aria-hidden="true"></svg>
        <span class="name">{{ component.title }}</span>
        <span class="count">
          {{ component.examples }}
          {{ component.examples === 1 ? "example" : "examples" }}
        </span>
      </a>
    }
  `,
})
class Overview {
  readonly components =
    input.required<{ name: string; title: string; examples: number }[]>()

  protected iconOf(name: string) {
    return icons[name] ?? LucideComponent
  }
}

export { Overview }
