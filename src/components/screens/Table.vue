<template lang="pug">
  screen-component.minota-table
    bar-component
      //- Empty table (no matter view or edit mode)
      template(v-if="isFocusEmpty")
        h6.title
        router-link(to="/drawer").action
          i.material-icons arrow_forward

      //- View note mode
      template(v-if="isFocusView && !isFocusEmpty")
        .title.text-overline(
          v-on:click="setFocusEdit()"
        ) {{ getFocusNote.config.topic || '' }}
        //- .title
          input-text-component.text-overline(
            v-bind:value="getFocusNote.config.topic")
        .action(v-on:click="clearTableAction()")
          i.material-icons done
        router-link(to="/drawer").action
          i.material-icons folder_open

      //- Edit note mode
      template(v-if="isFocusEdit && !isFocusEmpty")
        //- .navigation.action(v-on:click="setFocusView()")
          i.material-icons done
        .title.text-overline
          span {{ getFocusNote.config.topic }}
          //- input-text-component.text-overline(
            v-bind:value="getFocusNote.config.topic"
            v-on:update="onTopicUpdate(topic)")

        .action.minota-pending-request(v-if="pendingSave")
          i.material-icons autorenew
        //- router-link(to="/drawer").action
          i.material-icons folder_open
        .action(v-on:click="deleteNote()")
          i.material-icons delete
        //- .action(v-on:click="openMore()")
          i.material-icons more_vert

    fab-component
      //- Edit note
      template(v-if="isFocusView && !isFocusEmpty")
        .fab-action(v-on:click="setFocusEdit()")
          i.material-icons edit

      //- New note
      template
        .fab-action(v-on:click="newNoteAction()")
          i.material-icons add

    menu-component(v-if="isMoreOpened()" v-on:close="closeMore()")
      .menu-header
        .action(v-on:click="closeMore()")
          i.material-icons close
      .menu-item
        .text-body Change topic
      .menu-item(v-on:click="deleteNote()")
        .action
          i.material-icons delete
        .text-body Delete note

    main
      template(v-if="!isFocusEmpty")
        note-component(
          v-for="noteId in getFocus"
          v-bind:key="noteId"
          v-bind:note-id="noteId"
          v-bind:mode="getFocusMode"
          v-on:update="onUpdate($event)"
          v-on:viewer-click="onViewerClick()"
          v-on:editor-esc="onEditorEsc()")

      template(v-else)
        screen-placeholder-component(
          v-if="isFocusEmpty && placeholderItem"
          v-bind:text="placeholderItem.text"
          v-bind:image="placeholderItem.image")
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

import { NoteReference } from '@/store/reference'

import BarComponent from '@/components/layout/Bar'
import FabComponent from '@/components/layout/Fab'
import MenuComponent from '@/components/layout/Menu'
import ScreenComponent from '@/components/layout/Screen'

import NoteComponent from '@/components/Note'

import ScreenPlaceholderComponent from '@/components/other/ScreenPlaceholder'

export default {
  name: 'Table',

  components: {
    BarComponent,
    FabComponent,
    MenuComponent,
    ScreenComponent,
    NoteComponent,
    ScreenPlaceholderComponent
  },

  data () {
    return {
      placeholderItem: null,
      pendingSave: false,
      more: false
    }
  },

  computed: {
    getFocusNote () {
      return NoteReference[this.getFocus[0]]
    },
    ...mapGetters([
      'getFocus',
      'getFocusMode',
      'getPlaceholderQuotes',
      'isFocusEmpty',
      'isFocusView',
      'isFocusEdit'
    ])
  },

  created () {
    // create placeholder
    this.placeholderItem = this.getPlaceholderQuotes[parseInt(Math.random() * this.getPlaceholderQuotes.length, 10)]
  },

  mounted () {
    // this.setFocusView()
    this.setFocusEdit()
  },

  methods: {
    onUpdate ($event) {
      this.pendingSave = true
      this.saveNoteAction({ note: $event })
        .then(() => {
          this.pendingSave = false
        })
    },
    onViewerClick () {
      this.setFocusEdit()
      const scrollTop = document.scrollingElement.scrollTop
      // Keep scrolling position
      setTimeout(() => {
        document.scrollingElement.scrollTop = scrollTop
      })
    },
    onEditorEsc () {
      this.setFocusView()
    },
    deleteNote () {
      console.log('DELETE NOTE')
      // this.deleteNoteAction({
      //   note: NoteReference[this.getFocus[0]]
      // }).then(() => {
      //   this.closeMore()
      // })
    },
    openMore () {
      this.more = true
    },
    closeMore () {
      this.more = false
    },
    isMoreOpened () {
      return Boolean(this.more)
    },
    ...mapMutations([
      'setFocusView',
      'setFocusEdit'
    ]),
    ...mapActions([
      'saveNoteAction',
      'clearTableAction',
      'newNoteAction',
      'deleteNoteAction'
    ])
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'
@import '~@/assets/styles/animation'

.minota-table
  .minota-focus-note
    z-index 1
    position relative
    font-weight 300

  .minota-pending-request
    animation rotate360 0.75s linear infinite
    opacity low-emphasis
</style>
