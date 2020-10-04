import Note from './note'
import Workspace from './workspace'

const Table = new Workspace()

export default {
  state: {
    table: Table.focus
  },

  getters: {
    table: state => state.table
  },

  mutations: {
    rehydrateTable (state) {
      Table.focus = state.table.map(item => new Note(item))
      state.table = Table.focus
    },

    addToTable (state, payload) {
      let notes = payload.notes || [payload.note]
      notes.forEach(note => {
        Table.addToFocus(note, {
          focusCapacity: payload.focusCapacity || Number.POSITIVE_INFINITY,
          append: payload.append
        })
      })
    },

    removeFromTable (state, payload) {
      let notes = payload.notes || [payload.note]
      notes.forEach(note => {
        Table.removeFromFocus(note)
      })
    }
  }
}

// export default {
//   state: {
//     line: Table.focus
//   },
//
//   getters: {
//     table: state => state.line
//   },
//
//   mutations: {
//     rehydrateTable (state) {
//       Table.focus = state.line.map(item => new Note(item))
//       state.line = Table.focus
//     },
//
//     addToTable (state, payload) {
//       let notes = payload.notes || [payload.note]
//       notes.forEach(note => {
//         Table.addToFocus(note, {
//           focusCapacity: payload.focusCapacity || Number.POSITIVE_INFINITY,
//           append: payload.append
//         })
//       })
//     }
//
//     // replaceOnTable (state, payload) {
//     //   let notes = payload.notes || [payload.note]
//     //   notes.forEach(note => {
//     //     Table.replaceInFocus(note)
//     //   })
//     // },
//     //
//     // removeFromTable (state, payload) {
//     //   let notes = payload.notes || [payload.note]
//     //   notes.forEach(note => {
//     //     Table.removeFromFocus(note)
//     //   })
//     // },
//
//     // putOnTableBefore (state, payload) {
//     //   if (!Table.isInFocus(payload.before)) {
//     //     console.warn('putOnTableAfter: payload.before not found on table:', payload.before)
//     //   } else {
//     //     Table.removeFromFocus(payload.put)
//     //     Table.focus.splice(
//     //       Table.focus.findIndex(note => note.id === payload.before.id),
//     //       0,
//     //       payload.put
//     //     )
//     //   }
//     // },
//     //
//     // putOnTableAfter (state, payload) {
//     //   if (!Table.isInFocus(payload.after)) {
//     //     console.warn('putOnTableAfter: payload.after not found on table:', payload.after)
//     //   } else {
//     //     Table.removeFromFocus(payload.put)
//     //     Table.focus.splice(
//     //       Table.focus.findIndex(note => note.id === payload.after.id) + 1,
//     //       0,
//     //       payload.put
//     //     )
//     //   }
//     // },
//     //
//     // clearTable (state, payload) {
//     //   Table.clearFocus()
//     // }
//   }
// }
