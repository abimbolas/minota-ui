export const regexp = {
  id: '[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}'
}
export function matchId (str) {
  const match = str.match(new RegExp(regexp.id))
  return match ? match[0] : false
}
