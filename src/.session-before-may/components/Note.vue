<template lang="pug">
  .minota-note(
    elevation="0"
    v-bind:class="{ 'is-menu-opened': isMenuOpened }")

    .minota-note__header

      //- Actions
      .minota-note-actions
        //- button.button.icon-button(
          title="Note is pinned. Click to unpin"
          v-if="note.config.pinned"
          v-on:click="unpinNote()")
          i.material-icons star
        //- button.button.icon-button(
          title="Menu"
          v-on:click="isMenuOpened = !isMenuOpened")
          i.material-icons(v-if="isMenuOpened") keyboard_arrow_up
          i.material-icons(v-else="isMenuOpened") keyboard_arrow_down

      //- Menu
      .minota-list.minota-list__menu(v-if="isMenuOpened")
        menu-item-component
          template(slot="title") Operative - Archive

        menu-item-component
          template(slot="title") Archive

        menu-item-component
          template(slot="title") Draft - Clean

        menu-item-component
          template(slot="title") Clean

        menu-item-component
          template(slot="title") Detailization - Generalization (level of detail)

        menu-item-component
          template(slot="title") General

        .minota-menu-item__divider &nbsp;

        menu-item-component
          template(slot="title") Refresh

        menu-item-component
          template(slot="title") Extract

        menu-item-component(v-on:click="onNewAboutTheSame($event)")
          //- template(slot="icon")
            i.material-icons replay
          template(slot="title") Continue topic in new note

        menu-item-component(v-on:click="onTakeIntoSeparate($event)")
          //- template(slot="icon")
            i.material-icons call_made
          template(slot="title") Extract content into new topic

        menu-item-component(v-on:click="onSetDraftStartClean($event)")
          //- template(slot="icon")
            i.material-icons flip_to_front
          template(slot="title") Draft this note, start new clean

        menu-item-component(v-on:click="onClose($event)")
          //- template(slot="icon")
            i.material-icons close
          template(slot="title") Close

        //- .minota-menu-item__divider &nbsp;

        //- .minota-menu-item__divider &nbsp;

        //- menu-item-component
          //- template(slot="icon") &nbsp;
          //- template(slot="icon")
            i.material-icons delete
          template(slot="title") Delete

        //- .minota-menu-item__divider &nbsp;

        div(style="display: flex; padding: 0.5rem 0.5rem 0 1rem")
          //- .button.text-button
            //- i.material-icons star
            span Pin
          //- .button.text-button
            //- i.material-icons move_to_inbox
            span Archive
          .button.text-button(style="margin-left: auto;")
            //- i.material-icons delete
            span Archive note

    .minota-note__body(
      v-long-click="375"
      v-on:long-click="$emit('mode', 'menu')"
      v-on:normal-click="onNormalClick($event)")
      //- Editor
      editor-component.minota-note-editor(
        v-model="content"
        v-on:edit-last-lines="onEditLastLines"
        v-bind:focus-on="focusEventName"
        v-bind:cursor="cursor")
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import dayjs from 'dayjs'
import { topicDelimiter } from '@/store/ui'
import EditorComponent from '@/components/Editor'
import ListItemComponent from '@/components/ListItem'
import MenuItemComponent from '@/components/MenuItem'
import longClick from '@/directives/long-click'
import bus from '@/event-bus'

