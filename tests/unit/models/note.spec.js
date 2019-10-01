/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import Note from '@/models/note'

describe('Note', () => {
  it('can be created', () => {
    const n = new Note()
    expect(n).to.be.a('object')
  })

  it('parses topic and content correctly through setter', () => {
    const n = new Note()
    n.editableContent = [
      '# Hey all!',
      '',
      'Welcome to note'
    ].join('\n')
    expect(n.topic).to.equal('Hey all!')
    expect(n.content).to.equal('Welcome to note')
    expect(n.editableContent).to.equal('# Hey all!\n\nWelcome to note')
  })

  it('parses topic and content correctly from init', () => {
    const n = new Note({
      content: 'Hello, world!',
      config: {
        topic: 'Hey everyone'
      }
    })
    expect(n.topic).to.equal('Hey everyone')
    expect(n.content).to.equal('Hello, world!')
    expect(n.editableContent).to.equal('# Hey everyone\n\nHello, world!')
  })
})
