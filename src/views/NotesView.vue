<template>
  <div class="notes">
    <div
      class="notes-list-item"
      v-for="note in notes" :key="note.config.id"
      v-on:click="openNote(note.config.id)">
      <div class="note-date">
        <small>{{ note.config.date | niceDate }}</small>
      </div>
      <div class="note-content">
        <div class="note-topic"><small>{{ note.config.topic }}</small></div>
        <div class="note-title">{{ extractTitle(note) }}</div>
        <div class="note-text">{{ extractContent(note) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import { mapGetters } from 'vuex';

export default {
  name: 'notes-view',
  data() {
    return {
      notes: [
        { config: { id: 1 }, content: 'placeholder 1' },
        { config: { id: 2 }, content: 'placeholder 2' },
      ],
    };
  },
  mounted() {
    axios.get(`${this.serverUrl}/notes/all`).then((response) => {
      if (response.status === 200) {
        this.notes = response.data;
        this.notes
          .sort((a, b) => new Date(a.config.date) - new Date(b.config.date))
          .reverse();
      }
    });
  },
  methods: {
    extractTitle(note) {
      let title = ''
      if (note.content.match(/^# /g)) {
        [title] = note.content.trim().split('\n');
      }
      return title;
    },
    extractContent(note) {
      if (this.extractTitle(note)) {
        return note.content.trim().split('\n').slice(1).join('\n');
      }
      return note.content;
    },
    openNote(id) {
      this.$router.push(`/notes/${id}`);
    },
  },
  computed: {
    ...mapGetters([
      'serverUrl',
    ]),
  },
  filters: {
    niceDate(value) {
      const date = new Date(value);
      let format = 'D MMM YYYY';
      if (date.getFullYear() === (new Date()).getFullYear()) {
        format = 'D MMM';
      }
      return moment(value).format(format);
    },
  },
};
</script>

<style lang="stylus">
.notes
  margin 2rem auto
  max-width 45rem
.notes-list-item
  /*border-bottom solid 1px gray*/
  margin-bottom 0.5rem
  display flex
  justify-content flex-start
  background-color white
  padding 1rem
  box-shadow 0px 1px 3px rgba(0, 0, 0, 0.05)
  cursor pointer
  .note-date
    width 3rem
    /*background-color red*/
  .note-content
    width calc(100% - 100px - 1.5rem)
    /*display flex*/
  .note-date + .note-content
    margin-left 1.5rem
  .note-title
    font-weight 500
  .note-text
    display -webkit-box
    overflow hidden
    -webkit-line-clamp 3
    -webkit-box-orient vertical
    max-height 4.5rem
</style>
