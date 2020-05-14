export default class Workspace {
  constructor ({ focusCapacity = 1, blur = [], focus = [] } = {}) {
    this.blur = blur
    this.focus = focus
    this.focusCapacity = focusCapacity
  }

  // Focus

  addToFocus (obj, { extendFocusCapacity = false } = {}) {
    this._removeFrom('blur', obj)
    this._addTo('focus', obj)
    if (extendFocusCapacity) {
      this.focusCapacity = this.focus.length + 1
    } else {
      while (this.focus.length > this.focusCapacity) {
        this.blurFocus(this.focus.slice(-1)[0])
      }
    }
  }

  isInFocus (obj) {
    return this._isIn('focus', obj)
  }

  removeFromFocus (obj) {
    this._removeFrom('focus', obj)
  }

  blurFocus (obj) {
    if (obj) {
      this._move('focus', 'blur', obj)
    } else {
      while (this.focus.length > 0) {
        this.blurFocus(this.focus[0])
      }
    }
  }

  clearFocus () {
    this._clear('focus')
  }

  // Capacity

  get focusCapacity () {
    return this._focusCapacity
  }

  set focusCapacity (size) {
    this._focusCapacity = parseInt(size, 10)
  }

  // Blur

  addToBlur (obj) {
    this._removeFrom('focus', obj)
    this._addTo('blur', obj)
  }

  removeFromBlur (obj) {
    this._removeFrom('blur', obj)
  }

  isInBlur (obj) {
    return this._isIn('blur', obj)
  }

  focusBlur (obj) {
    if (obj) {
      this._move('blur', 'focus', obj)
    } else {
      while (this.blur.length > 0) {
        this.focusBlur(this.blur[0])
      }
    }
  }

  clearBlur () {
    this._clear('blur')
  }

  // Universal

  _addTo (type, obj) {
    if (!this._isIn(type, obj)) {
      this[type].unshift(obj)
    }
  }

  _removeFrom (type, obj) {
    const i = this._search(type, obj)
    if (i > -1) {
      this[type].splice(i, 1)
    }
  }

  _replaceIn (type, obj) {
    const i = this._search(type, obj)
    if (i > -1) {
      this[type].splice(i, 1, obj)
    }
  }

  _clear (type) {
    while (this[type].length > 0) {
      this[type].pop()
    }
  }

  _isIn (type, obj) {
    return this._search(type, obj) > -1
  }

  _search (type, obj) {
    return this[type].indexOf(obj)
  }

  _move (from, to, obj) {
    if (obj) {
      this._removeFrom(from, obj)
      this._addTo(to, obj)
    } else {
      while (this[from].length > 0) {
        this._addTo(to, this[from].pop())
      }
    }
  }
}
