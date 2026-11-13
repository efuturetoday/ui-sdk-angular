// comment-length, ported from vendor/ui/scripts/check-comments.mjs: a comment
// runs three lines at most. Upstream checks the lines a branch changed; this
// repo is young enough to check every file. Prints `file:line rule message`.
import { execFileSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

const maxLines = 3
const sourceFile = /\.(ts|mts|js|mjs)$/
const toolDirective =
  /^(\/\/\/|\/\/\s*(eslint|@ts-|check-code:|prettier-ignore))|@__PURE__/

// Files comment-length leaves alone, each with why.
const commentLengthSkips = {
  "scripts/check-code.mjs": "Its header documents every rule it checks.",
}

const root = path.resolve(import.meta.dirname, "..")
const violations = []

checkCommentLength()

if (violations.length) {
  console.error(
    violations
      .map(
        ({ file, line, rule, message }) => `${file}:${line} ${rule} ${message}`
      )
      .join("\n")
  )
  process.exitCode = 1
}

function checkCommentLength() {
  for (const file of sourceFiles()) {
    if (file in commentLengthSkips) {
      continue
    }
    for (const comment of commentsOf(file)) {
      const lineCount = comment.end - comment.start + 1
      if (lineCount <= maxLines) {
        continue
      }
      violations.push({
        file,
        line: comment.start,
        rule: "comment-length",
        message: `this comment runs ${lineCount} lines. Say why in ${maxLines} at most, or move the explanation to contributing/ or a README.`,
      })
    }
  }
}

function sourceFiles() {
  return execFileSync(
    "git",
    ["ls-files", "-z", "--cached", "--others", "--exclude-standard"],
    { cwd: root, encoding: "utf8" }
  )
    .split("\0")
    .filter(
      (file) =>
        sourceFile.test(file) &&
        !file.startsWith("vendor/") &&
        existsSync(path.join(root, file))
    )
}

// Each comment's first and last line, 1-based. Runs of `//` lines count as one
// comment. JSDoc is left to check-code's public-docs.
function commentsOf(file) {
  const lines = readFileSync(path.join(root, file), "utf8").split("\n")
  const comments = []
  let open
  lines.forEach((text, index) => {
    const line = text.trim()
    if (open && !open.closer && isLineComment(line)) {
      return
    }
    if (open && !open.closer) {
      comments.push(close(index - 1))
    }
    if (open?.closer) {
      if (line.includes(open.closer)) {
        comments.push(close(index))
      }
      return
    }
    open = commentStartOf(line, index)
    if (open?.closer && line.includes(open.closer, 2)) {
      comments.push(close(index))
    }
  })
  if (open) {
    comments.push(close(lines.length - 1))
  }
  return comments

  function close(index) {
    const comment = { start: open.start + 1, end: index + 1 }
    open = undefined
    return comment
  }
}

function isLineComment(line) {
  return line.startsWith("//") && !toolDirective.test(line)
}

function commentStartOf(line, index) {
  if (isLineComment(line)) {
    return { start: index }
  }
  if (toolDirective.test(line)) {
    return
  }
  if (/^\/\*(?!\*)/.test(line)) {
    return { start: index, closer: "*/" }
  }
}
