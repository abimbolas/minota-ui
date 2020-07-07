export default class Workspace {
  constructor ({ blur = [], focus = [] } = {}) {
    this.blur = blur
    this.focus = focus
  }

  // Focus

  addToFocus (obj, { focusCapacity = 1, append = false } = {}) {
    if (this._isIn('focus', obj)) {
      this._replaceIn('focus', obj)
    }
    this._removeFrom('blur', obj)
    while (this.focus.length >= focusCapacity) {
      console.log('focus capacity')
      this.blurFocus(append ? this.focus[0] : this.focus.slice(-1)[0])
    }
    this._addTo('focus', obj, { append })
  }

  replaceInFocus (obj) {
    this._replaceIn('focus', obj)
  }

  isInFocus (obj) {
    return this._isIn('focus', obj)
  }

  removeFromFocus (obj) {
    this._removeFrom('focus', obj)
  }

  blurFocus (obj = null, { append = false } = {}) {
    this._move('focus', 'blur', obj, { append })
  }

  clearFocus () {
    this._clear('focus')
  }

  // Blur

  addToBlur (obj, { append = false } = {}) {
    if (this._isIn('blur', obj)) {
      this._replaceIn('blur', obj)
    }
    this._removeFrom('focus', obj)
    this._addTo('blur', obj, { append })
  }

  replaceInBlur (obj) {
    this._replaceIn('blur', obj)
  }

  removeFromBlur (obj) {
    this._removeFrom('blur', obj)
  }

  isInBlur (obj) {
    return this._isIn('blur', obj)
  }

  focusBlur (obj = null, { append = false } = {}) {
    this._move('blur', 'focus', obj, { append })
  }

  clearBlur () {
    this._clear('blur')
  }

  // Universal

  _addTo (type, obj, { append = false } = {}) {
    if (!this._isIn(type, obj)) {
      this[type][append ? 'push' : 'unshift'](obj)
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

  _move (from, to, obj, { append = false } = {}) {
    if (obj) {
      this._removeFrom(from, obj)
      this._addTo(to, obj, { append })
    } else {
      while (this[from].length > 0) {
        this._clear(from)
        this._addTo(to, this[from][append ? 'shift' : 'pop'](), { append })
      }
    }
  }
}
