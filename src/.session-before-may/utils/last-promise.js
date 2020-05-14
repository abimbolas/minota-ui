const promises = {}
const PREVIOUS_PROMISE_IGNORE = 'Previous promise ignore'

function winner ({ type, promise, result }) {
  if (!promises[type] || promises[type] === promise) {
    return Promise.resolve(result)
  } else {
    return Promise.reject(new Error(PREVIOUS_PROMISE_IGNORE))
  }
}

function participant ({ type, promise }) {
  promises[type] = promise
}

export default function lastPromise ({ type, promise }) {
  participant({ type, promise })
  return promise.then(result => winner({ type, promise, result }))
}
