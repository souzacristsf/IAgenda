<template>
  <v-layout>
    <v-dialog v-model="show" max-width="500">
       <v-flex xs12 offset>
      <v-card class="my-modal">
        <!-- <v-card-title
          class="headline"
        >Use Google's location service?</v-card-title> -->
        <v-card-media
          class="white--text"
          height="230px"
          :src="info.imageModal"
        >
        </v-card-media>
        <v-card-text>{{info.description}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- <v-btn color="green darken-1" flat="flat" @click.native="show = false">Fechar</v-btn> -->
          <v-btn color="green darken-1" flat="flat" @click.native="show = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
       </v-flex>
    </v-dialog>
  </v-layout>
</template>
<script>
  export default {
    name: 'modal',
    props: {
      info: {
        type: Object,
        default: () => {}
      },
      visible: Boolean,
      default: function () {
        return false
      }
    },
    data () {
      return {
        // dialog: true
      }
    },
    computed: {
      show: {
        get: function () {
          return this.visible
        },
        set: function (value) {
          if (!value) {
            this.$emit('close')
          }
        }
      }
    }
  }
</script>
<style>
  .my-modal {
    /* height: 500px !important; */
     object-fit: cover;
  }
</style>
