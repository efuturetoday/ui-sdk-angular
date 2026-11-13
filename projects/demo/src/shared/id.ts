let next = 0

// An id unique on the page, like Vue's `useId()`, for ids an example writes itself.
function uniqueId() {
  return `example-${++next}`
}

export { uniqueId }
