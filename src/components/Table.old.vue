<template lang="pug">
  .minota-table()
    //- header
      .left
        .table-action.icon-button
          i.material-icons menu
        //- .minota-context
          div {{ contextFocus }}
          div(style="font-size: 11px; line-height: 1") {{ contextBlur }}
        //- .table-action.icon-button
          i.material-icons edit
      .right
        //- .table-action.icon-button(@click="clearTableAction")
          i.material-icons clear_all
        .table-action.icon-button(@click="newNoteAction")
          i.material-icons add
    .minota-focus(v-bind:class="{ empty: !getFocus.length }")
      focused-note(
        v-for="note in getFocus"
        v-bind:key="note"
        v-bind:note="note")
      //- .minota-focus-item(
      //-   v-for="(note, index) in Table.focus"
      //-   :key="note.config.id")
      //-   note-component(v-model="Table.focus[index]" mode="edit" space="focus")
    //- .minota-blur(v-if="getBlur.length")
      //- blurred-note(v-for="note in getBlur"  :key="note")
      //- .minota-blur-item(
      //-   v-for="(note, index) in Table.blur"
      //-   :key="note.config.id"
      //-   @click="focusNoteAction({ note: note })")
      //-   note-component(v-model="Table.blur[index]" mode="view" space="blur")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import Note from '@/models/note'
// import NoteComponent from '@/components/Note'
import FocusedNote from '@/components/notes/FocusedNote'
// import { Table } from '@/store/table'

export default {
  name: 'Table',

  components: {
    FocusedNote
  },

  // data () {
  //   return {
  //     // Table
  //   }
  // },

  computed: {
    ...mapGetters([
      'getFocus',
      'getBlur'
    ])
  },

  methods: {
    ...mapActions([
      'newNoteAction',
      'focusNoteAction',
      'clearTableAction',
      'blurTableAction',
      'focusBlurAction'
    ])
  }
}
</script>

<style lang="stylus">
@import "~@/assets/styles/variables"
.minota-table
  // background-image url("~@/assets/images/table-005.jpg")
  // background-color #bba7a7
  // background-blend-mode multiply
  // background-size auto
  // background-position top left
  box-sizing border-box
  width 100%
  display flex
  flex-direction column
  overflow-y auto
  overflow-x hidden
  position relative

  .minota-focus
    display flex
    flex-grow 1
    flex-shrink 0

    &.empty:after
      content "Your notes will be here"
      color gainsboro
      font-size 14px
      font-weight 400
      position absolute
      white-space nowrap
      left 50%
      top 50%
      transform translateX(-50%) translateY(-50%)
      z-index 0
      pointer-events none

//   & > header
//     // background-color alpha(black, 0.25)
//     padding 0.5rem
//     display flex
//     align-items center
//     .left
//     .right
//       display flex
//     .left
//       .table-action
//         margin-right 0.5rem
//     .right
//       margin-left auto
//       .table-action
//         margin-left 0.5rem

//   .table-action
//     width 32px
//     height 32px
//     line-height 32px
//     text-align center
//     cursor pointer
//     color whitesmoke
//     text-shadow 0px 0px 10px rgba(0, 0, 0, 0.95)
//     font-weight 500

// .minota-context
//   color whitesmoke
//   font-size 18px
//   font-weight 400
//   line-height 32px

// .minota-focus
//   display flex
//   justify-content center
//   position relative
//   flex-grow 1
//   z-index 1

// .minota-blur
//   background-color alpha(black, 0.2)
//   margin-top auto
//   display grid
//   grid-template-columns repeat(auto-fill, minmax(24em, 1fr))
//   grid-template-rows 1
//   grid-gap 1rem
//   padding 1rem
//   font-size 13px
//   .minota-note
//     cursor pointer
//     h1
//       font-size 1.5em
</style>
