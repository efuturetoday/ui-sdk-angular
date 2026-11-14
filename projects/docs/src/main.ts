import { bootstrapApplication } from "@angular/platform-browser"
import { checkPattern } from "@ui-sdk/core/testing"
import { appConfig } from "./app/app.config"
import { App } from "./app/app"

Object.assign(window, { checkPattern })

bootstrapApplication(App, appConfig).catch((err) => console.error(err))
