export default function parseStorageUrl (url) {
  const parts = url.split('://')
  const protocol = parts[0]
  let path = protocol.match(/^http/) ? url : parts[1]
  if (path.match(/^\/[a-zA-Z]+:/)) {
    path = path.slice(1)
  }
  return {
    protocol,
    path
  }
}
