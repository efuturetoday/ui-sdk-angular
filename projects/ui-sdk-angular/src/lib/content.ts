import { ElementRef, inject } from "@angular/core"

// An element's content has one owner, decided by the template: core when it's
// written empty, the template when it has content of its own. Its children
// exist from `ngOnInit` on, before core writes any, so `decide()` goes there.
function injectContentOwner() {
  const el = inject(ElementRef).nativeElement as HTMLElement
  let core = false
  return {
    decide: () => {
      core = !el.hasChildNodes()
    },
    core: () => core,
  }
}

export { injectContentOwner }
