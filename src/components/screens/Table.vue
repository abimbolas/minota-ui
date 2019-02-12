<template lang="pug">
	.minota-table.minota-screen
		bar-component
			.navigation(v-if="noteMode === 'edit'" v-on:click="viewNote()")
				i.material-icons check
			h6.title
				span(v-if="noteMode === 'view' && !getFocus.length") Рабочий стол
			router-link(to="/drawer").action
				i.material-icons folder

		fab-component(v-if="noteMode === 'view'")
			.action(v-if="getFocus.length" v-on:click="editNote()")
				i.material-icons edit
			.action(v-else v-on:click="newNote()")
				i.material-icons add

		main
			.empty-focus-placeholder.text-overline(
				v-bind:placeholder="placeholderKey"
				v-if="!getFocus.length")
				div {{ quotes[placeholderKey] }}

			//- Notes
			note-component(
				v-for="noteId in getFocus"
				v-bind:key="noteId"
				v-bind:note-id="noteId"
				v-bind:mode="noteMode")
</template>

<script>
import { mapGetters } from 'vuex'
// import ScreenComponent from '@/components/layout/Screen'
import NoteComponent from '@/components/Note'
import FabComponent from '@/components/layout/Fab'
import BarComponent from '@/components/layout/Bar'

export default {
	name: 'Table',

	components: {
		// ScreenComponent,
		NoteComponent,
		FabComponent,
		BarComponent
	},

	data () {
		return {
			placeholderKey: parseInt(Math.random() * 5, 10),
			quotes: [
				'Раскольников грохнул бабку',
				'Революция это архиважно',
				'Сюртуки эксплуатировали, эксплуатировали, да не выэксплуатировали',
				'Мой дядя самых честных грабил',
				'Безухов тр&хнул Наташу Ростову'
			],
			noteMode: 'view'
		}
	},

	computed: {
		...mapGetters([
			'getFocus'
		])
	},

	methods: {
		editNote () {
			this.noteMode = 'edit'
		},
		viewNote () {
			this.noteMode = 'view'
		},
		newNote () {
			console.log('new note')
		}
	}
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'
@import '~@/assets/styles/screen'

.minota-table
	.empty-focus-placeholder
		position absolute
		left 50%
		top 50%
		width 80%
		transform translate3D(-50%, -50%, 0)
		text-align center
		color alpha(black, low-emphasis)
		width 100%
		box-sizing border-box
		padding 16px
		height 160px
		background-position center center
		background-size auto 110px
		background-repeat no-repeat
		opacity 0.375
		z-index 0
		div
			max-width 30em
			margin-left auto
			margin-right auto
		&[placeholder="0"]
			background-image url('~@/assets/images/signature-dostoevsky.png')
		&[placeholder="1"]
			background-image url('~@/assets/images/signature-lenin.png')
		&[placeholder="2"]
			background-image url('~@/assets/images/signature-marx.png')
		&[placeholder="3"]
			background-image url('~@/assets/images/signature-pushkin.png')
		&[placeholder="4"]
			background-image url('~@/assets/images/signature-tolstoy.png')
			
	.minota-focus-note
		z-index 1
		position relative
</style>