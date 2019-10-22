import Group from '@/models/group'
import { topicDelimiter } from '@/store/ui'

export const NoteGroup = new Group({
  getPath: note => note.topic.split(topicDelimiter),
  getOrderedPosition: note => {
    return new Date(note.config.date).getTime()
  },
  orderDirection: -1
})

export default function (store) {
  const actions = {
    addToPool ({ items, depth = 0 }) {
      NoteGroup.batch('addItem', items, depth)
    },
    clearPool () {
      NoteGroup.children = []
    },
    removeFromPool ({ items }) {
      NoteGroup.batch('removeItem', items)
    }
  }

  store.subscribe(mutation => {
    actions[mutation.type] && actions[mutation.type](mutation.payload)
  })
}
