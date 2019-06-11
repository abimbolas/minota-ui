<template lang="pug">
  .minota-table.minota-screen
    bar-component
      //- Empty table (no matter view or edit mode)
      template(v-if="isFocusEmpty")
        h6.title 
        router-link(to="/drawer").action
          i.material-icons folder_open

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
        .navigation.action(v-on:click="setFocusView()")
          i.material-icons done
        .title.text-overline 
          //- span {{ getFocusNote.config.topic }}
          input-text-component.text-overline(
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
      //- Placeholder
      template(v-if="isFocusEmpty")
        .empty-focus-placeholder.text-overline(
          v-bind:placeholder="placeholderKey"
          v-if="isFocusEmpty")
          div {{ quotes[placeholderKey] }}
      //- Note
      template(v-else)
        note-component(
          v-for="noteId in getFocus"
          v-bind:key="noteId"
          v-bind:note-id="noteId"
          v-bind:mode="getFocusMode"
          v-on:update="onUpdate($event)"
          v-on:viewer-click="onViewerClick()"
          v-on:editor-esc="onEditorEsc()")
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { Reference } from '@/store/reference'
import { previousBlockElementsCount } from '@/utils/dom'
import NoteComponent from '@/components/Note'
import FabComponent from '@/components/layout/Fab'
import BarComponent from '@/components/layout/Bar'
import MenuComponent from '@/components/layout/Menu'
import InputTextComponent from '@/components/other/InputText'

export default {
  name: 'Table',

  components: {
    NoteComponent,
    FabComponent,
    BarComponent,
    MenuComponent,
    InputTextComponent
  },

  data () {
    return {
      placeholderKey: parseInt(Math.random() * 5, 10),
      quotes: [
        'Раскольников грохнул бабку',
        'Революция это архиважно',
        'Сюртуки эксплуатировали, эксплуатировали, да не выэксплуатировали',
        'Мой дядя самых честных грабил',
        'Безухов тр&хнул Наташу Ростову'
      ],
      pendingSave: false,
      more: false
    }
  },

  computed: {
    getFocusNote () {
      return Reference[this.getFocus[0]]
    },
    ...mapGetters([
      'getFocus',
      'getFocusMode',
      'isFocusEmpty',
      'isFocusView',
      'isFocusEdit'
    ])
  },

  mounted () {
    this.setFocusView()
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
      //   note: Reference[this.getFocus[0]]
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
@import '~@/assets/styles/screen'

.minota-table
  .empty-focus-placeholder
    position absolute
    left 50%
    top 50%
    width 80%
    transform translate3D(-50%, -50%, 0)
    text-align center
    color alpha(black, low-emphasis)
    width 100%
    box-sizing border-box
    padding 16px
    height 160px
    background-position center center
    background-size auto 110px
    background-repeat no-repeat
    opacity 0.375
    z-index 0
    div
      max-width 30em
      margin-left auto
      margin-right auto
    &[placeholder="0"]
      background-image url('~@/assets/images/signature-dostoevsky.png')
    &[placeholder="1"]
      background-image url('~@/assets/images/signature-lenin.png')
    &[placeholder="2"]
      background-image url('~@/assets/images/signature-marx.png')
    &[placeholder="3"]
      background-image url('~@/assets/images/signature-pushkin.png')
    &[placeholder="4"]
      background-image url('~@/assets/images/signature-tolstoy.png')
      
  .minota-focus-note
    z-index 1
    position relative
    
  .minota-pending-request
    animation rotate360 0.75s linear infinite
    opacity low-emphasis
</style>