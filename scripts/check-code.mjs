// Upstream's code rules that apply here, ported from
// vendor/ui/scripts/check-code.mjs. Prints `file:line rule message` per
// violation and exits 1 on any.
//
// - return-type: no return type annotation on a function with a body in the
//   package. Type predicates and assertion signatures are fine. A function
//   that needs one anyway takes `// check-code: allow return-type <why>` on
//   the line above, and every allowance is printed.
// - exports-at-end: a module declares everything without `export` and lists
//   its exports once, at its end. Covers every .ts, .mts and .mjs file but
//   .d.ts files and vendor.
// - public-docs: every export of the package's entry has a JSDoc comment.
// - stability: each of those exports has exactly one of `@stable` or
//   `@experimental` in its JSDoc.
// - entry-types: the entry names its exports one by one, never `export *`,
//   and each component's file re-exports every type core's entry for it
//   exports, by name, in an `export type { } from "@ui-sdk/core/<name>"`.
import { execFileSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import ts from "typescript"

const root = path.resolve(import.meta.dirname, "..")
const library = path.join(root, "projects/ui-sdk-angular/src")
const entry = path.join(library, "public-api.ts")
const allowReturnType = /\/\/\s*check-code:\s*allow return-type(.*)$/
const stabilityLabels = ["stable", "experimental"]
// Component files whose core entry has another name.
const coreEntryOf = {}

const violations = []
const allowances = []
const program = ts.createProgram([entry], {
  module: ts.ModuleKind.ESNext,
  target: ts.ScriptTarget.ES2022,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  experimentalDecorators: true,
  noEmit: true,
})
const checker = program.getTypeChecker()

checkReturnTypes()
checkExportsAtEnd()
const surface = publicDeclarations()
checkPublicDocs()
checkStability()
checkEntryTypes()

for (const allowance of allowances) {
  console.log(allowance)
}
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

function report(source, node, rule, message) {
  violations.push({
    file: path.relative(root, source.fileName),
    line: node
      ? source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1
      : 1,
    rule,
    message,
  })
}

function librarySources() {
  return program
    .getSourceFiles()
    .filter(
      (source) =>
        source.fileName.startsWith(library) &&
        !source.fileName.endsWith(".d.ts")
    )
}

function checkReturnTypes() {
  for (const source of librarySources()) {
    const lines = source.text.split("\n")
    visit(source)

    function visit(node) {
      if (
        ts.isFunctionLike(node) &&
        node.body &&
        node.type &&
        !ts.isTypePredicateNode(node.type)
      ) {
        const startLine = source.getLineAndCharacterOfPosition(
          node.getStart(source)
        ).line
        const allow = lines[startLine - 1]?.match(allowReturnType)
        const reason = allow?.[1].trim()
        if (reason) {
          allowances.push(
            `${path.relative(root, source.fileName)}:${startLine + 1} allowed return-type: ${reason}`
          )
        } else {
          report(
            source,
            node.type,
            "return-type",
            allow
              ? "the allow comment needs a reason."
              : "remove the return type annotation and let it infer."
          )
        }
      }
      ts.forEachChild(node, visit)
    }
  }
}

function checkExportsAtEnd() {
  const files = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { cwd: root, encoding: "utf8" }
  )
    .split("\0")
    .filter(
      (file) =>
        /\.(ts|mts|mjs)$/.test(file) &&
        !file.endsWith(".d.ts") &&
        !file.startsWith("vendor/")
    )
  for (const file of files) {
    const absolute = path.join(root, file)
    if (!existsSync(absolute)) {
      continue
    }
    const text = readFileSync(absolute, "utf8")
    if (!/^export\b/m.test(text)) {
      continue
    }
    const source = ts.createSourceFile(
      absolute,
      text,
      ts.ScriptTarget.Latest,
      true
    )
    const isList = (statement) =>
      ts.isExportDeclaration(statement) || ts.isExportAssignment(statement)
    let body = -1
    source.statements.forEach((statement, index) => {
      if (!isList(statement)) {
        body = index
      }
    })
    source.statements.forEach((statement, index) => {
      const exported = ts.canHaveModifiers(statement)
        ? ts
            .getModifiers(statement)
            ?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
        : false
      if (exported) {
        report(
          source,
          statement,
          "exports-at-end",
          "declare it without `export` and add it to the `export { }` list at the end of the file."
        )
      } else if (isList(statement) && index < body) {
        report(
          source,
          statement,
          "exports-at-end",
          "move it to the end of the file, with the other exports."
        )
      }
    })
  }
}

