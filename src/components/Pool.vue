<template lang="pug">
  .minota-pool
    bar-component(v-bind:scroll-target="scrollTarget" v-bind:position="position")
      template(v-if="mode === 'menu'")
        .title.text-overline {{ selection.length }} selected

        .button.icon-button(
          title="Delete notes"
          v-on:click="onDeleteNotes()")
          i.material-icons delete

        .button.icon-button(
          title="Group notes under topic"
          v-on:click="groupNotes()")
          i.material-icons call_merge
        .button.icon-button(
          title="Ungroup topic into notes"
          v-on:click="ungroupNotes()")
          i.material-icons call_split

        .button.icon-button(
          title="Done with batch actions"
          v-on:click="exitMenuMode()")
          i.material-icons block
      template(v-else)
        .button.icon-button(v-on:click="onCloseContext()" v-if="context")
          i.material-icons arrow_upward
        //- .button.icon-button(v-on:click="closePool()" v-else)
          i.material-icons arrow_back
        .title
          topic-breadcrumbs-component.text-overline(
            v-bind:topic="context"
            v-on:set-topic="onChangeTopic($event)")

        //- toggle-sort-button-component.icon-button
        //- button.button.icon-button(
          v-on:click="onNewNote()"
          title="New note")
          i.material-icons add
        //- router-link.no-style.button.icon-button(
          v-bind:to="poolWithContexURL"
          title="Open Pool"
          target="_blank")
          i.material-icons open_in_new
        router-link.button.icon-button(to="/new" title="New")
          i.material-icons add

        //- .button.icon-button(v-on:click="mode = 'menu'")
          i.material-icons edit

        //- router-link.button.icon-button(to="/table" title="Table")
          i.material-icons crop_square
        .button.icon-button(v-on:click="closePool()")
          i.material-icons close

    m-linear-progress(v-bind:open="isLoading" indeterminate)

    note-list-component(
      v-if="!isLoading"
      v-bind:list="pool"
      v-bind:topic="context"
      v-bind:mode="mode" v-on:mode="mode = $event"
      v-bind:selection="selection" v-on:selection="selection = $event"
      v-bind:order-by="getOrderBy"
      v-bind:order-asc="getOrderAsc"
      v-on:open-note="onOpenNote($event)"
      v-on:open-context="onOpenContext($event)")
    //- FAB
    //- fab-component(v-bind:scrollTarget="scrollTarget")
      i.material-icons(v-on:click="onNewNote()") add
</template>

<script>
/* eslint-disable brace-style */
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { extractItems } from '@/models/group'
import BarComponent from '@/components/Bar'
import FabComponent from '@/components/Fab'
import ListItemComponent from '@/components/ListItem'
import NoteListComponent from '@/components/NoteList'
import TopicBreadcrumbsComponent from '@/components/other/TopicBreadcrumbs'
import ToggleSortButtonComponent from '@/components/other/ToggleSortButton'
import Language from '@/mixins/language'
import { NoteGroup } from '@/store/plugins/pool-plugin'
import {
  appendContextUtil,
  popContextUtil,
  contextLengthUtil,
  topicInContextUtil,
  topicDelimiter
} from '@/store/context'

