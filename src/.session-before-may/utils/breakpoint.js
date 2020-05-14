export default {
  min: {
    get sm () {
      return document.documentElement.clientWidth >= 576
    },
    get md () {
      return document.documentElement.clientWidth >= 768
    },
    get lg () {
      return document.documentElement.clientWidth >= 992
    },
    get xl () {
      return document.documentElement.clientWidth >= 1200
    }
  },
  max: {
    get sm () {
      return document.documentElement.clientWidth < 576
    },
    get md () {
      return document.documentElement.clientWidth < 768
    },
    get lg () {
      return document.documentElement.clientWidth < 992
    },
    get xl () {
      return document.documentElement.clientWidth < 1200
    }
  }
}
