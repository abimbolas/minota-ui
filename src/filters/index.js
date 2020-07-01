export default {
  capitalize: function (value) {
    if (!value) {
      return ''
    } else {
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
}
