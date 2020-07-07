/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import Chance from 'chance'
import Group from '@/models/group'
import Note from '@/models/note'
import { topicDelimiter } from '@/store/ui'
import uuid from 'uuid/v1'

const chance = new Chance()

describe('Group', () => {
  let g

  beforeEach(() => {
    g = new Group()
  })

  it('exists', () => {
    expect(g).to.be.ok
  })

  it('should create flat non-grouped list', () => {
    // Flat list is where each path is unique
    const g = new Group({
      getPath: () => [`group-${uuid()}`]
    })
    g.batch('addItem', randomNotes(4, 3))
    expect(g.children.length).to.equal(4)
  })

  it('should create list with depth == 1', () => {
    const g = new Group({
      getPath: item => [item.config.topic]
    })
    g.batch('addItem', randomNotes(10, ['', 'hey', 'hello']))
    expect(g.children.length).not.to.equal(10)
    expect(g.children.filter(child => {
      return child.children.length > 1
    }).length).to.be.above(0)
  })

  it('should create deep nested list', () => {
    const g = new Group({
      getPath: item => item.config.topic.split(topicDelimiter)
    })
    g.batch('addItem', randomNotes(20, ['Work', 'Personal']))
    expect(g.children.length).to.equal(2)
  })

  it('should remove item', () => {
    const g = new Group({
      getPath: item => item.config.topic.split(topicDelimiter)
    })
    g.batch('addItem', randomNotes(20, ['Personal', 'Work', 'Zok']))
    const children = g.children.find(child => child.key === 'Zok').children
    const lBefore = children.length
    const items = [children[0]]
    g.batch('removeItem', items)
    const lAfter = children.length
    expect(lBefore - lAfter).to.equal(1)
  })
})

function randomTopicPath (pathInfo) {
  var path = []
  let max = typeof pathInfo === 'number' ? pathInfo : pathInfo.length
  var length = parseInt(Math.random() * max, 10)
  while (length >= 0) {
    length = length - 1
    if (typeof pathInfo === 'number') {
      path.push(chance.string())
    } else {
      path.push(pathInfo[parseInt(Math.random() * max, 10)])
    }
  }
  return path.filter(item => item).join(topicDelimiter)
}

function randomNotes (notesNumber, pathInfo) {
  const notes = []
  while (notesNumber > 0) {
    notesNumber = notesNumber - 1
    notes.push(new Note({
      content: chance.string(),
      config: {
        date: chance.date(),
        id: uuid(),
        topic: randomTopicPath(pathInfo)
      }
    }))
  }
  return notes
}
