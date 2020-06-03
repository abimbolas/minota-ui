<template lang="pug">
  .minota-note(v-bind:mode="mode" v-bind:selected="selected")
    textarea(
      placeholder="Что в голове?"
      v-model="note.content"
      v-on:focus="onFocus"
      v-on:click="onClick")
    input(
      type="checkbox"
      v-show="mode === 'edit'"
      v-bind:value="selected"
      v-on:input="onSelectInput()")
</template>

<script>
export default {
  name: 'Note',

  props: {
    note: {
      type: Object,
      required: true,
      default () {
        return {}
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

  data () {
    return {
      checked: false
    }
  },

  watch: {
    'note.content' () {
      this.$emit('update', this.note)
    },
    'selected' (selected) {
      this.$el.querySelector('input[type="checkbox"]').checked = selected
    }
  },

  methods: {
    onFocus () {
      if (this.mode !== 'edit') {
        this.$emit('focus', this.note)
        setTimeout(() => {
          this.$el.querySelector('textarea').focus()
        })
      }
    },

    onClick () {
      if (this.mode === 'edit') {
        this.onSelectInput()
      }
    },

    onSelectInput () {
      this.$emit('select', this.note)
    }
  }
}
</script>

<style lang="stylus">
.minota-note
  margin 0.5rem 0
  &[mode="edit"]
    display flex
    justify-content flex-start
    input
      width 2rem
      height 2rem
      margin 0 0.5rem
    textarea
      cursor pointer

.minota-note__actions
  font-size 80%
  display none
  a
    margin-left 1rem

</style>
