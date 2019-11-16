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
  const mutations = {
    addToPoolFocus ({ notes, note, depth = 0 }) {
      NoteGroup.batch('removeItem', notes || [note])
      NoteGroup.batch('addItem', notes || [note], depth)
    },
    clearPoolFocus () {
      NoteGroup.children = []
    },
    removeFromPoolFocus ({ notes }) {
      NoteGroup.batch('removeItem', notes)
    }
  }

  store.subscribe(mutation => {
    if (mutations[mutation.type]) {
      mutations[mutation.type](mutation.payload)
    }
  })
}
