export class Storage extends Map {
  add (note) {
    let duplicate = this.get(note.id)
    if (duplicate) {
      console.warn(`Storage: note ${duplicate.id} duplicate, ignoring`)
    } else {
      this.set(note.id, note)
    }
  }

  update (id, update) {
    let target = this.get(id)
    if (!target) {
      console.warn(`Storage: note ${id} not found, ignoring`)
    } else {
      if ('content' in update) {
        target.content = update.content
      }
      if ('config' in update) {
        delete update.config.id // just in case
        Object.assign(target.config, update.config)
      }
      target.config.updated = new Date()
    }
  }
}

export default {
  state: {
    storage: new Storage()
  },
  mutations: {
    addNote ({ storage }, payload) {
      storage.add(payload.note)
      console.log('Storage note', storage.get(payload.note.id))
    },
    updateNote ({ storage }, payload) {
      storage.update(payload.note.id, payload.update)
      console.log('Storage updated', storage.get(payload.note.id))
    }
  }
  // actions: {
  //   addStorageAction () {
  //     // user wants to add storage
  //   },
  //   removeStorageAction () {
  //     // user wants to remove storage
  //   }
  // }
}
