<template>
  <v-app>
  <v-container>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Registrar</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-form v-model="valid" ref="form" lazy-validation>
            <v-container grid-list-xl fluid>
                <v-text-field
                  label="Username"
                  v-model="form['username']"
                  :rules="nameRules"
                  :counter="10"
                  required
                ></v-text-field>
                <v-text-field
                  label="Password"
                  v-model="form['password']"
                  :rules="passwordRules"
                  required
                ></v-text-field>
                <v-text-field
                  label="E-mail"
                  v-model="form['email']"
                  :rules="emailRules"
                  required
                ></v-text-field>
                 <v-layout row>
                  <v-flex  >
                    <v-btn
                      block
                      color="primary"
                      @click="submit">Registrar
                    </v-btn>
                  </v-flex>
                 </v-layout>
            </v-container>
          </v-form>
      </v-card>
    </v-flex>
  </v-container>
   </v-app>
</template>

<style>
  body{
    background: #666 !important;
  }
</style>
<script>
  import axios from 'axios'

  export default {
    data: () => ({
      form: {
        password: '',
        email: '',
        username: ''
      },
      valid: true,
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ],
      passwordRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      select: null,
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4'
      ],
      checkbox: false
    }),

    methods: {
      submit () {
        console.log('Entrou no submit')
        if (this.$refs.form.validate()) {
          console.log('Entrou Aqui: ', this.form)
          // Native form submission is not yet supported
          axios.post('http://localhost:4040/api/users', {
            username: this.form.username,
            email: this.form.email,
            password: this.form.password
          })
          .then(data => console.log('Inseriu usuario: ', data))
        }
      },
      clear () {
        this.$refs.form.reset()
      }
    }
  }
</script>
