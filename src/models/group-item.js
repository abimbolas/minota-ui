export default class GroupItemInterface {
  get leaf () {}
  get path () {}
  get key () {
    return this._key
  }
  set key (key) {
    this._key = key
  }
}
