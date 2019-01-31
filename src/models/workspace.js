export default class Workspace {
  constructor ({ focusCapacity = 1 } = {}) {
    this.blur = []
    this.focus = []
    if (focusCapacity) {
      this.focusCapacity = focusCapacity
    }
  }

  // Focus

  addToFocus (obj) {
    if (this.isIn('focus', obj)) {
      this.replaceIn('focus', obj)
    } else {
      this.removeFrom('blur', obj)
      while (this.focus.length >= this.focusCapacity) {
        this.blurFocus(this.focus.slice(-1)[0])
      }
      this.addTo('focus', obj)
    }
  }

  isInFocus (obj) {
    return this.isIn('focus', obj)
  }

  removeFromFocus (obj) {
    this.removeFrom('focus', obj)
  }

  blurFocus (obj) {
    if (obj) {
      this.move('focus', 'blur', obj)
    } else {
      while (this.focus.length > 0) {
        this.blurFocus(this.focus[0])
      }
    }
  }

  // Capacity

  setFocusCapacity (size) {
    this.focusCapacity = parseInt(size, 10)
  }

  removeFocusCapacity () {
    delete this.focusCapacity
  }

  // Blur

  addToBlur (obj) {
    this.removeFrom('focus', obj)
    this.addTo('blur', obj)
  }

  removeFromBlur (obj) {
    this.removeFrom('blur', obj)
  }

  isInBlur (obj) {
    return this.isIn('blur', obj)
  }

  focusBlur (obj) {
    if (obj) {
      this.move('blur', 'focus', obj)
    } else {
      while (this.blur.length > 0) {
        this.focusBlur(this.blur[0])
      }
    }
  }

  // Universal

  addTo (type, obj) {
    if (!this.isIn(type, obj)) {
      this[type].unshift(obj)
    }
  }

  removeFrom (type, obj) {
    const i = this.search(type, obj)
    if (i > -1) {
      this[type].splice(i, 1)
    }
  }

  replaceIn (type, obj) {
    const i = this.search(type, obj)
    if (i > -1) {
      this[type].splice(i, 1, obj)
    }
  }

  clear (type) {
    while (this[type].length > 0) {
      this[type].pop()
    }
  }

  isIn (type, obj) {
    return this.search(type, obj) > -1
  }

  search (type, obj) {
    // let id = this[type].indexOf(obj)
    // if (id < 0) {
    //   this[type].forEach((item, index) => {
    //     if (item.config.id === obj.config.id) {
    //       id = index
    //     }
    //   })
    // }
    return this[type].indexOf(obj)
  }

  move (from, to, obj) {
    if (obj) {
      this.removeFrom(from, obj)
      this.addTo(to, obj)
    } else {
      while (this[from].length > 0) {
        this.addTo(to, this[from].pop())
      }
    }
  }
}
