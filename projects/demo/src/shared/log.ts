import { inject, InjectionToken } from "@angular/core"

// Where an example logs, like upstream's `useLog()`: the gallery shows it under
// the example, and the console has it otherwise.
const ExampleLog = new InjectionToken<(message: string) => void>("log", {
  factory: () => (message: string) => console.log(message),
})

function injectLog() {
  return inject(ExampleLog)
}

export { ExampleLog, injectLog }
