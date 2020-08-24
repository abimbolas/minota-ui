export default {
  bind (el, binding) {
    const threshold = binding.arg === 'threshold' ? binding.value : 0.625
    el.viewObserver = new IntersectionObserver(entries => {
      const isVisible = entries.find(entry => entry.isIntersecting) || false
      el.dispatchEvent(new CustomEvent(`${isVisible ? 'enter' : 'exit'}-view`))
    }, { threshold })
    el.viewObserver.observe(el)
  },

  unbind (el) {
    el.viewObserver.disconnect()
  }
}
