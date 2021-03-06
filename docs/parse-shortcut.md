mounted () {
-    // Check url query for known commands
-    this.parseQueryForCommands([
-      'createNote'
-    ])
-    // Listen keyboard for commands
-    this.startListenShortcutsForCommands({
-      'ctrlKey+shiftKey+KeyN': 'createNote'
-    })
-  },
-
-  beforeDestroy () {
-    // Cleanup shortcut listener
-    this.stopListenShortcutsForCommands()
-    console.log('Minotá UI destroyed')
-  },
-
-  methods: {
-    createNote () {
-      // Но как запускать эту команду?
-      // + с пути урл
-      // + с клавиатуры
-      // - кнопкой с экрана
-      this.createNoteAction().then(note => {
-        this.note = note
-      })
-    },
-    parseQueryForCommands (commands) {
-      return commands.filter(command => {
-        if (command in this.$route.query) {
-          let query = { ...this.$route.query }
-          delete query[command]
-          this.$router.replace({ query })
-          return true
-        }
-      }).forEach(command => {
-        this[command]()
-      })
-    },
-    parseShortcutForCommands (commands, emitEvent, shortcut) {
-      const triggered = Object.keys(commands).find(command => {
-        return command.split('+').every(key => {
-          if (key.match(/^Key/)) {
-            return shortcut.code === key
-          } else {
-            return shortcut[key]
-          }
-        })
-      })
-      if (triggered) {
-        bus.$emit(emitEvent, commands[triggered])
-      }
-    },
-    startListenShortcutsForCommands (commands) {
-      const SHORTCUT_EVENT = 'SHORTCUT_EVENT'
-      let parseShortcut = this.parseShortcutForCommands.bind(
-        this, commands, SHORTCUT_EVENT
-      )
-      document.addEventListener('keyup', parseShortcut)
-      bus.$on(SHORTCUT_EVENT, command => this[command]())
-      this.stopListenShortcutsForCommands = function () {
-        document.removeEventListener('keyup', parseShortcut)
-        bus.$off(SHORTCUT_EVENT)
-      }
-    },
-    ...mapActions([
-      // 'addStorageAction',
-      // 'removeStorageAction',
-      'createNoteAction'
-    ])
}
