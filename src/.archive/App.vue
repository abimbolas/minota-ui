<template lang="pug">
  .minota-app
    router-view
</template>

<script>
import bus from '@/event-bus'

export default {
  name: 'Minota',

  created () {
    console.log('Minotá App created')
  },

  mounted () {
    // Check url query for known commands
    this.parseQueryForCommands([
      'createNote'
    ])
    // Listen keyboard for commands
    this.startListenShortcutsForCommands({
      'ctrlKey+shiftKey+KeyN': 'createNote'
    })
    console.log('Minotá UI mounted')
  },

  beforeDestroy () {
    // Cleanup shortcut listener
    this.stopListenShortcutsForCommands()
    console.log('Minotá UI destroyed')
  },

  methods: {
    createNote () {
      // Но как запускать эту команду?
      // + с пути урл
      // + с клавиатуры
      // - кнопкой с экрана
      console.log('create note')
    },
    parseQueryForCommands (commands) {
      return commands.filter(command => {
        if (command in this.$route.query) {
          let query = { ...this.$route.query }
          delete query[command]
          this.$router.replace({ query })
          return true
        }
      }).forEach(command => {
        this[command]()
      })
    },
    parseShortcutForCommands (commands, emitEvent, shortcut) {
      const triggered = Object.keys(commands).find(command => {
        return command.split('+').every(key => {
          if (key.match(/^Key/)) {
            return shortcut.code === key
          } else {
            return shortcut[key]
          }
        })
      })
      if (triggered) {
        bus.$emit(emitEvent, commands[triggered])
      }
    },
    startListenShortcutsForCommands (commands) {
      const SHORTCUT_EVENT = 'SHORTCUT_EVENT'
      let parseShortcut = this.parseShortcutForCommands.bind(
        this, commands, SHORTCUT_EVENT
      )
      document.addEventListener('keyup', parseShortcut)
      bus.$on(SHORTCUT_EVENT, command => this[command]())
      this.stopListenShortcutsForCommands = function () {
        document.removeEventListener('keyup', parseShortcut)
        bus.$off(SHORTCUT_EVENT)
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'

html
body
  font-size 16px
  line-height 1.5
  font-family sans-family
  margin 0
  padding 0
  overflow auto
  min-height 100vh
  scroll-snap-type both proximity

html
  background-color background-main
</style>

<style scoped lang="stylus">
.minota-app
  box-sizing border-box
  min-height 100vh
  min-width 100vw
</style>
