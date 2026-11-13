import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from "@angular/core"

const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners()],
}

export { appConfig }
