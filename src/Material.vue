<script>
import TextField from 'material-components-vue/dist/text-field'
import FloatingLabel from 'material-components-vue/dist/floating-label'
import LineRipple from 'material-components-vue/dist/line-ripple'
import Select from 'material-components-vue/dist/select'
import Menu from 'material-components-vue/dist/menu'
import Icon from 'material-components-vue/dist/icon'
import Tabs from 'material-components-vue/dist/tabs'
import List from 'material-components-vue/dist/list'
import Switch from 'material-components-vue/dist/switch'
import FormField from 'material-components-vue/dist/form-field'
import Checkbox from 'material-components-vue/dist/checkbox'
import Radio from 'material-components-vue/dist/radio'
// import Elevation from 'material-components-vue/dist/elevation'

import Vue from 'vue'
Vue.use(TextField)
Vue.use(FloatingLabel)
Vue.use(LineRipple)
Vue.use(Select)
Vue.use(Menu)
Vue.use(Icon)
Vue.use(Tabs)
Vue.use(List)
Vue.use(Switch)
Vue.use(FormField)
Vue.use(Checkbox)
Vue.use(Radio)
// Vue.use(Elevation)

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

@import "material-components-vue/dist/theme/styles";
@import "material-components-vue/dist/text-field/styles";
@import "material-components-vue/dist/floating-label/styles";
@import "material-components-vue/dist/line-ripple/styles";
@import "material-components-vue/dist/select/styles";
@import "material-components-vue/dist/menu/styles";
@import "material-components-vue/dist/tabs/styles";
@import "material-components-vue/dist/list/styles";
@import "material-components-vue/dist/switch/styles";
@import "material-components-vue/dist/form-field/styles";
@import "material-components-vue/dist/checkbox/styles";
@import "material-components-vue/dist/radio/styles";
// @import "material-components-vue/dist/elevation/styles";

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
