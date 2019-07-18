<template lang="pug">
  screen-component.minota-table
    bar-component
      //- Empty table (no matter view or edit mode)
      template(v-if="isFocusEmpty")
        h6.title {{ currentStorage && currentStorage.topic }}
        router-link(to="/drawer").button.icon-button
          i.material-icons folder_open

      //- View note mode
      //- template(v-if="isFocusView && !isFocusEmpty")
        .title.text-overline(
          v-on:click="setFocusEdit()"
        ) {{ getFocusNote.config.topic || '' }}
        //- .title
          input-text-component.text-overline(
            v-bind:value="getFocusNote.config.topic")
        .button.icon-button(v-on:click="clearTableAction()")
          i.material-icons done
        router-link(to="/drawer").button.icon-button
          i.material-icons folder_open

      //- Edit note mode
      template(v-if="isFocusEdit && !isFocusEmpty")
        //- .button.icon-button(v-on:click="clearTable()")
          i.material-icons close
        h6.title {{ currentStorage && currentStorage.topic }}
        .title.text-overline
          span {{ getFocusNote.config.topic }}
          //- input-text-component.text-overline(
            v-bind:value="getFocusNote.config.topic"
            v-on:update="onTopicUpdate(topic)")

        .button.icon-button.minota-pending-request(v-if="pendingSave")
          i.material-icons autorenew

        //- .button.icon-button(v-on:click="openDeleteNoteDialog()")
          i.material-icons delete
        //- .button.icon-button(v-on:click="clearTableAction()")
        //-   i.material-icons done

        router-link(to="/drawer").button.icon-button
          i.material-icons folder_open
        //- .button.icon-button(v-on:click="openMore()")
        //-   i.material-icons more_vert

    fab-component(v-if="!isFocusEdit")
      //- Edit note
      //- template(v-if="isFocusView && !isFocusEmpty")
        .fab-action(v-on:click="setFocusEdit()")
          i.material-icons edit

      //- New note
      template
        .fab-action(v-on:click="newNote()")
          i.material-icons add

    menu-component(v-if="isMoreOpened()" v-on:close="closeMore()")
      .menu-header
        .action(v-on:click="closeMore()")
          i.material-icons close
      .menu-item
        .text-body Change topic
      .menu-item(v-on:click="openDeleteNoteDialog()")
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

  props: {
    noteId: {
      type: String,
      required: false,
      default: null
    }
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
    ...mapGetters({
      'currentStorage': 'getCurrentStorageConfig'
    }),
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
    this.setFocusEdit()
    if (this.noteId) {
      this.getNote({ id: this.noteId }).then(note => {
        this.focusNote({ note })
      }).catch(error => {
        this.openModal({
          modal: {
            header: error.statusText,
            body: error.data,
            cancel: false
          }
        }).then(() => {
          this.$router.push('/table')
        })
      })
    }
  },

  methods: {
    onUpdate ($event) {
      this.pendingSave = true
      this.saveNote({ note: $event })
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
    openDeleteNoteDialog () {
      this.openModal({
        modal: {
          // header: 'Delete',
          body: 'Are you sure to delete this note?',
          ok: {
            label: 'Delete'
          }
        }
      }).then(() => {
        this.deleteNote({ note: NoteReference[this.getFocus[0]] })
          .then(() => {
            this.closeMore()
          })
      })
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
    ...mapActions({
      'openModal': 'openModalAction',
      'deleteNote': 'deleteNoteAction',
      'newNote': 'newNoteAction',
      'saveNote': 'saveNoteAction',
      'focusNote': 'focusNoteAction',
      'getNote': 'getNoteAction',
      'clearTable': 'clearTableAction'
    })
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
