// import fastdom from 'fastdom'

export default {
  analyzeScrollSlow (data = {}, element) {
    return Object.assign(data, {
      offsetWidth: element.offsetWidth,
      offsetHeight: element.offsetHeight,
      scrollWidth: element.scrollWidth,
      scrollHeight: element.scrollHeight,
      element: element
    })
  },

  analyzeScrollFast (data = {}, element) {
    let scrollTop = element.scrollTop
    let scrollLeft = element.scrollLeft
    return Object.assign(data, {
      velocityY: scrollTop - (data.scrollTop || 0),
      velocityX: scrollLeft - (data.scrollLeft || 0),
      scrollTop: scrollTop,
      scrollLeft: scrollLeft,
      scrollBottom: data.scrollHeight - data.offsetHeight - scrollTop,
      scrollRight: data.scrollWidth - data.offsetWidth - scrollLeft
    })
  },

  analyzeScrollInit (element) {
    return this.analyzeScrollFast(this.analyzeScrollSlow({}, element), element)
  },

  analyzeScrollTick (data, element, callback) {
    // fastdom.measure(() => {
    let dataCopy = Object.assign({}, data)
    clearTimeout(this.analyzeScrollSlowTimeout)
    this.analyzeScrollSlowTimeout = setTimeout(() => {
      this.analyzeScrollSlow(dataCopy, element)
    }, 500)
    callback(this.analyzeScrollFast(dataCopy, element))
    // })
  }
}
