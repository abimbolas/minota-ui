<template>
  <div class="note">
    <div class="note-topic"><strong><small>{{ note.config.topic }}</small></strong></div>
    <editor v-model="note.content"></editor>
  </div>
</template>

<script>
import axios from 'axios';
import editor from '@/components/Editor.vue'

export default {
  name: 'note',
  data() {
    return {
      note: {
        config: {
          id: '1',
          topic: 'Topic',
        },
        content: '(Note text)',
      },
    };
  },
  mounted() {
    axios.get(`http://localhost:7777/notes/${this.$route.params.id}`)
      .then((response) => {
        if (response.status === 200) {
          [this.note] = response.data;
        }
      });
  },
  components: {
    editor,
  },
};
</script>

<style lang="stylus">
.note
  .note-topic
    margin-bottom 1rem
</style>
