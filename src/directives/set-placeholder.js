export default {
  bind (element, { value }) {
    const input = element.querySelector('input')
    const textarea = element.querySelector('textarea')
    if (input) {
      input.setAttribute('placeholder', value)
    } else if (textarea) {
      textarea.setAttribute('placeholder', value)
    }
  }
}
