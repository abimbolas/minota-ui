import $router from '@/router'
import Note from '@/models/note'
import Group from '@/models/group'
import { BackendReference, NoteReference } from '@/reference'
import { lastPromise } from '@/utils/last-promise'
import { topicDelimiter } from '@/store/ui'
// import router from '@/router'

function Backend ({ getters }) {
  return BackendReference[getters.getCurrentStorageConfig.id]
}

const state = {}

const actions = {

  //
  // Core
  //

  newNoteAction (context) {
    const note = new Note()
    context.commit('addToReference', { notes: [note] })
    // context.commit('addToFocus', { note })
    // router.push(`/table/${note.config.id}`)
    return Promise.resolve(note)
  },

  getNotesAction (context, payload) {
    return Backend(context).getNotes().then(notes => {
      context.commit('addToReference', { notes })
      return notes
    })
  },

  getNoteAction (context, payload) {
    const existingNote = NoteReference[payload.id]
    if (existingNote) {
      return Promise.resolve(existingNote)
    } else {
      return Backend(context).getNote(payload.id)
        .then(note => {
          context.commit('addToReference', { notes: [note] })
          return note
        })
    }
  },

  saveNoteAction (context, payload) {
    return lastPromise({
      type: `saveNoteAction_${payload.note.config.id}`,
      promise: Backend(context).postNote(payload.note)
    }).then(note => {
      context.commit('addToReference', { notes: [note] })
      return Promise.resolve(note)
    })
  },

  saveNotesAction (context, payload) {
    return Promise.all(payload.notes.map(note => {
      return Backend(context).postNote(note)
    })).then(notes => {
      context.commit('addToReference', { notes })
      return notes
    })
  },

  openNoteAction (context, payload) {
    const topic = context.getters.getContext
    $router.push(`/note/${payload.note.config.id}${topic ? '?topic=' + topic : ''}`)
  },

  deleteNotesAction (context, payload) {
    return Promise.all(payload.notes.map(note => {
      return Backend(context).deleteNote(note)
    }))
  },

  groupNotesAction (context, payload) {
    return Promise.all(payload.groups.map(group => {
      let notes, oldContext, newContext
      if (group instanceof Group) {
        notes = group.getItems()
        oldContext = group.context.join(topicDelimiter)
      } else {
        notes = [group]
        oldContext = group.topic
      }
      newContext = oldContext.split(topicDelimiter).concat(payload.topic).join(topicDelimiter)
      context.commit('removeFromPool', { items: notes })
      notes.forEach(note => {
        note.topic = note.topic.replace(new RegExp(`^${oldContext}`), newContext)
      })
      return context.dispatch('saveNotesAction', { notes }).then(notes => {
        context.commit('addToPool', {
          items: notes,
          depth: oldContext.split(topicDelimiter).length
        })
        return notes
      })
    })).catch(error => {
      console.error('Group action failed', error)
    })
  },

  ungroupNotesAction (context, payload) {
    return Promise.all(payload.groups.map(group => {
      const notes = group.getItems()
      const oldTopic = group.context.concat(group.key).join(topicDelimiter)
      const newTopic = group.context.join(topicDelimiter)
      context.commit('removeFromPool', { items: notes })
      notes.forEach(note => {
        note.topic = note.topic.replace(new RegExp(`^${oldTopic}`), newTopic)
      })
      return context.dispatch('saveNotesAction', { notes }).then(notes => {
        context.commit('addToPool', {
          items: notes,
          depth: newTopic.split(topicDelimiter).length
        })
        return notes
      })
    })).catch(error => {
      console.error('Ungroup action failed:', error)
    })
  }
}

export default {
  state,
  actions
}
