<template lang="pug">
  .toggle-sort-button.button(v-on:click="toggleSortOptions()")
    span Sort by {{ getOrderName }}
    i.material-icons(v-if="getOrderAsc") arrow_upward
    i.material-icons(v-else) arrow_downward
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'ToggleSortButton',

  data () {
    return {
      sortOptions: [
        { orderBy: 'date', orderAsc: false },
        { orderBy: 'date', orderAsc: true },
        { orderBy: 'topic', orderAsc: false },
        { orderBy: 'topic', orderAsc: true }
      ],
      sortSelected: 0,
      sortByLabels: {
        date: 'Date',
        topic: 'Topic'
      }
    }
  },

  computed: {
    getOrderName () {
      return this.sortByLabels[this.getOrderBy]
    },
    ...mapGetters([
      'getOrderBy',
      'getOrderAsc'
    ])
  },

  mounted () {
    this.syncSelectedSortOptions()
  },

  methods: {
    toggleSortOptions () {
      this.sortSelected = this.sortSelected + 1
      if (this.sortSelected > this.sortOptions.length - 1) {
        this.sortSelected = 0
      }
      this.setOrderBy({ orderBy: this.sortOptions[this.sortSelected].orderBy })
      this.setOrderAsc({ orderAsc: this.sortOptions[this.sortSelected].orderAsc })
    },
    syncSelectedSortOptions () {
      this.sortOptions.forEach((option, index) => {
        if (
          this.getOrderBy === option.orderBy &&
          this.getOrderAsc === option.orderAsc
        ) {
          this.sortSelected = index
        }
      })
    },
    ...mapMutations([
      'setOrderBy',
      'setOrderAsc'
    ])
  }
}
</script>
