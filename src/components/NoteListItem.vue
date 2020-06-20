<template lang="pug">
  .minota-note-list-item(v-bind:mode="mode" v-on:click="onClick()")
    .minota-note-list-item__select(v-if="mode === 'edit'")
      input(type="checkbox" v-on:input="onToggleSelected()")
    .minota-note-list-item__content {{ note.content }}
</template>

<script>
import Note from '@/models/note'

export default {
  name: 'NoteListItem',

  props: {
    note: {
      type: Object,
      required: true,
      default () {
        return new Note()
      }
    },
    mode: {
      type: String,
      required: false,
      default: ''
    },
    selected: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  watch: {
    'selected' (value) {
      this.onToggleSelected(value)
    }
  },

  methods: {
    onClick () {
      if (this.mode !== 'edit') {
        this.$emit('open', this.note)
      } else {
        this.onToggleSelected()
      }
    },

    onToggleSelected (value) {
      const input = this.$el.querySelector('input[type="checkbox"]')
      if (input) {
        input.checked = value !== undefined ? value : !input.checked
      }
      this.$emit(input.checked ? 'select' : 'unselect', this.note)
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'

.minota-note-list-item
  padding 0.5rem
  border-radius 0.25rem
  border solid gainsboro 1px
  max-height 14rem
  overflow-y hidden
  cursor pointer
  display flex
  // font-family mono-family
  & + &
    margin-top 1rem

.minota-note-list-item__content
  white-space pre-wrap

.minota-note-list-item__select
  display flex
  justify-content flex-end
  margin-right 0.5rem
  input
    margin 0
    width 1.5rem
    height 1.5rem
</style>
