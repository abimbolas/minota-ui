export default {
  computed: {
    config () {
      return this.prop.config
    },

    content () {
      return this.prop.content
    },

    type () {
      return ['space', 'plane', 'line', 'point', 'note'].find(key => this[key])
    },

    prop () {
      return this[this.type]
    }
  }
}
