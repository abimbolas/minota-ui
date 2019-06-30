const state = {
  quotes: [
    {
      text: 'Раскольников грохнул бабку',
      image: require('@/assets/images/signature-dostoevsky.png')
    },
    {
      text: 'Революция это архиважно',
      image: require('@/assets/images/signature-lenin.png')
    },
    {
      text: 'Сюртуки эксплуатировали, эксплуатировали, да не выэксплуатировали',
      image: require('@/assets/images/signature-marx.png')
    },
    {
      text: 'Мой дядя самых честных грабил',
      image: require('@/assets/images/signature-pushkin.png')
    },
    {
      text: 'Безухов тр&хнул Наташу Ростову',
      image: require('@/assets/images/signature-tolstoy.png')
    }
  ]
}

const getters = {
  getPlaceholderQuotes: state => state.quotes
}

export default {
  state,
  getters
}
