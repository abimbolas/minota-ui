export default function isElectron () {
  return Boolean(navigator.userAgent.match(/Electron/))
}
