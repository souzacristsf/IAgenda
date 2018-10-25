<template>
<v-form>
  <v-container>
    <v-layout wrap>
      <v-flex xs12>
        <v-autocomplete
          v-model="users"
          :loading="isLoading"
          :items="people"
          @focus="teste"
          box
          chips
          color="blue-grey lighten-2"
          label="Select"
          item-text="name"
          item-value="name"
          multiple>
          <template
            slot="selection"
            slot-scope="data"
          >
            <v-chip
              :selected="data.selected"
              close
              class="chip--select-multi"
              @input="remove(data.item)"
            >
              <v-avatar>
                <img :src="data.item.avatar">
              </v-avatar>
              {{ data.item.name }}
            </v-chip>
          </template>
          <template
            slot="item"
            slot-scope="data"
          >
            <template v-if="typeof data.item !== 'object'">
              <v-list-tile-content v-text="data.item"></v-list-tile-content>
            </template>
            <template v-else>
              <v-list-tile-avatar>
                <img :src="data.item.avatar">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                <v-list-tile-sub-title v-html="data.item.group"></v-list-tile-sub-title>
              </v-list-tile-content>
            </template>
          </template>
        </v-autocomplete>
      </v-flex>
    </v-layout>
  </v-container>
</v-form>
</template>
<script>
  import {getUsers} from '../services.js'
  export default {
    data () {
      return {
        users: [],
        isUpdating: false,
        people: [],
        srcs: [
          'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          'https://cdn.vuetifyjs.com/images/lists/2.jpg',
          'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          'https://cdn.vuetifyjs.com/images/lists/4.jpg',
          'https://cdn.vuetifyjs.com/images/lists/5.jpg'
        ]
      }
    },

    watch: {
      isUpdating (val) {
        if (val) {
          setTimeout(() => (this.isUpdating = false), 3000)
        }
      }
    },

    methods: {
      remove (item) {
        const index = this.friends.indexOf(item.name)
        if (index >= 0) this.friends.splice(index, 1)
      },
      teste () {
        console.log('Me Chamou')
        getUsers()
          .then(res => {
            // const { count, entries } = res.data
            this.people = res.map((u, i) => {
              console.log('Index: ', this.srcs[i])
              return { name: u.username, _id: u._id, avatar: this.srcs[i] }
            })
            console.log('res: ', this.people)
            // this.count = count
            // this.entries = entries
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => (this.isLoading = false))
      }
    }
  }
</script>
