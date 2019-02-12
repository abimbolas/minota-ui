<template lang="pug">
	.minota-note
		editor-component(v-if="mode === 'edit'" v-model="content")
		viewer-component(v-else v-model="content")
</template>

<script>
import { Reference } from '@/store/reference'
import EditorComponent from '@/components/Editor'
import ViewerComponent from '@/components/Viewer'

export default {
	name: 'Note',

	components: {
		EditorComponent,
		ViewerComponent
	},

	props: {
		mode: {
			type: String,
			required: false,
			default: 'view'
		},

		noteId: {
			type: String,
			required: true
		}
	},

	computed: {
		note () {
			return Reference[this.noteId]
		},
		content () {
			return this.note.content
		}
	}
}
</script>