function checkCursorPosition (el) {
  const selection = document.getSelection()
  let isCaret = selection.type.toLowerCase() === 'caret'
  let isTextNode = selection.focusNode && selection.focusNode.nodeType === 3 // textNode
  let isUniqueEnough = selection.focusNode.data && selection.focusNode.data.length > 11
  if (isCaret && isTextNode && isUniqueEnough) {
    let total = el.innerText.length
    let fromStart = el.innerText.indexOf(selection.focusNode.textContent) + selection.focusOffset
    let fromEnd = total - fromStart
    let detail = { total, fromStart, fromEnd }
    if (fromStart > 0) {
      el.dispatchEvent(new CustomEvent('cursor-position', { detail }))
    }
  }
}

export default {
  bind (el) {
    el.checkCursorPosition = checkCursorPosition.bind(this, el)
    el.addEventListener('click', el.checkCursorPosition)
    el.addEventListener('keydown', el.checkCursorPosition)
    el.addEventListener('focus', el.checkCursorPosition)
  },

  unbind (el) {
    el.removeEventListener('click', el.checkCursorPosition)
    el.removeEventListener('keydown', el.checkCursorPosition)
    el.removeEventListener('focus', el.checkCursorPosition)
  }
}
