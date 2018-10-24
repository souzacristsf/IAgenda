// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vuelidate from 'vuelidate'
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VDivider,
  VCard,
  VTimePicker,
  VDatePicker,
  VDataTable,
  VTextField,
  VCheckbox,
  VForm,
  VSelect,
  VDialog,
  VBtn,
  VIcon,
  VGrid,
  VAlert,
  VToolbar,
  transitions,
  VProgressLinear,
  VMenu,
  VAutocomplete,
  VChip,
  VAvatar
} from 'vuetify'
import '../node_modules/vuetify/src/stylus/app.styl'

Vue.use(Vuelidate)
Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VDivider,
    VCard,
    VTimePicker,
    VDatePicker,
    VDataTable,
    VTextField,
    VCheckbox,
    VForm,
    VSelect,
    VDialog,
    VBtn,
    VIcon,
    VGrid,
    VAlert,
    VToolbar,
    transitions,
    VProgressLinear,
    VMenu,
    VAutocomplete,
    VChip,
    VAvatar
  },
  theme: {
    primary: '#2196f3',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
