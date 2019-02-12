<template lang="pug">
	button.minota-fab.bottom-right(
		style-elevation="8"
		v-scroll="handleScroll"
		v-bind:class="classes"
	)
		slot
			i.material-icons add
</template>

<script>
import Scroll from '@/directives/scroll'

export default {
	name: 'Fab',

	directives: {
		Scroll
	},

	data () {
		return {
			classes: {
				'hidden': false
			}
		}
	},

	methods: {
		handleScroll (event) {
			if (event.delta > 5) {
				this.classes['hidden'] = true
			} else if (event.delta < -5) {
				this.classes['hidden'] = false
			}

			if (event.scrollTop < 2) {
				this.classes['hidden'] = false
			}
		}
	}
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'
.minota-fab
	background-color primary-dark-color
	color alpha(white, high-emphasis)
	height 56px
	width 56px
	text-align center
	line-height 56px
	display block
	border none
	padding 0
	border-radius 50%
	user-select none
	appearance none
	outline none
	opacity 1
	transform translateY(0%)
	transition opacity 0.125s, transform 0.25s
	&.bottom-right
		position fixed
		z-index 100
		bottom 16px
		right 16px
	&.hidden
		opacity 0
		transform translateY(50%)
	.material-icons
		line-height 56px
		display block
</style>