/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import Note from '@/models/note'
import NotePoint from '@/models/notepoint'

describe('NotePoint', () => {
  let notepoint
  beforeEach(() => {
    notepoint = new NotePoint()
  })

  it('exists', () => {
    // console.log(notepoint)
    let keys = Object.keys(notepoint).sort((a, b) => {
      return a > b ? 1 : a < b ? -1 : 0
    })
    expect(keys.join()).to.equal('config,content,note')
    expect(notepoint instanceof NotePoint).to.be.true
    expect(notepoint instanceof Note).to.be.true
    expect(notepoint.note instanceof Note).to.be.true
    expect(typeof notepoint.content).to.equal('string')
    expect(notepoint.id).to.not.equal(notepoint.note.id)
    expect(notepoint.config.date instanceof Date).to.be.true
  })
})
