<template>
<div>
  <v-app>
  <v-container>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Registrar</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-form v-model="valid" ref="form" lazy-validation>
            <m-alert :alert="alert" :msg="msg" :errorAlert="errorAlert"/>
            <v-container grid-list-xl fluid>
                <v-text-field
                  label="Username"
                  v-model="form['username']"
                  :rules="nameRules"
                  :counter="15"
                  required
                ></v-text-field>
                <v-text-field
                  type="password"
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
                      :loading="dialog"
                      color="primary"
                      @click="submit">Registrar
                    </v-btn>
                    <v-btn
                      block
                      color="success"
                      v-if="alert"
                      to="/auth/signin"
                    >Login
                    </v-btn>
                  </v-flex>
                 </v-layout>
            </v-container>
          </v-form>
      </v-card>
    </v-flex>
  </v-container>
   </v-app>
</div>
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
  import { create } from '../services.js'

  export default {
    components: {
      MAlert
    },
    data: () => ({
      form: {
        password: '',
        email: '',
        username: ''
      },
      valid: true,
      nameRules: [
        v => !!v || 'Campo Obrigatorio*',
        v => (v && v.length <= 15) || 'Username até 15 carateres'
      ],
      passwordRules: [
        v => !!v || 'Campo Obrigatorio*',
        v => (v && v.length <= 10) || 'Password até 10 carateres'
      ],
      emailRules: [
        v => !!v || 'E-mail é Obrigatorio',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail Invalido'
      ],
      select: null,
      checkbox: false,
      alert: false,
      errorAlert: false,
      dialog: false,
      msg: ''
    }),
    mounted () {
      // console.log('this.$store.dispatch: ', this.$store.dispatch)
    },
    methods: {
      ...mapActions([
        'autoLogin'
      ]),
      submit () {
        // console.log('Entrou no submit')
        if (this.$refs.form.validate()) {
          // console.log('Entrou Aqui: ', this.form)
          this.dialog = true
          // Native form submission is not yet supported
          // axios.post('https://iagenda.herokuapp.com/api/users', {
          // axios.post('https://iagenda.herokuapp.com/api/users', {
          //   username: this.form.username,
          //   email: this.form.email,
          //   password: this.form.password
          // })
          create({
            username: this.form.username,
            email: this.form.email,
            password: this.form.password
          })
          .then(({user, token}) => {
            this.mySetVar()
            this.autoLogin({user, token})
            .then((data) => {
              // console.log('Dados: ', data)
              this.$router.push('/home')
            })
            // setTimeout((this.mySetVar), 4000))
          })
          .catch(err => {
            setTimeout(() => (this.dialog = false), 1000)
            this.errorAlert = true
            this.msg = err.response.data.message
          })
        }
      },
      mySetVar () {
        this.alert = true
        this.dialog = false
        this.msg = 'Usuario cadastrado com sucesso!!!'
        this.clear()
      },
      clear () {
        this.$refs.form.reset()
      }
    }
  }
</script>
