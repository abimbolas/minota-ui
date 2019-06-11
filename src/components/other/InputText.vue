<template lang="pug">
  label.minota-input-text
    input(
      type="text"
      placeholder="Set topic"
      v-bind:value="value"
      v-on:update="onUpdate($event)")
    //- .bottom-outline
</template>

<script>
export default {
  name: 'InputText',

  props: {
    value: {
      type: String,
      required: true,
      default: ''
    }
  },

  mounted () {
    console.log(this.value)
  },

  methods: {
    onUpdate ($event) {
      console.log($event)
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'

.minota-input-text
  // background-color crimson
  height 56px
  display block
  cursor text
  position relative
  
  input
    border 0
    padding 0
    margin 0
    height 56px
    padding 16px 12px 16px 12px
    box-sizing border-box
    display block
    background-color transparent
    outline none !important
    width 100%
    cursor text
    // box-shadow inset 0px -1px 0px 0px gainsboro
    &::placeholder
      color alpha(black, low-emphasis)
    
  .bottom-outline
    position absolute
    left 0px
    bottom 0px
    right 0px
    height 3px
    background-color gainsboro
    transform scaleX(0)
    transform-origin 0 0
    transition transform 0.1s ease-out
    
  input:focus + .bottom-outline
    height 2px
    background-color primary-dark-color
    transform scaleX(1)
  
  // input 
  //   height 56px
  //   display block
  //   border 0
  //   padding 0
  //   outline 0 !important
  //   margin-left -16px
  //   padding-left 16px
  //   box-sizing border-box
  //   width calc(100% + 16px)
  //   background-color transparent
</style>