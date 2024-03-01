export const queue = (iterable, mapFunc, options = { limit: Infinity }) => {
  let resolved = []
  let limit = options.limit
  let offset = 0
  let chain = Promise.resolve()

  if (!(iterable instanceof Array)) { throw new Error('[conch] the input needs to be an array of items') }

  if (isNaN(options.limit)) { throw new Error('[conch] limit needs to be a number') }

  if (options.limit === Infinity || options.limit === 0) limit = iterable.length

  while (offset < iterable.length) {
    const batch = iterable.slice(offset * limit, (offset + 1) * limit)
    if (batch.length === 0) break
    offset = offset + 1
    chain = chain
      .then(() => Promise.all(batch.map(mapFunc)))
      .then(d => {
        resolved = resolved.concat(d)
      })
  }

  return chain.then(() => resolved)
}
