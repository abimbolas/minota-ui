<template lang="pug">
  aside.minota-drawer.minota-drawer-pool(v-bind:class="[mode, { 'active': toggle }]")
    .minota-drawer-backdrop(v-on:click="closeDrawer()")
    #minota-drawer-pool-body.minota-drawer-body(v-on:close="closeDrawer()")
      bar-component(v-bind:target="'minota-drawer-pool-body'" v-bind:position="'right'")
        template(v-if="mode === 'menu'")
          .title.text-overline {{ selection.length }} selected
          .button.icon-button(
            title="Done with batch actions"
            v-on:click="exitMenuMode()")
            i.material-icons block
          .button.icon-button(
            title="Group notes under topic"
            v-on:click="groupNotes()")
            i.material-icons call_merge
          .button.icon-button(
            title="Ungroup topic into notes"
            v-on:click="ungroupNotes()")
            i.material-icons call_split
          .button.icon-button(
            title="Delete notes"
            v-on:click="onDeleteNotes()")
            i.material-icons delete
        template(v-else)
          .button.icon-button(v-on:click="closeDrawer()" v-if="!context")
            i.material-icons close
          .button.icon-button(v-on:click="onCloseContext()" v-if="context")
            i.material-icons arrow_upward
          .title.text-overline
            topic-breadcrumbs-component(
              v-bind:topic="context"
              v-on:set-topic="onChangeTopic($event)")
          toggle-sort-button-component.text-button

      m-linear-progress(v-bind:open="isLoading" indeterminate)

      note-list-component(
        v-bind:list="pool"
        v-bind:topic="context"
        v-bind:mode="mode" v-on:mode="mode = $event"
        v-bind:selection="selection" v-on:selection="selection = $event"
        v-bind:order-by="getOrderBy"
        v-bind:order-asc="getOrderAsc"
        v-on:open-note="onOpenNote($event)"
        v-on:open-context="onOpenContext($event)")

      fab-component(v-bind:target="'minota-drawer-pool-body'")
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
import { NoteGroup } from '@/store/plugins/list-plugin'
import {
  appendContextUtil,
  popContextUtil,
  contextLengthUtil,
  topicInContextUtil
} from '@/store/context'

export default {
  name: 'DrawerPool',

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
    toggle: {
      type: Boolean,
      required: false,
      default: true
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
    ...mapGetters([
      'isInTableFocus',
      'getOrderBy',
      'getOrderAsc'
    ])
  },

  watch: {
    'topic' (topic) {
      this.context = topic
      this.fetchTopic(this.context)
    },
    'selection' (selection) {
      if (!selection.length) {
        this.mode = ''
      }
    },
    'toggle' () {
      this.fetchTopic(this.context)
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
      this.openNoteAction({ note, context: this.context })
      this.closeDrawer()
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

    closeDrawer () {
      this.exitMenuMode()
      this.$emit('toggle', false)
    },

    onNewNote () {
      this.closeDrawer()
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
        const src = this.context
        const target = appendContextUtil(this.context, topic)
        const notes = extractItems(this.selection)
        this.removeFromPoolFocus({ notes })
        notes.forEach(note => {
          note.topic = note.topic.replace(new RegExp(`^${src}`), target)
        })
        this.addToPoolFocus({ notes, depth: contextLengthUtil(this.context) })
        this.isLoading = true
        this.updateNotesAction({ notes }).then(() => {
          this.isLoading = false
        })
        this.exitMenuMode()
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
        let update = []
        this.selection.filter(item => item.fullGroup).forEach(group => {
          const src = appendContextUtil(this.context, group.key)
          const target = this.context
          const notes = extractItems(group.children)
          this.removeFromPoolFocus({ notes })
          notes.forEach(note => {
            note.topic = note.topic.replace(new RegExp(`^${src}`), target)
          })
          this.addToPoolFocus({ notes, depth: contextLengthUtil(this.context) })
          update = update.concat(notes)
        })
        this.isLoading = true
        this.updateNotesAction({ notes: update }).then(() => {
          this.isLoading = false
        })
        this.exitMenuMode()
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
@import '~@/assets/styles/variables'

.minota-drawer-pool
  .minota-list-item
    padding-left 1rem
    padding-right 1rem
    width 100%
    @media (min-width screen-md)
      margin-left 0rem
      margin-right 0rem
  &.menu
    .minota-drawer-body
      background-color background-color
  .toggle-sort-button
    flex-shrink 0
  .minota-topic-breadcrumbs
    display block
    .topic-item
      display inline-block
</style>
