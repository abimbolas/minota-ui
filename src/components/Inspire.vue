<template lang="pug">
  .minota-inspire(v-bind:variant="current")
    .minota-inspire__phrase {{ variants[current].phrase }}
    .minota-inspire__image(v-bind:style="{ 'background-image': variants[current].url }")
</template>

<script>
export default {
  name: 'Inspire',

  data () {
    return {
      current: 0,
      variants: [
        {
          phrase: 'Раскольников бахнул бабку',
          url: require('@/assets/images/signature-dostoevsky.png')
        },
        {
          phrase: 'Революция это архиважно',
          url: require('@/assets/images/signature-lenin.png')
        },
        {
          phrase: 'Сюртуки эксплуатировали, эксплуатировали, да не выэксплуатировали',
          url: require('@/assets/images/signature-marx.png')
        },
        {
          phrase: 'Мой дядя самых честных грабил',
          url: require('@/assets/images/signature-pushkin.png')
        },
        {
          phrase: 'Безухов тр&хнул Наташу Ростову',
          url: require('@/assets/images/signature-tolstoy.png')
        }
      ].map(item => {
        return {
          phrase: item.phrase,
          url: `url(${item.url})`
        }
      })
    }
  },

  created () {
    const mutations = {
      addToTable: () => {
        setTimeout(() => {
          this.shuffleVariant()
        }, 1000)
      }
    }
    this.unsubscribeMutations = this.$store.subscribe(mutation => {
      if (mutations[mutation.type]) {
        mutations[mutation.type](mutation.payload)
      }
    })
  },

  mounted () {
    this.shuffleVariant()
  },

  beforeDestroy () {
    this.unsubscribeMutations()
  },

  methods: {
    shuffleVariant () {
      this.current = Math.floor(Math.random() * this.variants.length)
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'

.minota-inspire
  width 100%

.minota-inspire__phrase
  max-width 25rem
  margin 0 auto 2rem auto
  text-align center
  color alpha(black, low-emphasis)

.minota-inspire__image
  height 100px
  width 100%
  background-size contain
  background-repeat no-repeat
  background-position center
  // background-color alpha(brown, 0.1)
</style>
