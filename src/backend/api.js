export default class BackendAPI {
  getNotes () {}
  getNote () {}
  postNotes () {}
  postNote () {}
  putNotes () {}
  putNote () {}
  deleteNotes () {}
  deleteNote () {}
  onReady () {}
  init () {
    return new Promise(resolve => {
      console.log('Init Backend')
      resolve()
    })
  }
  destory () {
    return new Promise(resolve => {
      console.log('Destroy Backend')
      resolve()
    })
  }
}
