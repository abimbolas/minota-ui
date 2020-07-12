/* eslint-disable no-unused-expressions */

import { assert, expect } from 'chai'
import Workspace from '@/models/workspace'

describe('Workspace', () => {
  let w
  let obj

  function createObj () {
    return {
      a: parseInt(Math.random() * 100, 10)
    }
  }

  beforeEach(() => {
    w = new Workspace()
    w.example = []
    obj = createObj()
  })

  it('Can add to example area', () => {
    w._addTo('example', obj)
    expect(w._isIn('example', obj)).to.be.true
    expect(w['example'].length).to.equal(1)
    w._removeFrom('example', obj)
    expect(w['example'].length).to.equal(0)
  })

  it('Do not add same to example area twice', () => {
    w._addTo('example', obj)
    w._addTo('example', obj)
    expect(w['example'].length).to.equal(1)
  })

  it('Remove from focus fail silently', () => {
    w._removeFrom('example', obj)
    assert.isOk(true)
  })

  it('Add to focus/blur, remove from focus/blur', () => {
    w.addToFocus(obj)
    expect(w.focus.length).to.equal(1)
    w.removeFromFocus(obj)
    expect(w.focus.length).to.equal(0)
    const obj2 = createObj()
    w.addToBlur(obj2)
    expect(w.blur.length).to.equal(1)
    w.removeFromBlur(obj2)
    expect(w.blur.length).to.equal(0)
  })

  it('Add object to focus also removes it from blur and vice versa', () => {
    expect(w.focus.length).to.equal(0)
    expect(w.blur.length).to.equal(0)
    w.addToFocus(obj)
    expect(w.focus.length).to.equal(1)
    expect(w.isInFocus(obj)).to.be.true
    w.addToBlur(obj)
    expect(w.focus.length).to.equal(0)
    expect(w.blur.length).to.equal(1)
    expect(w.isInBlur(obj)).to.be.true
    w.addToFocus(obj)
    expect(w.focus.length).to.equal(1)
    expect(w.blur.length).to.equal(0)
    expect(w.isInFocus(obj)).to.be.true

    const obj2 = createObj()
    w.addToFocus(obj2, { focusCapacity: 2 })
    expect(w.isInFocus(obj)).to.be.true
    expect(w.isInFocus(obj2)).to.be.true
    w.addToBlur(obj2)
    expect(w.isInFocus(obj)).to.be.true
    expect(w.isInFocus(obj2)).to.be.false
    expect(w.isInBlur(obj)).to.be.false
    expect(w.isInBlur(obj2)).to.be.true
    w.addToBlur(obj)
    expect(w.isInFocus(obj)).to.be.false
    expect(w.isInFocus(obj2)).to.be.false
    expect(w.isInBlur(obj)).to.be.true
    expect(w.isInBlur(obj2)).to.be.true
    w.addToFocus(obj2)
    expect(w.isInFocus(obj)).to.be.false
    expect(w.isInFocus(obj2)).to.be.true
    expect(w.isInBlur(obj)).to.be.true
    expect(w.isInBlur(obj2)).to.be.false
  })

  it('Move focus content to blur and vice versa', () => {
    const obj2 = createObj()
    const obj3 = createObj()
    w.focusCapacity = 3
    let options = { focusCapacity: 3 }
    w.addToFocus(obj, options)
    w.addToFocus(obj2, options)
    w.addToFocus(obj3, options)
    expect(w.focus.length).to.equal(3)
    w.blurFocus(obj)
    expect(w.focus.length).to.equal(2)
    expect(w.isInBlur(obj)).to.be.true
    w.blurFocus()
    expect(w.focus.length).to.equal(0)
    expect(w.isInBlur(obj2)).to.be.true
    expect(w.isInBlur(obj3)).to.be.true
    expect(w.blur.length).to.equal(3)
    w.focusBlur(obj3)
    expect(w.focus.length).to.equal(1)
    expect(w.isInFocus(obj3)).to.be.true
    expect(w.blur.length).to.equal(2)
    w.focusBlur()
    expect(w.focus.length).to.equal(3)
    expect(w.blur.length).to.equal(0)
  })

  describe('Focus capacity', () => {
    // it('Can be removed', () => {
    //   const w2 = new Workspace()
    //   w2.focusCapacity = 1
    //   expect(w2.focusCapacity).to.equal(1)
    //   w2.removeFocusCapacity()
    //   expect(w2.focusCapacity).to.be.undefined
    // })

    it('While moving into focus which capacity is 1, blur focus', () => {
      w.focusCapacity = 1
      w.addToFocus(obj, { focusCapacity: 1 })
      const obj2 = createObj()
      w.addToFocus(obj2, { focusCapacity: 1 })
      expect(w.focus.length).to.equal(1)
      expect(w.isInFocus(obj)).to.be.false
      expect(w.blur.length).to.equal(1)
      expect(w.isInBlur(obj)).to.be.true
      expect(w.isInFocus(obj2)).to.be.true
    })

    it('While using capacity 3, blur when adding 4th', () => {
      const w3 = new Workspace()
      const objs = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(() => createObj())
      objs.slice(0, 3).forEach(i => {
        w3.addToFocus(i, { focusCapacity: 3 })
      })
      expect(w3.focus.length).to.equal(3)
      expect(w3.isInFocus(objs[0])).to.be.true
      expect(w3.isInFocus(objs[1])).to.be.true
      expect(w3.isInFocus(objs[2])).to.be.true
      w3.addToFocus(objs[3], { focusCapacity: 3 })
      expect(w3.focus.length).to.equal(3)
      expect(w3.isInFocus(objs[0])).to.be.false
      expect(w3.isInBlur(objs[0])).to.be.true
      w3.addToFocus(objs[4], { focusCapacity: 3 })
      expect(w3.focus.length).to.equal(3)
      expect(w3.blur.length).to.equal(2)
      expect(w3.isInFocus(objs[0])).to.be.false
      expect(w3.isInBlur(objs[0])).to.be.true
      expect(w3.isInFocus(objs[1])).to.be.false
      expect(w3.isInBlur(objs[1])).to.be.true
    })

    it('Keeping order', () => {
      const w = new Workspace()
      w.addToFocus(1)
      w.blurFocus()
      w.addToFocus(2)
      w.blurFocus()
      w.addToFocus(3)
      w.blurFocus()
      expect(w.blur[0]).to.equal(3)
      expect(w.blur[1]).to.equal(2)
      expect(w.blur[2]).to.equal(1)
      w.focusBlur()
      expect(w.focus[0]).to.equal(3)
      expect(w.focus[1]).to.equal(2)
      expect(w.focus[2]).to.equal(1)
    })

    it('should be able to prepend and append focus items', () => {
      const w = new Workspace()
      let options = { focusCapacity: Number.POSITIVE_INFINITY }
      w.addToFocus(1, options)
      w.addToFocus(2, options)
      expect(w.focus[0]).to.equal(2)
      expect(w.focus[1]).to.equal(1)
      w.addToFocus(3, Object.assign(options, { append: true }))
      expect(w.focus[2]).to.equal(3)
      w.addToFocus(4, Object.assign(options, { append: true }))
      expect(w.focus[3]).to.equal(4)
      w.blurFocus(null, { append: true })
      expect(w.blur[0]).to.equal(2)
      expect(w.blur[3]).to.equal(4)
      expect(w.focus.length).to.equal(0)
      w.focusBlur()
      expect(w.focus[0]).to.equal(2)
      expect(w.focus[2]).to.equal(3)
      w.addToBlur(5, { append: true })
      w.addToBlur(6, { append: true })
      expect(w.blur[0]).to.equal(5)
      expect(w.blur[1]).to.equal(6)
      w.focusBlur()
      expect(w.focus[0]).to.equal(5)
      w.addToBlur(7, { append: true })
      w.addToBlur(8, { append: true })
      expect(w.blur[0]).to.equal(7)
      expect(w.blur[1]).to.equal(8)
      w.focusBlur(null, { append: true })
      expect(w.focus[0]).to.equal(5)
      expect(w.focus.slice(-1)[0]).to.equal(8)
    })
  })
})
