<template>
  <v-app>
  <v-container>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Login</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-form v-model="valid" ref="form" lazy-validation>
            <m-alert :msg="msg" :errorAlert="errorAlert"/>
            <v-container grid-list-xl fluid>
                <v-text-field
                  label="Username ou E-mail"
                  v-model="form['username']"
                  :rules="nameRules"
                  :counter="15"
                  required
                ></v-text-field>
                <v-text-field
                  label="Password"
                  type="password"
                  v-model="form['password']"
                  :rules="passwordRules"
                  required
                ></v-text-field>
                <v-checkbox
                  label="Manter conectado?"
                  v-model="checkbox"
                  :rules="[v => !!v || 'Campo Obrigatorio!']"
                  required
                ></v-checkbox>
                 <v-layout row>
                  <v-flex  >
                    <v-btn
                      block
                      @click="submit"
                      large
                      color="success"
                      :disabled="!valid"
                    >Entrar
                    </v-btn>
                    <v-btn
                      block
                      color="primary"
                      to="/auth/signup"
                    >Registrar
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
  import MAlert from '../../Components/Alert.vue'
  import {mapActions} from 'vuex'
  // import axios from 'axios'

  export default {
    components: {
      MAlert
    },
    data: () => ({
      valid: true,
      form: {
        username: '',
        password: ''
      },
      nameRules: [
        v => !!v || 'Username é Obrigatorio',
        v => (v && v.length <= 15) || 'Username até 15 carateres'
      ],
      passwordRules: [
        v => !!v || 'Campo Obrigatorio*',
        v => (v && v.length <= 10) || 'Password até 10 carateres'
      ],
      select: null,
      checkbox: false,
      errorAlert: false,
      msg: ''
    }),

    methods: {
      ...mapActions([
        'attemptLogin'
      ]),
      submit () {
        const {username, password} = this.form
        if (this.$refs.form.validate()) {
          // Native form submission is not yet supported
          this.attemptLogin({username, password})
          .then((data) => {
            console.log('Dados: ', data)
            this.$router.push('/home')
          })
          .catch(err => {
            this.errorAlert = true
            this.msg = err.response.data.message
            console.log('oi: ', err.response.data.message)
          })
          // axios.post('http://localhost:4040/api/auth', {
          //   username: this.username,
          //   password: this.password
          // }).then(data => console.log('Dados: ', data)
          // this.$router.push('/home')
          // )
          // to="/home"
        }
      },
      clear () {
        this.$refs.form.reset()
      }
    }
  }
</script>
