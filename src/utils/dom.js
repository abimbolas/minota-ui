export function previousBlockElementsCount (targetElement, rootSelector) {
  const rootElement = targetElement.closest(rootSelector)
  let elements = elementList(rootElement)
  // Take all elements before target element
  elements = elements.slice(0, elements.indexOf(targetElement))
  // Cut unneeded elements
  elements = elements
    // cut root element
    .filter(element => element !== rootElement)
    // keep all block elements
    .filter(element => [
      'div',
      'p',
      'li',
      'section',
      'article',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6'
    ].indexOf(element.tagName.toLowerCase()) > -1)
  return elements.length
}

function elementList (element) {
  let elements = [element]
  if (element.children.length) {
    Array.from(element.children).forEach(child => {
      elements = elements.concat(elementList(child))
    })
  }
  return elements
}
