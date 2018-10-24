<template>
<v-container>
  <v-flex>
    <v-toolbar color="blue" dark>
      <v-toolbar-title>Criar Agenda</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card>
      <v-container>
      <v-form ref="form">
        <m-alert :alert="alert" :errorAlert="errorAlert" :msg="msg"/>
        <v-text-field
          label="Nome Agenda"
          v-model="name"
          :error-messages="nameErrors"
          :counter="10"
          @input="$v.name.$touch()"
          @blur="$v.name.$touch()"
          required
        ></v-text-field>
        <v-text-field
          label="Compartilhar Usuario ou E-mail"
          v-model="email"
          :error-messages="emailErrors"
          @input="$v.email.$touch()"
          @blur="$v.email.$touch()"
          required
          v-if="checkbox"
        ></v-text-field>
        <v-checkbox
          label="Compartilhar"
          v-model="checkbox"
        ></v-checkbox>
        <v-btn @click="submit" color="info" :disabled="!name">Criar</v-btn>
        <v-btn @click="clear">Cancelar</v-btn>
      </v-form>
      </v-container>
    </v-card>
  </v-flex>
</v-container>
</template>
<script>
import { validationMixin } from 'vuelidate'
import { createSchedule } from '../services.js'
import { required, maxLength, email } from 'vuelidate/lib/validators'
import MAlert from '../../Components/Alert.vue'

export default {
  mixins: [validationMixin],
  components: {
    MAlert
  },
  validations: {
    name: { required, maxLength: maxLength(10) },
    email: { required, email },
    select: { required },
    checkbox: { required }
  },

  data: () => ({
    name: '',
    email: '',
    checkbox: false,
    alert: false,
    errorAlert: false,
    msg: ''
  }),

  computed: {
    checkboxErrors () {
      const errors = []
      if (!this.$v.checkbox.$dirty) return errors
      !this.$v.checkbox.required && errors.push('You must agree to continue!')
      return errors
    },
    nameErrors () {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.maxLength && errors.push('O nome é recomendado ter no máximo 10 caracteres')
      !this.$v.name.required && errors.push('Nome é Obrigatorio')
      return errors
    },
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty && !this.$v.checkbox.$required) return errors
      !this.$v.email.email && errors.push('E-mail invalido')
      !this.$v.email.required && errors.push('Usuario ou E-mail é Obrigatorio')
      return errors
    }
  },

  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        const schedule = {
          name: this.name,
          shared_users: this.email
        }
        createSchedule(schedule)
          .then(this.mySetVar)
          .catch(err => {
            console.log(`Err? `, err)
            this.errorAlert = true
            this.msg = err.response.data.message
          })
      }
      this.$v.$touch()
    },
    mySetVar () {
      this.alert = true
      this.msg = 'Agenda cadastrada com sucesso!!!'
      this.clear()
    },
    // clear () {
    //   this.$v.$reset()
    //   this.name = ''
    //   this.email = ''
    //   this.select = null
    //   this.checkbox = false
    // },
    clear () {
      this.name = ' '
      // this.$refs.form.reset()
    }
  }
}
</script>
