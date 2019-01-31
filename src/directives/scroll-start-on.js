import bus from '@/event-bus'

let scrollStartNiceTimeout

function scrollStartNice (element) {
  clearTimeout(scrollStartNiceTimeout)
  let left = 0.8 * (element.scrollLeft)
  let top = 0.8 * (element.scrollTop)
  if (left > 5 || top > 5) {
    element.scrollLeft = left
    element.scrollTop = top
    scrollStartNiceTimeout = setTimeout(() => {
      scrollStartNice(element)
    }, 20)
  } else {
    element.scrollLeft = 0
    element.scrollTop = 0
  }
}

export default {
  bind (element, { value }) {
    element.handler = scrollStartNice.bind(null, element)
    if (Array.isArray(value)) {
      value.forEach(event => {
        bus.$on(event, element.handler)
      })
    } else {
      bus.$on(value, element.handler)
    }
  },

  unbind (element, { value }) {
    if (Array.isArray(value)) {
      value.forEach(event => {
        bus.$off(event, element.handler)
      })
    } else {
      bus.$off(value, element.handler)
    }
  }
}
