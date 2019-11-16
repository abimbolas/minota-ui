import Config from '@/models/config'

const state = {
  list: [],
  current: null
}

const getters = {
  getStorageConfigList: state => state.list,
  getCurrentStorageConfig: state => state.list.find(config => config.id === state.current),
  getCurrentStorageProtocol: state => {
    const config = state.list.find(config => config.id === state.current)
    if (config) {
      return config.storage.url.split('://')[0]
    }
  }
}

const mutations = {
  setCurrentStorageConfig (state, payload) {
    if (typeof payload.config === 'string') {
      state.current = payload.config
    } else {
      state.current = payload.config.id
    }
  },

  addStorageConfig (state, payload) {
    if (payload.config instanceof Config) {
      state.list.push(payload.config)
    } else {
      state.list.push(new Config(payload.config))
    }
  },

  removeStorageConfig (state, payload) {
    const foundIndex = state.list.findIndex(item => {
      return item === payload.config ||
        item.id === payload.config ||
        item.id === payload.config.id
    })
    if (foundIndex > -1) {
      state.list.splice(foundIndex, 1)
    }
  },

  updateStorageConfig (state, payload) {
    const foundIndex = state.list.findIndex(item => item.id === payload.config.id)
    if (foundIndex > -1) {
      state.list.splice(foundIndex, 1, payload.config)
    } else {
      console.warn('store/storage-config: updateStorageConfig: no such config')
    }
  },

  recreateStorageConfigState () {}
}

const actions = {
  addStorageConfigAction (context, payload) {
    return context.dispatch('openModalAction', {
      modal: {
        ok: {
          label: 'Add storage'
        },
        component: 'StorageModal',
        data: payload && payload.config
      }
    }).then(resolve => {
      const config = new Config(resolve.config)
      context.commit('addStorageConfig', { config })
      if (resolve.activate) {
        context.commit('setCurrentStorageConfig', { config })
      }
    }).catch(reject => {
      console.log('addStorageConfigAction canceled')
    })
  },

  updateStorageConfigAction (context, payload) {
    return context.dispatch('openModalAction', {
      modal: {
        ok: {
          label: 'Save storage'
        },
        component: 'StorageModal',
        data: payload && payload.config
      }
    }).then(resolve => {
      const config = new Config(resolve.config)
      context.commit('updateStorageConfig', { config })
      if (resolve.activate) {
        context.commit('setCurrentStorageConfig', { config })
      }
    }).catch(reject => {
      console.log('updateStorageConfigAction canceled')
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
