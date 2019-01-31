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
    w.addTo('example', obj)
    expect(w.isIn('example', obj)).to.be.true
    expect(w['example'].length).to.equal(1)
    w.removeFrom('example', obj)
    expect(w['example'].length).to.equal(0)
  })

  it('Do not add same to example area twice', () => {
    w.addTo('example', obj)
    w.addTo('example', obj)
    expect(w['example'].length).to.equal(1)
  })

  it('Remove from focus fail silently', () => {
    w.removeFrom('example', obj)
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
    w.addToFocus(obj2)
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
    w.addToFocus(obj)
    w.addToFocus(obj2)
    w.addToFocus(obj3)
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
    it('Can be not set', () => {
      const w2 = new Workspace()
      expect(w2.focusCapacity).to.be.undefined
      w2.setFocusCapacity(1)
      expect(w2.focusCapacity).to.equal(1)
      w2.removeFocusCapacity()
      expect(w2.focusCapacity).to.be.undefined
    })

    it('Can be initially set', () => {
      const w2 = new Workspace({
        focusCapacity: 2
      })
      expect(w2.focusCapacity).to.equal(2)
    })

    it('While moving into focus which capacity is 1, blur focus', () => {
      w.setFocusCapacity(1)
      w.addToFocus(obj)
      const obj2 = createObj()
      w.addToFocus(obj2)
      expect(w.focus.length).to.equal(1)
      expect(w.isInFocus(obj)).to.be.false
      expect(w.blur.length).to.equal(1)
      expect(w.isInBlur(obj)).to.be.true
      expect(w.isInFocus(obj2)).to.be.true
    })

    it('While using capacity 3, blur when adding 4th', () => {
      const w3 = new Workspace({ focusCapacity: 3 })
      const objs = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(() => createObj())
      objs.slice(0, 3).forEach(i => {
        w3.addToFocus(i)
      })
      expect(w3.focus.length).to.equal(3)
      expect(w3.isInFocus(objs[0])).to.be.true
      expect(w3.isInFocus(objs[1])).to.be.true
      expect(w3.isInFocus(objs[2])).to.be.true
      w3.addToFocus(objs[3])
      expect(w3.focus.length).to.equal(3)
      expect(w3.isInFocus(objs[0])).to.be.false
      expect(w3.isInBlur(objs[0])).to.be.true
      w3.addToFocus(objs[4])
      expect(w3.focus.length).to.equal(3)
      expect(w3.blur.length).to.equal(2)
      expect(w3.isInFocus(objs[0])).to.be.false
      expect(w3.isInBlur(objs[0])).to.be.true
      expect(w3.isInFocus(objs[1])).to.be.false
      expect(w3.isInBlur(objs[1])).to.be.true
    })
  })
})
