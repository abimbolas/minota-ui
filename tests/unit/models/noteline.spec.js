/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import Note from '@/models/note'
import NotePoint from '@/models/notepoint'
import NoteLine from '@/models/noteline'

describe('NoteLine', () => {
  let noteline
  beforeEach(() => {
    noteline = new NoteLine()
  })

  it('exists', () => {
    // console.log(noteline)
    let keys = Object.keys(noteline).sort((a, b) => {
      return a > b ? 1 : a < b ? -1 : 0
    })
    expect(keys.join()).to.equal('config,content,line,note')
    expect(Array.isArray(noteline.line)).to.be.true
    expect(noteline instanceof NoteLine).to.be.true
    expect(noteline instanceof NotePoint).to.be.true
    expect(noteline instanceof Note).to.be.true
    expect(noteline.note instanceof Note).to.be.true
    expect(typeof noteline.content).to.equal('string')
    expect(noteline.id).to.not.equal(noteline.note.id)
    expect(noteline.config.date instanceof Date).to.be.true
  })
})
