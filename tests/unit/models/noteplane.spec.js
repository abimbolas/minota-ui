/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import Note from '@/models/note'
import NotePoint from '@/models/notepoint'
import NoteLine from '@/models/noteline'
import NotePlane from '@/models/noteplane'

describe('NotePlane', () => {
  let noteplane
  beforeEach(() => {
    noteplane = new NotePlane()
  })

  it('exists', () => {
    // console.log(noteplane)
    let keys = Object.keys(noteplane).sort((a, b) => {
      return a > b ? 1 : a < b ? -1 : 0
    })
    expect(keys.join()).to.equal('config,content,line,note,plane')
    expect(noteplane instanceof NotePlane).to.be.true
    expect(noteplane instanceof NoteLine).to.be.true
    expect(noteplane instanceof NotePoint).to.be.true
    expect(noteplane instanceof Note).to.be.true
    expect(noteplane.note instanceof Note).to.be.true
    expect(Array.isArray(noteplane.line)).to.be.true
    expect(Array.isArray(noteplane.plane)).to.be.true
    expect(typeof noteplane.content).to.equal('string')
    expect(noteplane.id).to.not.equal(noteplane.note.id)
    expect(noteplane.config.date instanceof Date).to.be.true
  })
})
