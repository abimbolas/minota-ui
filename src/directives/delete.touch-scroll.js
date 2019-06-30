class TouchScrollController {
  constructor ({ element, callback, scrollTarget = window }) {
    this.touches = null
    this.scrolls = null
    this.element = element
    this.callback = callback
    this.scrollTarget = scrollTarget
    this.bind()
  }

  start (event) {
    this.scrolls = [this.scrollTop()]
    this.touches = [event.changedTouches[0]]
    this.callback({
      type: 'start',
      y: this.scrollTop()
    })
  }

  end (event) {
    this.scroll = null
    this.touches = null
    this.callback({
      type: 'end',
      y: this.scrollTop()
      // direction: -1 * this.moveDelta() || this.scrollDelta(),
      // delta: this.scrollDelta()
    })
  }

  move (event) {
    if (this.touches) {
      this.touches.unshift(event.changedTouches[0])
      this.scrolls.unshift(this.scrollTop())
      this.callback({
        type: 'move',
        y: this.scrollTop(),
        direction: -1 * this.moveDelta() || this.scrollDelta(),
        delta: this.scrollDelta()
      })
    }
  }

  scrollTop () {
    return (this.scrollTarget.scrollY || this.scrollTarget.scrollTop) || 0
  }

  scrollDelta () {
    return this.scrolls ? this.scrolls[0] - this.scrolls[1] : 0
  }

  moveDelta () {
    return this.touches ? this.touches[0].clientY - this.touches[1].clientY : 0
  }

  bind () {
    this.handleStart = this.start.bind(this)
    this.handleMove = this.move.bind(this)
    this.handleEnd = this.end.bind(this)
    this.element.addEventListener('touchstart', this.handleStart)
    this.element.addEventListener('touchmove', this.handleMove)
    this.element.addEventListener('touchend', this.handleEnd)
  }

  unbind () {
    this.element.removeEventListener('touchstart', this.handleStart)
    this.element.removeEventListener('touchmove', this.handleMove)
    this.element.removeEventListener('touchend', this.handleEnd)
  }
}

export default {
  bind (element, binding) {
    element.touchScrollController = new TouchScrollController({
      element: element,
      callback: binding.value,
      scrollTarget: window
    })
  },

  unbind (element, binding) {
    element.touchScrollController.unbind()
  }
}
