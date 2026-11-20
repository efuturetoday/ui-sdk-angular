# Themes

- `projects/themes/styles/<source>.css`: what every theme draws, one file per component and `base.css`, nested as upstream writes it: the parts of `@ui-sdk/core`, plain elements, and the `data-slot`s the docs' examples write, like `stack` or `hint`, so a copied example looks as it does in the docs.
- `projects/themes/<name>/tokens/*.json`: a theme's tokens. `overrides/<source>.css` is a shape its tokens can't give, like Material's round buttons.
- `projects/docs/src/demo/<source>.css`: what only one example of the docs draws, and the demo's fixed widths.

`node scripts/build-theme.mjs` writes each theme's `src/` from these, with the nesting written out, and the docs' stylesheet for each theme. Don't edit `src/`.

## What `npm run lint` checks

- A theme styles no slot that's neither a part nor written by an example.
- Every `--ui-*` variable the styles read is one of each theme's tokens.
- Upstream's example styles and core's parts are the ones recorded in `projects/themes/upstream.lock.json`.

## After an upstream update

When the lock fails, it names the upstream stylesheets that changed and the parts that are new.

1. Read the change: `git -C vendor/ui diff <old tag> <new tag> -- examples/<file>`.
2. Port it to `projects/themes/styles`, or to `projects/docs/src/demo` if only one example draws it, with the theme's variables.
3. Style a new part if it needs it.
4. `node scripts/build-theme.mjs --lock`, then `node scripts/build-theme.mjs`.
