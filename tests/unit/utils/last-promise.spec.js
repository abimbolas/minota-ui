/* eslint-disable no-unused-expressions, no-new */

import { expect } from 'chai'
import LastPromise from '@/utils/last-promise'

describe('LastPromise', function () {
  it('should throw error if not enough arguments', function () {
    try {
      new LastPromise()
    } catch (error) {
      expect(error).to.be.ok
    }
  })

  it('should be created', function () {
    let registry = {}
    let promise = new Promise(resolve => resolve())
    let l = new LastPromise({
      type: 'zak',
      promise,
      registry
    })
    expect(l).to.be.ok
    expect(registry['zak']).to.equal(promise)
  })

  it('should keep only last promise', function (done) {
    let registry = {}
    let p1 = new Promise(resolve => resolve(1))
    let p2 = new Promise(resolve => resolve(2))
    let p3 = new Promise(resolve => resolve(3))
    new LastPromise({ type: 'zik', promise: p1, registry })
    new LastPromise({ type: 'zik', promise: p2, registry })
    new LastPromise({ type: 'zik', promise: p3, registry })
    expect(registry['zik']).to.equal(p3)
    registry['zik'].then(result => {
      expect(result).to.equal(3)
      done()
    })
  })
})
