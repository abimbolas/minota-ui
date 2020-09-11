/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import Note from '@/models/note'
import Notepoint from '@/models/notepoint'
import Noteline from '@/models/noteline'
import Noteplane from '@/models/noteplane'

describe('Noteplane', () => {
  let noteplane
  beforeEach(() => {
    noteplane = new Noteplane()
  })

  it('exists', () => {
    // console.log(noteplane)
    let keys = Object.keys(noteplane).sort((a, b) => {
      return a > b ? 1 : a < b ? -1 : 0
    })
    expect(keys.join()).to.equal('config,content,focusLine,focusPoint,lines,note,points')
    expect(noteplane instanceof Noteplane).to.be.true
    expect(noteplane instanceof Noteline).to.be.true
    expect(noteplane instanceof Notepoint).to.be.true
    expect(noteplane instanceof Note).to.be.true
    expect(noteplane.note instanceof Note).to.be.true
    expect(Array.isArray(noteplane.lines)).to.be.true
    expect(Array.isArray(noteplane.points)).to.be.true
    expect(typeof noteplane.content).to.equal('string')
    expect(noteplane.id).to.not.equal(noteplane.note.id)
    expect(noteplane.config.date instanceof Date).to.be.true
  })
})
