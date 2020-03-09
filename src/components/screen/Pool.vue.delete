<template lang="pug">
  section.minota-screen.minota-pool
    header.minota-screen-header
      bar-component(v-on:bar-toggle="onBarToggle($event)" v-bind:toggle="barToggleFlag")

        //- Normal mode bar
        template(v-if="mode !== 'menu'")
          router-link.button.icon-button(to="/notes" v-if="topic" title="Clear context")
            i.material-icons folder_open
          router-link.button.icon-button(to="/note" v-else title="Table")
            i.material-icons home
          router-link(to="/config" title="Setup storages").button.icon-button
            i.material-icons cloud_queue
          .title.text-overline
            topic-breadcrumbs-component(v-bind:topic="topic")
          router-link(to="/new" title="Add note").button.icon-button
            i.material-icons add
          toggle-sort-button-component.text-button

        //- Menu mode bar
        template(v-else)
          router-link.button.icon-button(to="/notes" v-if="topic" title="List notes")
            i.material-icons folder_open
          .title.text-overline
            topic-breadcrumbs-component(v-bind:topic="topic")
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
          .button.icon-button(title="Edit notes")
            i.material-icons edit
          .button.icon-button(
            title="Delete notes"
            v-on:click="deleteNotes()")
            i.material-icons delete

    //- Main list content
    main.minota-screen-main
      note-list-component(
        v-bind:list="pool"
        v-bind:mode="mode" v-on:mode="mode = $event"
        v-bind:selection="selection" v-on:selection="selection = $event"
        v-on:open-note="onOpenNote($event)"
        v-on:open-context="onOpenContext($event)"
        v-bind:order-by="getOrderBy"
        v-bind:order-asc="getOrderAsc")

    //- Side pool menu
    menu-component.pool-menu(v-if="poolMenu" v-on:close="poolMenu = false")
      li.menu-header
        .button.icon-button.action(v-on:click="poolMenu = false")
          i.material-icons close
      li.menu-item(
        v-bind:class="{ 'active': getOrderBy === 'date' }"
        v-on:click="toggleSort('date')")
        span.text-body-smaller Order<span class="ed"></span> by <strong>Date</strong>
        i.material-icons {{ getOrderAsc ? 'arrow_upward' : 'arrow_downward'}}
      li.menu-item(
        v-bind:class="{ 'active': getOrderBy === 'topic' }"
        v-on:click="toggleSort('topic')")
        span.text-body-smaller Order<span class="ed"></span> by <strong>Topic</strong>
        i.material-icons {{ getOrderAsc ? 'arrow_upward' : 'arrow_downward'}}
</template>

<script>
/* eslint-disable brace-style */
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { NoteGroup } from '@/store/plugins/list-plugin'
import { extractItems } from '@/models/group'
import BarComponent from '@/components/Bar'
import MenuComponent from '@/components/Menu'
import NoteListComponent from '@/components/NoteList'
import TopicBreadcrumbsComponent from '@/components/other/TopicBreadcrumbs'
import ToggleSortButtonComponent from '@/components/other/ToggleSortButton'

export default {
  name: 'Pool',

  components: {
    BarComponent,
    MenuComponent,
    NoteListComponent,
    TopicBreadcrumbsComponent,
    ToggleSortButtonComponent
  },

  props: {
    topic: {
      type: String,
      required: false,
      default: ''
    }
  },

  data () {
    return {
      pool: NoteGroup,
      mode: '',
      selection: [],
      barVisible: true,
      barToggleFlag: false,
      poolMenu: false
    }
  },

  computed: {
    ...mapGetters([
      'getContext',
      'getOrderBy',
      'getOrderAsc'
    ])
  },

  watch: {
    'topic' (topic) {
      this.exitMenuMode()
      this.syncContextAction({ context: topic })
      this.loadPoolAction({ topic })
    }
  },

  created () {
    this.syncContextAction({ context: this.topic })
    this.loadPoolAction({ topic: this.topic })
  },

  methods: {
    onOpenNote (note) {
      this.exitMenuMode()
      this.openNoteAction({ note })
    },
    onOpenContext (context) {
      this.openContextAction({ context })
    },
    onBarToggle (visible) {
      this.barVisible = visible
    },
    showBar () {
      if (!this.barVisible) {
        this.barToggleFlag = !this.barToggleFlag
      }
    },
    exitMenuMode () {
      this.mode = ''
      this.selection = []
    },
    deleteNotes () {
      if (this.selection.length) {
        const notes = extractItems(this.selection)
        this.openModalAction({
          modal: {
            header: 'Delete',
            body: `Are you sure to delete ${this.selection.length} item(s), which contain <strong>${notes.length} note(s)</strong>?`,
            ok: {
              label: 'Delete'
            }
          }
        }).then(() => {
          this.removeFromPoolAction({
            items: this.selection.slice(0, this.selection.length)
          })
          this.exitMenuMode()
        })
      }
    },
    groupNotes () {
      this.openModalAction({
        modal: {
          header: 'Group notes',
          body: 'You want to group notes under one topic?',
          ok: {
            label: 'Group'
          }
        }
      }).then(() => {
        console.log('group notes')
        this.exitMenuMode()
      })
    },
    ungroupNotes () {
      this.openModalAction({
        modal: {
          header: 'Ungroup notes',
          body: 'Are you sure you want to group notes in this topic?',
          ok: {
            label: 'Ungroup'
          }
        }
      }).then(() => {
        console.log('ungroup notes')
        this.exitMenuMode()
      })
    },
    toggleSort (orderBy) {
      if (orderBy === this.getOrderBy) {
        this.setOrderAsc({ orderAsc: !this.getOrderAsc })
      } else {
        this.setOrderBy({ orderBy })
      }
    },
    ...mapMutations([
      'appendContext',
      'setOrderBy',
      'setOrderAsc'
    ]),
    ...mapActions([
      'loadPoolAction',
      'openModalAction',
      'openNoteAction',
      'openContextAction',
      'syncContextAction',
      'removeFromPoolAction'
    ])
  }
}
</script>

<style lang="stylus">
@import "~@/assets/styles/variables"
@import "~@/assets/styles/typography"
@import "~@/assets/styles/everything"

.minota-pool
  .minota-screen-main
    flex-direction column
    .minota-note-tree-loader
      flex-grow 1
      min-width 0

  .sort-notes
    padding 0 0.75rem
    @media (min-width screen-sm)
      padding 0 0.25rem
    @extend .line-after
    @extend .text-caption
    line-height 1rem
    display flex
    justify-content flex-end
    align-items center
    user-select none
    .field
      padding 0.5rem 0
      cursor pointer
      display flex
      margin-left 1.5rem
      strong
        font-weight inherit
      &.active strong
        font-weight bold
      & > *
        vertical-align middle
      .material-icons
        font-size 1rem
        line-height 1rem
        display block
        margin-left 0.25rem

  .pool-menu
    .menu-item
      justify-content space-between
      strong
        font-weight inherit
      .material-icons
        font-size 1rem
        visibility hidden
      &.active
        .material-icons
          visibility visible
        strong
          font-weight bold
        .ed:before
          content 'ed'
</style>
