import { booleanAttribute } from "@angular/core"

/**
 * `booleanAttribute` that keeps `undefined`, so a boolean input left out, or
 * bound to `undefined`, takes core's default instead of `false`.
 * @experimental
 */
function optionalBoolean(value: unknown) {
  return value === undefined ? undefined : booleanAttribute(value)
}

export { optionalBoolean }
