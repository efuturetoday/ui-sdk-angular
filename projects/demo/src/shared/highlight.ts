import { codeToHtml } from "shiki"

// An example's source as HTML, in both themes, for the Code tab.
function highlight(code: string) {
  return codeToHtml(code, {
    lang: "angular-ts",
    themes: { light: "github-light", dark: "github-dark" },
  })
}

export { highlight }
