<template>
  <v-app>
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
          :to="item.url"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      :clipped-left="clipped">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>web</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>remove</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <p style="margin: 0px">
        {{email}}
      </p>
      <v-btn icon title="Sair" @click.stop="onLogout">
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; IGenda 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
import nav from '../_nav'
import { getUser } from '@/auth'
import {mapActions} from 'vuex'

export default {
  name: 'App',
  data () {
    return {
      clipped: true,
      drawer: false,
      fixed: false,
      items: nav.items,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'IGenda',
      email: ''
    }
  },
  // computed: {
  //   // mix the getters into computed with object spread operator
  //   ...mapGetters([
  //     'getAuthEmail'
  //   ])
  // },
  mounted () {
    getUser()
      .then(user => (this.email = user.email))
  },
  methods: {
    ...mapActions([
      'logout'
    ]),
    onLogout () {
      this.logout()
        .then(() => {
          this.$router.push('/auth/signin')
        })
        .catch(err => {
          console.log('oi: ', err)
        })
    }
  }
}
</script>
<style>
 /* .toolbar--fixed {
   padding-left: 200px !important;
 } */
</style>
