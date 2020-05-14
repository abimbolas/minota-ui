/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import NoteList from '@/models/note-list'

describe('Note List', () => {
  it('Can be created', () => {
    let nl = new NoteList()
    expect(nl).to.be.ok
    nl.push('hey1', 'hi2')
    expect(nl.length).to.equal(2)
  })
})
