/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import Note from '@/models/note'
import Notepoint from '@/models/notepoint'
import Noteline from '@/models/noteline'
import Noteplane from '@/models/noteplane'
import Notespace from '@/models/notespace'

describe('Notespace', () => {
  let notespace
  beforeEach(() => {
    notespace = new Notespace()
  })

  it('exists', () => {
    // console.log(notespace)
    let keys = Object.keys(notespace).sort((a, b) => {
      return a > b ? 1 : a < b ? -1 : 0
    })
    expect(keys.join()).to.equal('config,content,focusLine,focusPlane,focusPoint,lines,note,planes,points')
    expect(notespace instanceof Notespace).to.be.true
    expect(notespace instanceof Noteplane).to.be.true
    expect(notespace instanceof Noteline).to.be.true
    expect(notespace instanceof Notepoint).to.be.true
    expect(notespace instanceof Note).to.be.true
    expect(notespace.note instanceof Note).to.be.true
    expect(Array.isArray(notespace.planes)).to.be.true
    expect(Array.isArray(notespace.lines)).to.be.true
    expect(Array.isArray(notespace.points)).to.be.true
    expect(typeof notespace.content).to.equal('string')
    expect(notespace.id).to.not.equal(notespace.note.id)
    expect(notespace.config.date instanceof Date).to.be.true
  })
})
