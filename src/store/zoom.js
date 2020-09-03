export default {
  state: {
    zoom: 0
  },

  getters: {
    zoom: state => state.zoom
  },

  mutations: {
    zoomIn (state) {
      state.current = state.current - 1
    },

    zoomOut (state) {
      state.current = state.current + 1
    }
  }
}
