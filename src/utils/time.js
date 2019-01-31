import { capitalize } from 'micro-dash'
import { months } from './i18n'

const timeFormat = {
  l: function (t, locale) {
    const d = t.getDate()
    const m = months[locale].short[t.getMonth()]
    if (locale === 'en') {
      return `${capitalize(m)} ${d}`
    } else {
      return `${d} ${m}`
    }
  },

  ll: function (t, locale) {
    const d = t.getDate()
    const m = months[locale].long[t.getMonth()]
    if (locale === 'en') {
      return `${capitalize(m)} ${d}`
    } else {
      return `${d} ${m}`
    }
  },

  'dd.mm.yy': function (t) {
    const d = ('0' + t.getDate()).slice(-2)
    const m = ('0' + (t.getMonth() + 1)).slice(-2)
    let result = `${d}.${m}`
    if (t.getFullYear() !== new Date().getFullYear()) {
      const y = t
        .getFullYear()
        .toString()
        .slice(-2)
      result = `${result}.${y}`
    }
    return result
  },

  'yyyy-mm-dd': function (t) {
    const d = ('0' + t.getDate()).slice(-2)
    const m = ('0' + (t.getMonth() + 1)).slice(-2)
    const y = t.getFullYear().toString()
    return `${y}-${m}-${d}`
  }
}

export function time (t) {
  const time = new Date(t)
  return {
    format (type, locale = 'ru') {
      return timeFormat[type](time, locale)
    }
  }
}
