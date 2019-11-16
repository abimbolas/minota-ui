const state = {
  locale: 'ru'
}

const getters = {
  getLocale: state => state.locale
}

const mutations = {
  setLocale (state, payload) {
    state.locale = payload.locale
  }
}

export default {
  state,
  getters,
  mutations
}

export const pluralRules = {
  ru: new Intl.PluralRules('ru'),
  en: new Intl.PluralRules('en')
}

export const pluralPhrases = {
  'items': {
    ru: {
      one: 'элемент',
      few: 'элемента',
      many: 'элементов',
      other: 'элементов'
    },
    en: {
      one: 'item',
      other: 'items'
    }
  },

  'notes': {
    ru: {
      one: 'заметка',
      few: 'заметок',
      many: 'заметок',
      other: 'заметок'
    },
    en: {
      one: 'note',
      other: 'notes'
    }
  },

  'withNotes': {
    ru: {
      one: 'заметкой',
      few: 'заметками',
      many: 'заметками',
      other: 'заметок'
    },
    en: {
      one: 'note',
      other: 'notes'
    }
  }
}

export const simplePhrases = {
  'delete': {
    ru: 'удалить',
    en: 'delete'
  },
  'areYouSureTo': {
    ru: 'вы уверены, что хотите',
    en: 'are you sure to'
  },
  'with': {
    ru: 'c',
    en: ' with'
  }
}

export const complexPhrases = {
  'modalBodyDeleteItems': {
    ru (opts) {
      const p1 = `Вы уверены, что хотите удалить`
      const items = `${opts.items}&nbsp;${pluralPhrases.items.ru[pluralRules.ru.select(opts.items)]}`
      const notes = `${opts.notes}&nbsp;${pluralPhrases.withNotes.ru[pluralRules.ru.select(opts.notes)]}`
      let focused = '?'
      if (opts.focused === opts.notes) {
        focused = `<em>, котор${opts.notes > 1 ? 'ые' : 'ая'} на столе?</em>`
      } else if (opts.focused) {
        focused = `<em>, ${opts.focused} из которых на столе?</em>`
      }
      return `${p1} ${items} с <strong>${notes}</strong>${focused}`
    },
    en (opts) {
      return `Are you sure to delete 4 items with 67 notes, 3 of which are on table?`
    }
  }
}
