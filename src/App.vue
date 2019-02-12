<template lang="pug">
  .minota-app
    router-view
    //- table-component
    //- screen-component
    //- p Привет!
    //- p К этой новой обработке Науки логики, первый том которой теперь выходит в свет, я, должен сказать, приступил с полным сознанием как трудности и предмета самого по себе, а затем и его изложения, так и несовершенства его обработки в первом издании. Сколько я ни старался после дальнейших многолетних занятий этой наукой устранить это несовершенство, я все же чувствую, что имею еще достаточно причин просить читателя быть ко мне снисходительным. Право же на таковое снисхождение может быть прежде всего обосновано тем обстоятельством, что для содержания я нашел в прежних метафизике и логике преимущественно только внешний материал. Хотя эти науки разрабатывались часто и повсюду, — последняя из указанных наук разрабатывается еще и поныне, — все же эта разработка мало касалась спекулятивной стороны, а скорее повторялся тот же самый материал, который попеременно то разжижался до тривиальной поверхностности, то расширялся благодаря тому, что снова вытаскивался старый баласт, так что от таких, часто лишь совершенно механических, стараний философское содержание ничего не могло выиграть. Изображение царства мысли философски, т. е. в его собственной имманентной деятельности, или, что то же самое, в его необходимом развитии, должно было поэтому явиться новым предприятием, и приходилось начинать все с самого начала. Вышеуказанный же ранее приобретенный материал — уже известные формы мысли — должен рассматриваться как в высшей степени важный подсобный материал (Vorlage) и даже как необходимое условие, как заслуживающая нашу благодарность предпосылка, хотя этот материал лишь кое-где дает нам слабую нить или безжизненные кости скелета, к тому же еще перемешанные между собою в беспорядке.

    //- .minota-app-header(v-bind:class="viewClasses")
    //-   actions-component
    //- .minota-app-main
    //-   .minota-app-views(v-bind:class="viewClasses")
    //-     .minota-app-view
    //-       table-component
    //-     .minota-app-view
    //-       drawer-component
    //- .minota-app-footer(v-bind:class="viewClasses")

</template>

<script>
import { mapGetters } from 'vuex'
// import ActionsComponent from '@/components/Actions'
// import DrawerComponent from '@/components/Drawer'
import TableComponent from '@/components/screens/Table'
// import ScreenComponent from '@/components/layout/Screen';
// import BodyScrollTopOn from '@/directives/body-scroll-top-on'
// import ScrollStartOn from '@/directives/scroll-start-on'

export default {
  name: 'App',

  components: {
    // ActionsComponent,
    // DrawerComponent,
    TableComponent
    // ScreenComponent
  }

  // directives: {
  //   BodyScrollTopOn,
  //   ScrollStartOn
  // },

  // computed: {
  //   viewClasses () {
  //     return {
  //       table: this.getView === 'table',
  //       drawer: this.getView === 'drawer'
  //     }
  //   },
  //   ...mapGetters([
  //     'getFocus',
  //     'getView'
  //   ])
  // },

  // mounted () {
  //   // Remove preloader screen
  //   setTimeout(() => {
  //     // const appPreloader = document.getElementById('app-preloader')
  //     // appPreloader.classList.add('app-loaded')
  //     setTimeout(() => {
  //       // appPreloader.remove()
  //     }, 1000)
  //   }, 3000)
  // }
}
</script>

<style lang="stylus">
@import "~@/assets/styles/index"
@import "~@/assets/styles/variables"


html
body
  margin 0
  padding 0
  height 100% // Hack parent container
  
  // background-color ghostwhite
  // box-shadow inset 0px 0px 0px 10px green

.minota-app
  position relative
  min-height 100%
  overflow hidden
  display flex
  flex-direction column
  
  background-color ghostwhite
  color alpha(black, high-emphasis)
  // box-shadow inset 0px 0px 0px 5px lightblue


  
  // width 100vw
  // height 100vh
  // overflow hidden
  // z-index 0
  // display flex
  // flex-direction column
  // justify-content value

// .minota-app-header
// .minota-app-footer
//   flex-basis 48px
//   min-height 48px
//   flex-shrink 0
//   z-index 1
//   // transition background-color 0.3s ease-out

// .minota-app-main
//   flex-grow 1
//   overflow hidden
//   display flex
//   z-index 0

// .minota-app-views
//   display flex
//   position relative
//   // transition left 0.3s ease-out

// .minota-app-view
//   overflow-y auto
//   -webkit-overflow-scrolling touch
//   display flex
//   width 100vw

// .minota-app-views.table
//   left 0vw

// .minota-app-views.drawer
//   left -100vw

// .minota-app-header.table
// .minota-app-footer.table
//   background-color white
// .minota-app-header.drawer
// .minota-app-footer.drawer
//   background-color ghostwhite
</style>
