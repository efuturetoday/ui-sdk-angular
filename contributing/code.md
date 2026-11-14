# Code standard

Upstream's code standard applies to everything here: `vendor/ui/contributing/code.md`. Read it first. The points below restate the ones that come up most, and add what's Angular's own.

## From upstream

- No semicolons, double quotes, lines up to 80 characters. Prettier formats every file (`npm run format`).
- Braces on every `if`, `else`, `for` and `while` body.
- No return type annotations. Inline types. Named exports, listed once at the end of each file.
- Comments are rare: at most three lines, full sentences ending in a period, only when a reader would get the code wrong without one.
- Every public export has JSDoc and a stability tag, `@stable` or `@experimental`. New ones start `@experimental`.
- The package entry names its exports one by one, never `export *`. A component's file re-exports every type core's entry for it exports, by name.
- Behavior lives in core. If a component needs an adapter change, it must help every primitive.

## Angular

- **Directives, not components.** Parts never render elements of their own. Structural parts are directives on `ng-template` through `*`.
- **Lint and format** are upstream's: `npm run lint` runs the rules ported from `vendor/ui/scripts` (`scripts/check-code.mjs`, `scripts/check-comments.mjs`) and ESLint with `angular-eslint` and `curly`. `npm run format` checks Prettier with upstream's config.
- **Standalone, signal-based:** `input()`, `output()`, `computed()`, `inject()`. No decorators for inputs, no `@HostBinding` or `@HostListener` for what core writes, no `NgModule`s.
- **Host bindings never mirror core.** Core writes a part's attributes and listeners. A directive's `host` is only for what Angular itself must own.
- **Field initializers, then `ngOnInit`.** Every directive calls `injectPrimitive` or `injectPart` in a field initializer and their `init()` in `ngOnInit`.
- **Inputs** take upstream's option and prop names. Booleans use `optionalBoolean`, never `booleanAttribute`, which turns `undefined` into `false`. A controlled value is `input()` plus `output()`, never `model()`. A structural part takes its props as one object input named after the directive.
- **Selectors** are `ui` plus the part in camel case, as attributes; `exportAs` matches.
- **Change detection.** Nothing in the package calls `ApplicationRef.tick()` or needs zone.js. The one `detectChanges()` renders a structural part's new view as it appears (`part.ts`).
- **One file per component** in `projects/ngx-ui-sdk/src/lib/`, like `dialog.ts`, with its root and parts. Shared pieces go in their own module, like `primitive.ts`.
