/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import Note from '@/models/note'
import NotePoint from '@/models/notepoint'
import NoteLine from '@/models/noteline'
import NotePlane from '@/models/noteplane'
import NoteSpace from '@/models/notespace'

describe('NoteSpace', () => {
  let notespace
  beforeEach(() => {
    notespace = new NoteSpace()
  })

  it('exists', () => {
    // console.log(notespace)
    let keys = Object.keys(notespace).sort((a, b) => {
      return a > b ? 1 : a < b ? -1 : 0
    })
    expect(keys.join()).to.equal('config,content,line,note,plane,space')
    expect(notespace instanceof NoteSpace).to.be.true
    expect(notespace instanceof NotePlane).to.be.true
    expect(notespace instanceof NoteLine).to.be.true
    expect(notespace instanceof NotePoint).to.be.true
    expect(notespace instanceof Note).to.be.true
    expect(notespace.note instanceof Note).to.be.true
    expect(Array.isArray(notespace.space)).to.be.true
    expect(Array.isArray(notespace.plane)).to.be.true
    expect(Array.isArray(notespace.line)).to.be.true
    expect(typeof notespace.content).to.equal('string')
    expect(notespace.id).to.not.equal(notespace.note.id)
    expect(notespace.config.date instanceof Date).to.be.true
  })
})
