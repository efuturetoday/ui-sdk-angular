import { codeToHtml } from "shiki"

// Code as HTML, in both themes, for the Code tab and the guides.
function highlight(code: string, lang = "angular-ts") {
  return codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
  })
}

export { highlight }
