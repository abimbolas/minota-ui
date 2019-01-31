<template lang="pug">
  .minota-view.flex(
    @mousemove="removeEditorFullscreen"
    @click="removeEditorFullscreen")
    .minota-note
      editor(v-model="note.content")
      //- div.minota-note-id {{ note.config.id }}
</template>

<script>
import axios from 'axios'
import { cloneDeep } from 'micro-dash'
import { mapGetters, mapMutations } from 'vuex'
import editor from '@/components/Editor'

const newNote = {
  config: {
    id: 'new'
  },
  content: ''
}

export default {
  name: 'NoteView',

  components: {
    editor
  },

  data () {
    return {
      note: cloneDeep(newNote)
    }
  },

  computed: {
    ...mapGetters(['serverUrl', 'editorFullscreen'])
  },

  watch: {
    'note.content': function (value) {
      // Toggle fullscreen on edit
      if (value && !this.editorFullscreen) {
        this.toggleEditorFullscreen(true)
      }

      // Save note on timeout
      clearTimeout(this.saveDebounce)
      this.saveDebounce = setTimeout(() => {
        // if this is new note, create it first
        if (this.note.config.id === 'new') {
          this.saveAsNewNote()
        } else {
          this.saveNote()
        }
      }, 300)
    }
  },

  created () {
    // Setup fetch notes and creation of new note
    if (this.$route.params.id === 'new') {
      this.note = cloneDeep(newNote)
    } else {
      // Get note with required id
      const url = `${this.serverUrl}/notes/${this.$route.params.id}`
      axios.get(url).then(response => {
        if (response.status === 200) {
          this.note = response.data[0]
        }
      })
    }
  },

  mounted () {
    this.$el.addEventListener('mousemove', this.removeEditorFullscreen)
    this.$el.addEventListener('click', this.removeEditorFullscreen)
  },

  methods: {
    removeEditorFullscreen () {
      if (this.editorFullscreen) {
        this.toggleEditorFullscreen(false)
      }
    },
    saveAsNewNote () {
      delete this.note.config.id
      this.note.config.date = new Date().toISOString()
      this.saveNote()
    },
    saveNote () {
      axios.post(`${this.serverUrl}/notes`, this.note).then(response => {
        if (response.status === 200) {
          this.note = response.data[0]
          this.$router.replace({
            name: 'note',
            params: { id: response.data[0].config.id }
          })
        }
      })
    },
    ...mapMutations(['toggleEditorFullscreen'])
  }
}
</script>

<style lang="stylus">

</style>
