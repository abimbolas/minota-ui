<template lang="pug">
  aside.minota-drawer.minota-drawer-pool(v-bind:class="{ 'active': toggle }")
    .minota-drawer-backdrop(v-on:click="closeDrawer()")
    #minota-drawer-pool-body.minota-drawer-body(v-on:close="closeDrawer()")

      bar-component(v-bind:target="'minota-drawer-pool-body'" v-bind:position="'right'")
        .button.icon-button(v-on:click="closeDrawer()" v-if="!context")
          i.material-icons close
        .button.icon-button(v-on:click="onCloseContext()" v-if="context")
          i.material-icons arrow_upward
        .title.text-overline
          topic-breadcrumbs-component(
            v-bind:topic="context"
            v-on:set-topic="onSetTopic($event)")
        toggle-sort-button-component.text-button

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
        i.material-icons(v-on:click="addNewNoteInContext()") add
</template>

<script>
/* eslint-disable brace-style */
import { mapGetters, mapMutations, mapActions } from 'vuex'
import BarComponent from '@/components/Bar'
import FabComponent from '@/components/Fab'
import ListItemComponent from '@/components/ListItem'
import NoteListComponent from '@/components/NoteList'
import TopicBreadcrumbsComponent from '@/components/other/TopicBreadcrumbs'
import ToggleSortButtonComponent from '@/components/other/ToggleSortButton'
import { NoteGroup } from '@/store/plugins/list-plugin'
// import { topicDelimiter } from '@/store/ui'
import { appendContextUtil, popContextUtil } from '@/store/context'

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
      context: ''
      // barVisible: true,
      // barToggleFlag: false,
      // poolMenu: false
    }
  },

  computed: {
    ...mapGetters([
      'getOrderBy',
      'getOrderAsc',
      'getContext'
    ])
  },

  watch: {
    'topic' (topic) {
      this.context = topic
      this.loadPoolAction({ topic })
    },
    'selection' (selection) {
      if (!selection.length) {
        this.mode = ''
      }
    },
    'toggle' () {
      this.loadPoolAction({ topic: this.getContext })
    }
  },

  created () {
    this.context = this.topic
    // this.syncContextAction({ context: this.topic })
    this.loadPoolAction({ topic: this.context })
  },

  methods: {
    onOpenNote (note) {
      this.exitMenuMode()
      console.log('open note', note)
      // If we have focus size === 1, just replace context and open note.
      // Otherwise (focus is > 1), we should find the most common context
      // for both (root for totally different).
      // Currently consider focus is 1.
      this.setContext({ context: this.context })
      this.openNoteAction({ note })
      this.closeDrawer()
    },
    onOpenContext (context) {
      this.exitMenuMode()
      this.context = appendContextUtil(this.context, context)
      this.loadPoolAction({ topic: this.context })
    },
    onCloseContext () {
      this.exitMenuMode()
      this.context = popContextUtil(this.context)
      this.loadPoolAction({ topic: this.context })
    },
    onSetTopic (context) {
      this.exitMenuMode()
      this.context = context
      this.loadPoolAction({ topic: this.context })
    },
    exitMenuMode () {
      this.mode = ''
      if (this.selection.length) {
        this.selection = []
      }
    },
    closeDrawer () {
      this.$emit('toggle', false)
    },
    addNewNoteInContext () {
      this.closeDrawer()
      this.setContext({ context: this.context })
      this.$router.push(`/note/new${this.getContext ? ('?topic=' + this.getContext) : ''}`)
    },
    ...mapMutations([
      'appendContext',
      'popContext',
      'setContext'
      // 'setOrderBy',
      // 'setOrderAsc'
    ]),
    ...mapActions([
      'loadPoolAction',
      'openNoteAction',
      'syncContextAction'
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
</style>
