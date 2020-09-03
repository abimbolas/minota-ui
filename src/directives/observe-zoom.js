function observeZoom (element, event) {
  if (event.ctrlKey && event.deltaY !== 0) {
    event.preventDefault()
    element.dispatchEvent(new CustomEvent(
      `zoom-${event.deltaY < 0 ? 'in' : 'out'}`,
      { detail: event.deltaY }
    ))
  }
}

function stopZoom (element, event) {
  console.log(event)
  element.dispatchEvent(new CustomEvent('zoom-stop'))
}

export default {
  bind (el) {
    el.observeZoom = observeZoom.bind(null, el)
    el.stopZoom = stopZoom.bind(null, el)
    el.removeEventListener('wheel', el.observeZoom)
    el.addEventListener('wheel', el.observeZoom)
  },

  unbind (el) {
    el.removeEventListener('wheel', el.observeZoom)
  }
}
