export function filterKeys(obj: Object, filter: string | RegExp) {
  let key: string
  let keys = []
  for (key in obj) {
    if (obj.hasOwnProperty(key) && key.match(filter)) {
      keys.push(key)
    }
  }
  return keys
}
