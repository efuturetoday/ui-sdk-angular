import { Component } from "@angular/core"
import {
  UiDrawer,
  UiDrawerBackdrop,
  UiDrawerClose,
  UiDrawerContent,
  UiDrawerDescription,
  UiDrawerTitle,
  UiDrawerTrigger,
} from "@ngx-ui-sdk/core/drawer"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import { UiInput } from "@ngx-ui-sdk/core/input"

@Component({
  selector: "app-example",
  imports: [
    UiDrawer,
    UiDrawerBackdrop,
    UiDrawerClose,
    UiDrawerContent,
    UiDrawerDescription,
    UiDrawerTitle,
    UiDrawerTrigger,
    UiField,
    UiFieldLabel,
    UiInput,
  ],
  template: `
    <ng-container uiDrawer>
      <button uiDrawerTrigger>Account</button>
      <div *uiDrawerBackdrop></div>
      <div *uiDrawerContent>
        <div data-slot="grip" aria-hidden="true"></div>
        <div data-slot="stack">
          <h2 uiDrawerTitle>Account</h2>
          <p uiDrawerDescription>Manage how you sign in.</p>
        </div>
        <dl>
          <div data-slot="row">
            <dt>Email</dt>
            <dd>hollis@example.com</dd>
          </div>
          <div data-slot="row">
            <dt>Password</dt>
            <dd>Changed 3 months ago</dd>
          </div>
          <div data-slot="row">
            <dt>Two-factor</dt>
            <dd>On</dd>
          </div>
        </dl>
        <div data-slot="stack">
          <ng-container uiDrawer>
            <button uiDrawerTrigger>Change Password</button>
            <div *uiDrawerBackdrop></div>
            <div *uiDrawerContent>
              <div data-slot="grip" aria-hidden="true"></div>
              <div data-slot="stack">
                <h2 uiDrawerTitle>Change password</h2>
                <p uiDrawerDescription>Use at least 12 characters.</p>
              </div>
              <div uiField>
                <label uiFieldLabel>New password</label>
                <input uiInput type="password" />
              </div>
              <div data-slot="stack">
                <button uiDrawerClose data-variant="solid">Update</button>
              </div>
            </div>
          </ng-container>
          <button uiDrawerClose data-variant="solid">Done</button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {}

export { Example }