export default {
  name: 'Note',

  components: {
    EditorComponent,
    ListItemComponent,
    MenuItemComponent
  },

  directives: {
    longClick
  },

  props: {
    note: {
      type: Object,
      required: false,
      default () {
        return null
      }
    }
  },

  data () {
    return {
      focusEventName: 'focus' + parseInt(Math.random() * 10000, 10),
      content: '',
      cursor: {
        line: 0,
        ch: 0
      },
      isMenuOpened: false
    }
  },

  computed: {
    created () {
      console.log(dayjs(this.note.config.date).format('DD MMMM YYYY'))
      return dayjs(this.note.config.date).format('DD MMMM YYYY')
    },
    ...mapGetters([
      'getContext'
    ])
  },

  watch: {
    'note' (note) {
      this.setContentFromNote()
      this.resetCursor()
      bus.$emit(this.focusEventName)
    },
    'content' (value) {
      this.setContentToNote(value)
    }
  },

  created () {
    // React to context change
    const mutations = {
      setContext: payload => {
        console.log('setContext', payload)
      }
    }
    this.unsubscribeMutations = this.$store.subscribe(mutation => {
      if (mutations[mutation.type]) {
        mutations[mutation.type](mutation.payload)
      }
    })
  },

  beforeDestroy () {
    this.unsubscribeMutations()
  },

  mounted () {
    this.setContentFromNote()
    this.resetCursor()
  },

  methods: {
    getContentFromNote () {
      if (this.getContext) {
        const clone = this.note.clone()
        clone.topic = clone.topic.replace(
          new RegExp(`^${this.getContext}(${topicDelimiter})?`),
          ''
        )
        return clone.editableContent
      } else {
        return this.note.editableContent
      }
    },

    setContentToNote (value) {
      clearTimeout(this.updateNoteActionTimeout)
      this.updateNoteActionTimeout = setTimeout(() => {
        const update = this.note.clone()
        update.editableContent = value
        if (this.getContext) {
          update.topic = `${this.getContext}${update.topic ? topicDelimiter + update.topic : ''}`
        }
        this.updateNoteAction({ note: update })
      }, 1000)
    },

    setContentFromNote () {
      this.content = this.getContentFromNote()
    },

    openMenu () {
      // this.$emit('open-menu', this.note)
    },

    // unpinNote () {
    //   const update = this.note.clone()
    //   update.config.pinned = false
    //   this.updateNoteAction({ note: update })
    // },

    resetCursor () {
      // Set cursor to edit content (2nd line), not topic
      if (this.note.topic) {
        this.cursor = {
          line: 2,
          ch: 0
        }
      } else {
        this.cursor = {
          line: 0,
          ch: 0
        }
      }
    },

    onNormalClick ($event) {
      bus.$emit(this.focusEventName)
    },

    onNewAboutTheSame ($event) {
      // Start new note, which has history
      // Right now, just create note with same topic
      this.$router.push({
        name: 'new',
        query: {
          topic: this.note.topic
        }
      })
    },

    onTakeIntoSeparate ($event) {
      // Start new note, but
      // 1. Have a chance to set topic beforehand
      // 2. Should contain initial text as a draft
      this.openModalAction({
        modal: {
          component: 'InputTextModal',
          placeholder: 'Provide new topic for the note',
          inputText: this.note.topic,
          header: 'Set new topic'
        }
      }).then(topic => {
        console.log('resulting topic', topic)
        if (topic) {
          this.newNoteAction({
            note: {
              config: { topic },
              content: this.note.content
            }
          }).then(note => {
            return this.openNoteAction({ note })
          }).then(done => {
            console.log('done')
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },

    onSetDraftStartClean ($event) {
      console.log('onSetDraftStartClean')
    },

    onTogglePinned () {
      console.log('toggle pin')
      const update = this.note.clone()
      update.config.pinned = !update.config.pinned
      this.updateNoteAction({ note: update })
    },

    onToggleArchived () {
      console.log('toggle archived')
      // const update = this.note.clone()
      // update.config.archived = !update.config.archived
      // this.updateNoteAction({ note: update })
    },

    onToggleDeleted () {
      console.log('toggle deleted')
    },

    onClose ($event) {
      this.closeNoteAction({ note: this.note })
    },

    onEditLastLines () {
      clearTimeout(this.onEditLastLinesTimeout)
      this.onEditLastLinesTimeout = setTimeout(() => {
        window.scrollTo(0, document.documentElement.scrollHeight)
      })
    },

    ...mapMutations([
      'removeFromTableFocus'
    ]),
    ...mapActions([
      'updateNoteAction',
      'closeNoteAction',
      'openModalAction',
      'newNoteAction',
      'openNoteAction'
    ])
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'
@import '~@/assets/styles/material'

.minota-note
  // background-color white
  border-radius 0.5rem
  max-width 46rem
  box-sizing content-box
  min-width: 320px
  z-index 1
  position relative
  box-sizing border-box
  cursor text

  @media (min-width screen-sm)
    max-width 46rem
  @media (min-width screen-md)
    max-width 48rem
  @media (min-width screen-lg)
    max-width 50rem

  .minota-note__body
    padding 1rem 1rem 1.5rem 1.5rem
    margin-top -3.5rem
    @media (min-width screen-sm)
      padding 2.5rem 3rem
    @media (min-width screen-md)
      padding 3rem 4rem
    @media (min-width screen-lg)
      padding 4rem 5rem

  .minota-note__header
    padding 0.5rem
    min-height 3rem
    position relative

  &.is-menu-opened
    .minota-note__header:after
      content ' '
      position absolute
      left 0
      bottom 0
      right 0
      height 1px
      background-color border-color
    .minota-note__body
      margin-top 0rem

  .minota-note-editor
    position relative
    z-index 1

  .minota-note-actions
    display flex
    text-align right
    justify-content flex-end
    align-items center
    z-index 2

  .minota-list__menu
    margin-right -0.5rem
    margin-left -0.5rem
    overflow hidden

  .minota-menu-item
    &:last-child
      margin-bottom 1px
</style>
