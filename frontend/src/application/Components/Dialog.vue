<template>
  <div class="text-xs-center">
    <v-dialog
      v-model="dialog"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Cadastrando Usuario...
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  export default {
    data: () => ({}),
    props: {
      dialog: {
        type: Boolean,
        default: () => true
      }
    }
  }
</script>
