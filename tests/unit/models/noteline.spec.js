/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import Note from '@/models/note'
import Notepoint from '@/models/notepoint'
import Noteline from '@/models/noteline'

describe('Noteline', () => {
  let noteline
  beforeEach(() => {
    noteline = new Noteline()
  })

  it('exists', () => {
    // console.log(noteline)
    let keys = Object.keys(noteline).sort((a, b) => {
      return a > b ? 1 : a < b ? -1 : 0
    })
    expect(keys.join()).to.equal('config,content,focusPoint,note,points')
    expect(Array.isArray(noteline.points)).to.be.true
    expect(noteline instanceof Noteline).to.be.true
    expect(noteline instanceof Notepoint).to.be.true
    expect(noteline instanceof Note).to.be.true
    expect(noteline.note instanceof Note).to.be.true
    expect(typeof noteline.content).to.equal('string')
    expect(noteline.id).to.not.equal(noteline.note.id)
    expect(noteline.config.date instanceof Date).to.be.true
  })
})
