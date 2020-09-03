function observeOverflow (element, options) {
  const top = element.scrollTop
  const height = element.scrollHeight
  const view = element.offsetHeight
  const bottom = height - top - view
  let info = {
    top: top > options.threshold,
    bottom: bottom > options.threshold
  }
  let prev = Object.assign({}, element.scrollInfo || {})
  let detail = prev
  if (info.top !== prev.top) {
    detail.top = info.top
  }
  if (info.bottom !== prev.bottom) {
    detail.bottom = info.bottom
  }
  element.scrollInfo = info
  element.dispatchEvent(new CustomEvent('scroll-overflow', {
    detail: Object.keys(detail).filter(key => detail[key]).join(' ')
  }))
}

// Watch scroll height changes due to content DOM changes
function startContentObserver (element, callback) {
  if (element.contentObserver) {
    stopContentObserver(element)
  }
  element.contentObserver = new MutationObserver(() => {
    requestAnimationFrame(callback)
  })
  element.contentObserver.observe(element, {
    characterData: true,
    subtree: true,
    childList: true
  })
}

function stopContentObserver (element) {
  if (element.contentObserver) {
    element.contentObserver.disconnect()
    element.contentObserver = null
  }
}

export default {
  bind (el, binding) {
    // Options
    const options = Object.assign({
      threshold: 10
    }, binding.arg === 'options' ? binding.value : {})
    // Handler
    el.observeOverflow = observeOverflow.bind(null, el, options)
    // Watch scroll, resize and children changes
    el.addEventListener('scroll', el.observeOverflow)
    el.addEventListener('observe-overflow', el.observeOverflow)
    window.addEventListener('resize', el.observeOverflow)
    startContentObserver(el, el.observeOverflow)
    // Init
    requestAnimationFrame(() => {
      el.observeOverflow()
    })
  },

  unbind (el) {
    el.removeEventListener('scroll', el.observeOverflow)
    el.removeEventListener('observe-overflow', el.observeOverflow)
    window.removeEventListener('resize', el.observeOverflow)
    stopContentObserver(el)
  }
}
