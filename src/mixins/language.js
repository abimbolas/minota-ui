import { mapGetters } from 'vuex'
import { capitalize } from 'lodash'
import {
  pluralRules,
  pluralPhrases,
  simplePhrases,
  complexPhrases
} from '@/store/i18n'

export default {
  computed: {
    ...mapGetters(['getLocale'])
  },

  methods: {
    languagePlural (number, key) {
      const locale = this.getLocale
      const rule = pluralRules[locale].select(number)
      return pluralPhrases[key][locale][rule]
    },

    languageTranslate (key, options = {}) {
      const locale = this.getLocale
      const phrase = simplePhrases[key][locale]
      return options.capitalize ? capitalize(phrase) : phrase
    },

    languageComplex (key, options) {
      return complexPhrases[key][this.getLocale](options)
    }
  }
}