// Every export of the entry declared in the package, once, at its declaration.
function publicDeclarations() {
  const module = checker.getSymbolAtLocation(program.getSourceFile(entry))
  const seen = new Set()
  const declarations = []
  for (const exported of checker.getExportsOfModule(module)) {
    const declaration = resolve(exported).declarations?.[0]
    const source = declaration?.getSourceFile()
    if (!source?.fileName.startsWith(library) || seen.has(declaration)) {
      continue
    }
    seen.add(declaration)
    declarations.push({ name: exported.name, declaration, source })
  }
  return declarations
}

function resolve(symbol) {
  return symbol && symbol.flags & ts.SymbolFlags.Alias
    ? checker.getAliasedSymbol(symbol)
    : symbol
}

function checkPublicDocs() {
  for (const { name, declaration, source } of surface) {
    if (ts.getJSDocCommentsAndTags(declaration).length) {
      continue
    }
    report(
      source,
      declaration,
      "public-docs",
      `\`${name}\` is public, so give it a JSDoc comment that says what it's for.`
    )
  }
}

function checkStability() {
  for (const { name, declaration, source } of surface) {
    const count = ts
      .getJSDocTags(declaration)
      .filter((tag) => stabilityLabels.includes(tag.tagName.text)).length
    if (count === 1) {
      continue
    }
    report(
      source,
      declaration,
      "stability",
      count
        ? `\`${name}\` has ${count} stability labels, so keep one: \`@stable\` or \`@experimental\`.`
        : `\`${name}\` is public, so label it \`@stable\` or \`@experimental\` at the end of its JSDoc.`
    )
  }
}

function checkEntryTypes() {
  const entrySource = program.getSourceFile(entry)
  for (const statement of entrySource.statements) {
    if (ts.isExportDeclaration(statement) && !statement.exportClause) {
      report(
        entrySource,
        statement,
        "entry-types",
        `name what to re-export from \`${statement.moduleSpecifier.text}\` one by one.`
      )
    }
  }
  for (const source of librarySources()) {
    const name = path.basename(source.fileName, ".ts")
    const specifier = `@ui-sdk/core/${coreEntryOf[name] ?? name}`
    const resolved = ts.resolveModuleName(
      specifier,
      source.fileName,
      program.getCompilerOptions(),
      ts.sys
    ).resolvedModule
    const coreModule =
      resolved && program.getSourceFile(resolved.resolvedFileName)
    if (coreModule) {
      checkComponentTypes(source, specifier, coreModule)
    }
  }
}

function checkComponentTypes(source, specifier, coreModule) {
  const isType = (symbol) => !!symbol && !(symbol.flags & ts.SymbolFlags.Value)
  const expected = new Map()
  for (const exported of checker.getExportsOfModule(
    checker.getSymbolAtLocation(coreModule)
  )) {
    const symbol = resolve(exported)
    if (isType(symbol)) {
      expected.set(exported.name, symbol)
    }
  }
  const reexported = new Set()
  for (const statement of source.statements) {
    if (
      !ts.isExportDeclaration(statement) ||
      statement.moduleSpecifier?.text !== specifier ||
      !statement.exportClause ||
      !ts.isNamedExports(statement.exportClause)
    ) {
      continue
    }
    for (const element of statement.exportClause.elements) {
      reexported.add((element.propertyName ?? element.name).text)
    }
  }
  const missing = [...expected.keys()].filter((type) => !reexported.has(type))
  if (missing.length) {
    report(
      source,
      undefined,
      "entry-types",
      `re-export ${missing.map((type) => `\`${type}\``).join(", ")} from \`${specifier}\`, which exports ${missing.length === 1 ? "it" : "them"}.`
    )
  }
}
