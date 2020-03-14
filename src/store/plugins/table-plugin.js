export default function (store) {
  const mutations = {
    updateInNotespace (payload) {
      (payload.notes || [payload.note]).forEach(note => {
        store.commit('updateInTableFocus', { note })
      })
    }
  }

  store.subscribe(mutation => {
    if (mutations[mutation.type]) {
      mutations[mutation.type](mutation.payload)
    }
  })
}
