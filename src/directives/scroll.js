class ScrollController {
  constructor ({ callback, scrollTarget = window }) {
    this.callback = callback
    this.scrollTarget = scrollTarget
    this.previousScrollTop = 0
    this.bind()
  }

  scroll (event) {
    const currentScrollTop = this.scrollTop()
    const delta = currentScrollTop - this.previousScrollTop
    this.callback({
      delta,
      scrollTop: currentScrollTop
    })
    this.previousScrollTop = currentScrollTop
  }

  scrollTop () {
    return (this.scrollTarget.scrollY || this.scrollTarget.scrollTop) || 0
  }

  bind () {
    this.handleScroll = this.scroll.bind(this)
    this.scrollTarget.addEventListener('scroll', this.handleScroll)
  }

  destroy () {
    this.scrollTarget.removeEventListener('scroll', this.handleScroll)
  }
}

export default {
  inserted (element, binding) {
    element.scrollController = new ScrollController({
      callback: binding.value,
      scrollTarget: binding.arg === 'window'
        ? window
        : document.getElementById(binding.arg)
    })
  },

  unbind (element, binding) {
    element.scrollController.destroy()
  }
}
