# ngx-ui-sdk

An Angular adapter for [ui-sdk](https://github.com/vercel-labs/ui): `@ui-sdk/core`'s primitives as Angular directives on your own elements. It isn't part of the ui-sdk repo; `vendor/ui` holds that repo, pinned to the core release we depend on, for its specs and fixtures.

## Read first

1. [contributing/design.md](contributing/design.md): how parts map to Angular and why.
2. [contributing/code.md](contributing/code.md): the code standard, upstream's plus Angular's.
3. [projects/playground/README.md](projects/playground/README.md): the fixtures upstream's specs run against.

## Layout

- `projects/core`: the package. `src/lib` holds the adapter's modules (`primitive.ts`, `binding.ts`, `commit.ts`, `presence.ts`, `part.ts`, `structural.ts`, `popup-layer.ts`, listed in the design's "How the adapter is built") and the contexts components share, exported from `@ngx-ui-sdk/core`. Each component is its own entry point, `<name>/src/<name>.ts`, imported from `@ngx-ui-sdk/core/<name>`, as `@ui-sdk/core/<name>`.
- `projects/playground`: the fixtures for upstream's specs.
- `projects/demo`: a page to try components by hand (`npm start`).
- `vendor/ui`: upstream, a git submodule. Never edit it.

## Adding a component

1. Read upstream's Vue component (`vendor/ui/packages/vue/src/<name>.ts`) and core's primitive for its parts, options and props.
2. Write `<name>/src/<name>.ts` following the design and the code standard, with `<name>/ng-package.json` and `<name>/src/public-api.ts` exporting it by name. It imports the adapter from `@ngx-ui-sdk/core` and other components from their entries; what entries share but apps don't is exported from `@ngx-ui-sdk/core` with a `ɵ` prefix.
3. Copy the Vue fixture to `projects/playground/src/fixtures/<name>.ts` and add it to `fixtures` in `projects/playground/src/main.ts`. Every spec that opens it runs from then on. A popup's component goes in `portalComponents` in `playwright.upstream.config.ts`.
4. Run `npm run test:upstream -- vendor/ui/tests/specs/<name>` until it passes, then `npm run lint` and `npm run format`. A failure that isn't a bug goes in `knownGaps` in the config, with its reason.

## Commands

- `npm run build:lib`: builds the package to `dist/core`.
- `npm run test:upstream`: upstream's specs against the playground (port 5320, or `PLAYGROUND_PORT`).
- `npm run lint`: upstream's code rules, comment length and ESLint.
- `npm run format`: checks Prettier; `npm run format:write` fixes it.

Commits are conventional, with a lowercase subject.
