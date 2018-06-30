<template>
  <div>
    <v-alert
      :value="alert"
      color="success"
      icon="check_circle"
      outline
    >
      {{msg}}
    </v-alert>
    <v-alert
      :value="errorAlert"
      color="error"
      icon="warning"
      outline
    >
      {{msg}}
    </v-alert>
  </div>
</template>
<script>
  export default {
    data: () => ({}),
    props: {
      alert: {
        type: Boolean,
        default: () => false
      },
      errorAlert: {
        type: Boolean,
        default: () => false
      },
      msg: {
        type: String,
        default: () => 'Usuario cadastrado com sucesso!!!'
      }
    }
  }
</script>
