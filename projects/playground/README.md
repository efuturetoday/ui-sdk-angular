# Playground

The page ui-sdk's own Playwright specs run against: `/?fixture=<name>&framework=angular` mounts `src/fixtures/<name>.ts`, the same contract as the upstream playground (`vendor/ui/apps/playground`). `playwright.upstream.config.ts` runs the specs in `vendor/ui/tests/specs`, unchanged.

## Fixtures

Each fixture is a plain Angular copy of the upstream Vue fixture (`vendor/ui/apps/playground/src/fixtures/<name>/<Name>Fixture.vue`): the same elements, labels, classes and URL options, from `tests/fixtures/<name>.ts` and `tests/fixtures/page.ts`. No fixture works around Angular. Text whitespace is part of the contract, so Prettier skips this folder.

## Rendering after events

The specs press and then read the page in their next step, like a fixture's `<output>` or a trigger an `@if` removed. Vue renders a microtask after an event and React renders a press synchronously, so both are done by then. Zoneless Angular schedules change detection a macrotask later, as a `setTimeout` and `requestAnimationFrame` race (`ChangeDetectionSchedulerImpl` in `@angular/core`), and Playwright's next step can beat it. [angular.dev/guide/zoneless](https://angular.dev/guide/zoneless) lists what schedules a render, not when it runs.

Only what Angular templates render waits. The adapter writes a part's attributes, presence and focus through core while the event runs, so the specs about ARIA, focus and keyboard behavior see the real timing either way.

`src/render-like-the-specs.ts` ticks the app a microtask after every user event, the way Vue renders, in this one place. The playground runs zoneless, as Angular's default, and apps using the adapter need nothing like it.

## Core's development checks

Core's development warnings, like a field label that labels nothing, load through the `development` export condition. Angular's dev server prebundles dependencies without it, so the playground turns prebundling off (`"prebundle": false` in `angular.json`), and core builds with the app, as the upstream playground's Vite does.
