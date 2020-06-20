export default class Workspace {
  constructor ({ blur = [], focus = [] } = {}) {
    this.blur = blur
    this.focus = focus
  }

  // Focus

  addToFocus (obj, { focusCapacity = 1 } = {}) {
    this._removeFrom('blur', obj)
    this._addTo('focus', obj)
    while (this.focus.length > focusCapacity) {
      this.blurFocus(this.focus.slice(-1)[0])
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
        this.blurFocus(this.focus.slice(-1)[0])
      }
    }
  }

  clearFocus () {
    this._clear('focus')
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
        this.focusBlur(this.blur.slice(-1)[0])
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
    } else {
      this._replaceIn(type, obj)
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
        this._addTo(to, this[from].shift())
      }
    }
  }
}
