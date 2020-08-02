export function getNoun (n, one, few, many, zero) {
  if (n === 0 && zero) {
    return zero
  }
  let number = Math.abs(n) % 100
  if (number >= 5 && number <= 20) {
    return many
  }
  number = number % 10
  if (number === 1) {
    return one
  } else if (number >= 2 && number <= 4) {
    return few
  } else {
    return many
  }
}
