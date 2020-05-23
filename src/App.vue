<template lang="pug">
  .minota-app
    .minota-actions
      a(v-on:click.prevent="onCreate" href) Создать

      a(v-on:click.prevent="onRemove" href) Убрать

      a(v-on:click.prevent="onGet" href) Достать ({{ workspace.blur.length }})

    note-component(
      v-if="workspace.focus.length"
      v-for="note in workspace.focus"
      v-bind:key="note.id"
      v-bind:note="note")
</template>

<script>
import Workspace from '@/models/workspace'
import NoteComponent from '@/components/Note'
export default {
  name: 'App',

  components: {
    NoteComponent
  },

  data () {
    return {
      workspace: new Workspace(),
      behaviorType: {
        create: 'replace'
      }
    }
  },

  created () {
    console.log('Minotá UI created')
  },

  beforeDestroy () {
    console.log('Minotá UI destroyed')
  },

  methods: {
    onCreate () {
      if (this.behaviorType.create === 'replace') {
        // remove all
        this.workspace.blurFocus()
        // add new lonely to focus
        this.workspace.addToFocus({
          content: '',
          id: parseInt(Math.random() * 100000, 10)
        })
      } else if (this.behaviorType.create === 'add') {
        // add to focus, extending capacity
        this.workspace.addToFocus({
          content: '',
          id: parseInt(Math.random() * 100000, 10)
        }, { extendFocusCapacity: true })
      }
      console.log('Note created', this.workspace.focus.slice(-1)[0])
    },

    onRemove () {
      const l = this.workspace.focus.length
      this.workspace.blurFocus()
      console.log(`Note${l > 1 ? 's' : ''} removed`)
    },

    onGet () {
      const l = this.workspace.blur.length
      this.workspace.focusBlur()
      console.log(`Note${l > 1 ? 's' : ''} got`)
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'
html
body
  font-size 16px
  line-height 1.5rem
  font-family sans-family
  // margin 0
  padding 0

textarea
input
button
  display block
  font-family mono-family
  font-size inherit
  line-height inherit
  outline none
  width 100%
  max-width 45rem
  padding 0.5rem
  border solid gainsboro 1px
  box-sizing border-box
  min-height 300px

.minota-actions
  margin 1rem 0
  a
    margin 0 0.5rem

</style>
