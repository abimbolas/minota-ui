let timeoutId

function scrollTop (top) {
  if (top !== undefined) {
    document.scrollingElement.scrollTop = top
  } else {
    return document.scrollingElement.scrollTop
  }
}

export function smoothScrollTop () {
  clearTimeout(timeoutId)
  let top = 0.8 * Math.abs(scrollTop())
  if (top > 5) {
    scrollTop(top)
    setTimeout(smoothScrollTop, 20)
  } else {
    scrollTop(0)
  }
}
