export default function (store) {
  const mutations = {
    updateInNotespace (payload) {
      store.commit('updateInTableFocus', payload)
    }
  }

  store.subscribe(mutation => {
    if (mutations[mutation.type]) {
      mutations[mutation.type](mutation.payload)
    }
  })
}
