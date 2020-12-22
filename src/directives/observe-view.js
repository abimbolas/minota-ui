export default {
  bind (el, binding) {
    const threshold = binding.arg === 'threshold' ? binding.value : 0.625
    if (Array.isArray(threshold)) {
      el.viewObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          el.dispatchEvent(new CustomEvent('change-view', {
            detail: {
              ratio: entry.intersectionRatio,
            }
          }))
        })
      }, { threshold })
    } else {
      el.viewObserver = new IntersectionObserver(entries => {
        const isVisible = entries.find(entry => entry.isIntersecting) || false
        el.dispatchEvent(new CustomEvent(`${isVisible ? 'enter' : 'exit'}-view`))
      }, { threshold })
    }
    el.viewObserver.observe(el)
  },

  unbind (el) {
    el.viewObserver.disconnect()
  }
}
