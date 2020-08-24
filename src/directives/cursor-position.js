function checkCursorPosition (el, threshold, event) {
  const selection = document.getSelection()
  if (selection.focusNode) {
    let isCaret = selection.type.toLowerCase() === 'caret'
    let isTextNode = selection.focusNode && selection.focusNode.nodeType === 3 // textNode
    let isUniqueEnough = selection.focusNode.data && selection.focusNode.data.length > 11
    if (isCaret && isTextNode && isUniqueEnough) {
      let total = el.innerText.length
      let fromStart = el.innerText.indexOf(selection.focusNode.textContent) + selection.focusOffset
      let fromEnd = total - fromStart
      if (fromStart <= threshold.start) {
        el.dispatchEvent(new CustomEvent('cursor-near-start'))
      } else if (fromEnd <= threshold.end) {
        el.dispatchEvent(new CustomEvent('cursor-near-end'))
      }
    }
  }
}

function startContentObserver (element, callback) {
  if (element.cursorPositionContentObserver) {
    stopContentObserver(element.cursorPositionContentObserver)
  }
  element.cursorPositionContentObserver = new MutationObserver(() => {
    requestAnimationFrame(() => {
      callback()
    })
  })
  element.cursorPositionContentObserver.observe(element, {
    characterData: true,
    subtree: true,
    childList: true
  })
}

function stopContentObserver (element) {
  if (element.cursorPositionContentObserver) {
    element.cursorPositionContentObserver.disconnect()
    element.cursorPositionContentObserver = null
  }
}

export default {
  bind (el, binding) {
    let threshold = binding.arg === 'threshold' ? binding.value : {
      start: 100,
      end: 200
    }
    el.checkCursorPosition = checkCursorPosition.bind(this, el, threshold)
    startContentObserver(el, el.checkCursorPosition)
  },

  unbind (el) {
    stopContentObserver(el)
  }
}