export default {
  name: 'Pool',

  components: {
    BarComponent,
    FabComponent,
    ListItemComponent,
    NoteListComponent,
    TopicBreadcrumbsComponent,
    ToggleSortButtonComponent
  },

  mixins: [Language],

  props: {
    topic: {
      type: String,
      required: false,
      default: ''
    },
    scrollTarget: {
      type: String,
      required: false,
      default: 'window'
    },
    position: {
      type: String,
      required: false,
      default: 'left'
    }
  },

  data () {
    return {
      pool: NoteGroup,
      mode: '',
      selection: [],
      context: '',
      isLoading: false
    }
  },

  computed: {
    poolWithContexURL () {
      return this.context ? '/notes?topic=' + this.context : '/notes'
    },
    ...mapGetters([
      'isInTableFocus',
      'getOrderBy',
      'getOrderAsc',
      'getContextArray'
    ])
  },

  watch: {
    'topic' (topic) {
      if (topic !== this.context) {
        this.context = topic
        clearTimeout(this.fetchTopicTimeout)
        this.isLoading = true
        this.fetchTopic(this.context)
      }
    },
    'context' (context) {
      this.$emit('topic', context)
    },
    'selection' (selection) {
      if (!selection.length) {
        this.mode = ''
      }
    }
  },

  created () {
    this.context = this.topic
    this.fetchTopic(this.context)
    // Watch for new and editing notes and update them
    // in current pool, if needed
    const actions = {
      updateNoteAction: ({ note }) => {
        if (topicInContextUtil(note.topic, this.context)) {
          this.addToPoolFocus({ note, depth: contextLengthUtil(this.context) })
        }
      }
    }
    this.unsubscribeActions = this.$store.subscribeAction(action => {
      if (actions[action.type]) {
        actions[action.type](action.payload)
      }
    })
  },

  beforeDestroy () {
    this.unsubscribeActions()
  },

  methods: {
    fetchTopic (topic) {
      this.isLoading = true
      this.getNotesAction({ topic }).then(notes => {
        this.clearPoolFocus()
        this.addToPoolFocus({ notes, depth: contextLengthUtil(topic) })
        this.isLoading = false
      }).catch(error => {
        console.warn('fetchTopic error:', error)
      })
    },

    onOpenNote (note) {
      this.exitMenuMode()
      this.openNoteAction({ note })
      this.closePool()
    },

    onOpenContext (context) {
      this.exitMenuMode()
      this.context = appendContextUtil(this.context, context)
      this.fetchTopic(this.context)
    },

    onCloseContext () {
      this.exitMenuMode()
      this.context = popContextUtil(this.context)
      this.fetchTopic(this.context)
    },

    onChangeTopic (context) {
      this.exitMenuMode()
      this.context = context
      this.fetchTopic(this.context)
    },

    exitMenuMode () {
      this.mode = ''
      if (this.selection.length) {
        this.selection = []
      }
    },

    closePool () {
      this.exitMenuMode()
      this.$emit('opened', false)
    },

    onNewNote () {
      this.closePool()
      if (this.getContext !== this.context) {
        this.setContext({ context: this.context })
      }
      this.$router.push('/new')
    },

    onDeleteNotes () {
      if (this.selection.length) {
        const notes = extractItems(this.selection)
        const focused = notes.filter(note => this.isInTableFocus(note)).length
        const text = {
          Delete: this.languageTranslate('delete', { capitalize: true })
        }
        const body = this.languageComplex('modalBodyDeleteItems', {
          items: this.selection.length,
          notes: notes.length,
          focused: focused
        })
        this.openModalAction({
          modal: {
            header: text.Delete,
            body: body,
            ok: {
              label: text.Delete
            }
          }
        }).then(() => {
          this.isLoading = true
          this.removeFromPoolFocus({ notes })
          this.deleteNotesAction({ notes }).then(() => {
            this.isLoading = false
          })
          this.exitMenuMode()
        })
      }
    },

    groupNotes () {
      this.openModalAction({
        modal: {
          ok: {
            label: 'Group'
          },
          component: 'GroupModal'
        }
      }).then(topic => {
        // DO MUTATION & CLONE!
        console.log(topic, topicDelimiter)
        //
        // if (!topic) {
        //   this.exitMenuMode()
        //   return
        // }
        // const notes = extractItems(this.selection)
        // notes.forEach(note => {
        //   note.topic = note.path
        //     .slice(0, this.getContextArray.length)
        //     .concat(topic.split(topicDelimiter).filter(i => i))
        //     .concat(note.path.slice(this.getContextArray.length))
        //     .filter(i => i)
        //     .join(topicDelimiter)
        // })
        // this.addToPoolFocus({ notes, depth: contextLengthUtil(this.context) })
        // this.isLoading = true
        // this.updateNotesAction({ notes }).then(() => {
        //   this.isLoading = false
        // })
        // this.exitMenuMode()
      })
    },

    ungroupNotes () {
      this.openModalAction({
        modal: {
          header: 'Ungroup notes',
          body: 'Are you sure you want to ungroup notes?',
          ok: {
            label: 'Ungroup'
          }
        }
      }).then(() => {
        // DO MUTATION & CLONE!

        // let update = []
        // this.selection.filter(item => item.fullGroup).forEach(group => {
        //   const notes = extractItems(group.children)
        //   this.removeFromPoolFocus({ notes })
        //   notes.forEach(note => {
        //     note.topic = note.path
        //       .slice(0, this.getContextArray.length)
        //       .concat(note.path.slice(this.getContextArray.length + 1))
        //       .filter(i => i)
        //       .join(topicDelimiter)
        //   })
        //   this.addToPoolFocus({ notes, depth: contextLengthUtil(this.context) })
        //   update = update.concat(notes)
        // })
        // this.isLoading = true
        // this.updateNotesAction({ notes: update }).then(() => {
        //   this.isLoading = false
        // })
        // this.exitMenuMode()
      })
    },

    ...mapMutations([
      'addToPoolFocus',
      'addToTableFocus',
      'clearPoolFocus',
      'removeFromPoolFocus',
      'setContext'
    ]),

    ...mapActions([
      'deleteNotesAction',
      'getNotesAction',
      'groupNotesAction',
      'newNoteAction',
      'openModalAction',
      'openNoteAction',
      'ungroupNotesAction',
      'updateNotesAction'
    ])
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/everything'

.minota-drawer
  .minota-pool
    width 100%

  .slide-enter
  .slide-leave-to
    .minota-fab
      opacity 0

  .slide-enter-to
  .slide-leave
    .minota-fab
      opacity 1

  .slide-enter-active
  .slide-leave-active
    .minota-fab
      transition opacity 0.5s ease
  .slide-enter-active
    .minota-fab
      transition-delay 0.1s

.minota-pool
  .minota-list-item
    padding-left 1rem
    padding-right 1rem
    width 100%
    @media (min-width screen-md)
      margin-left 0rem
      margin-right 0rem
      width calc(100% - 0rem)

  .minota-topic-breadcrumbs
    display block
    .topic-item
      display inline-block
</style>
