export default class LastPromise {
  constructor ({ type, promise, registry } = {}) {
    if (!type || !promise || !registry) {
      throw new Error('LastPromise: type, promise and registry should not be empty')
    }
    registry[type] = promise
    return promise.then(result => {
      if (!registry[type] || registry[type] === promise) {
        return Promise.resolve(result)
      } else {
        return Promise.reject(new Error('Ignore'))
      }
    })
  }
}
