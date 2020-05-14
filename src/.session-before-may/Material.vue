<script>
import Checkbox from 'material-components-vue/dist/checkbox'
// import Elevation from 'material-components-vue/dist/elevation'
import FloatingLabel from 'material-components-vue/dist/floating-label'
import FormField from 'material-components-vue/dist/form-field'
import Icon from 'material-components-vue/dist/icon'
import LineRipple from 'material-components-vue/dist/line-ripple'
import LinearProgress from 'material-components-vue/dist/linear-progress'
import List from 'material-components-vue/dist/list'
import Menu from 'material-components-vue/dist/menu'
import Radio from 'material-components-vue/dist/radio'
import Select from 'material-components-vue/dist/select'
import Switch from 'material-components-vue/dist/switch'
import Tabs from 'material-components-vue/dist/tabs'
import TextField from 'material-components-vue/dist/text-field'

import Vue from 'vue'
Vue.use(Checkbox)
// Vue.use(Elevation)
Vue.use(FloatingLabel)
Vue.use(FormField)
Vue.use(Icon)
Vue.use(LineRipple)
Vue.use(LinearProgress)
Vue.use(List)
Vue.use(Menu)
Vue.use(Radio)
Vue.use(Select)
Vue.use(Switch)
Vue.use(Tabs)
Vue.use(TextField)

export default {
  name: 'Material'
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Rubik:300,300i,400,400i,500,500i,700&subset=all');

$mdc-typography-font-family: Rubik, sans-serif;
$mdc-theme-primary: #616161;
$mdc-theme-secondary: #424242;
$mdc-theme-on-primary: rgba(255, 255, 255, 0.87);
$mdc-theme-on-secondary: rgba(255, 255, 255, 0.87);

@import "material-components-vue/dist/checkbox/styles";
// @import "material-components-vue/dist/elevation/styles";
@import "material-components-vue/dist/floating-label/styles";
@import "material-components-vue/dist/form-field/styles";
@import "material-components-vue/dist/line-ripple/styles";
@import "material-components-vue/dist/linear-progress/styles";
@import "material-components-vue/dist/list/styles";
@import "material-components-vue/dist/menu/styles";
@import "material-components-vue/dist/radio/styles";
@import "material-components-vue/dist/select/styles";
@import "material-components-vue/dist/switch/styles";
@import "material-components-vue/dist/tabs/styles";
@import "material-components-vue/dist/text-field/styles";
@import "material-components-vue/dist/theme/styles";

.mdc-form-field {
  label {
    cursor: pointer;
  }
}

.mdc-tab {
  padding-left: 16px;
  padding-right: 16px;
  @media (min-width: 768px) {
    padding-left: 24px;
    padding-right: 24px;
  }
}

.mdc-text-field:not(.mdc-text-field--disabled) {
  background-color: transparent;
}

.mdc-text-field::before,
.mdc-tab__ripple::before {
  background-color: var(--mdc-theme-primary, $mdc-theme-primary);
}

.mdc-text-field:hover::before,
.mdc-tab__ripple:hover::before {
  opacity: 0.085;
}

.mdc-text-field.mdc-ripple-upgraded--background-focused::before,
.mdc-tab__ripple.mdc-ripple-upgraded--background-focused::before {
  opacity: 0.085;
}
</style>
