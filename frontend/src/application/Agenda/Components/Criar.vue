<template>
<v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card height="200px">
        <v-card-title class="blue white--text">
          <span class="headline">Criar Agenda</span>

          <v-spacer></v-spacer>
            <v-dialog v-model="dialogShare" persistent max-width="450px">
                <v-btn slot="activator" icon class="mx-0" @click="findUsers()">
                  <v-icon color="white">share</v-icon>
                </v-btn>
                <v-card>
                  <v-card-title>
                    <span class="headline">Compartilhar Evento</span>
                  </v-card-title>
                  <v-card-text>
                    <v-text-field
                      append-icon="search"
                      label="Search"
                      single-line
                      hide-details
                      v-model="fSearch"
                    ></v-text-field>
                    <v-container>
                      <v-layout wrap>
                        <v-data-table
                          :headers="headersShare"
                          :items="people"
                          :search="fSearch"
                          v-model="selected"
                          item-key="username"
                          select-all
                          class="elevation-1">
                          <template slot="items" slot-scope="props">
                            <td>
                              <v-checkbox
                                v-model="props.selected"
                                primary
                                hide-details
                              ></v-checkbox>
                            </td>
                            <td width="290" class="text-xs-center">{{ props.item.username }}</td>
                          </template>
                        </v-data-table>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="dialogShare = false">Fechar</v-btn>
                    <!-- <v-btn color="blue darken-1" flat @click.native="editShareEvent()">Salvar</v-btn> -->
                  </v-card-actions>
                </v-card>
              </v-dialog>
        </v-card-title>
          <v-card>
            <v-container>
            <v-form ref="form">
              <m-alert :alert="alert" :errorAlert="errorAlert" :msg="msg"/>
                <v-text-field
                  label="Nome Agenda"
                  v-model="name"
                  :error-messages="nameErrors"
                  :counter="50"
                  @input="$v.name.$touch()"
                  @blur="$v.name.$touch()"
                  required
                ></v-text-field>
              <!-- <v-text-field
                label="Compartilhar Usuario ou E-mail"
                v-model="email"
                :error-messages="emailErrors"
                @input="$v.email.$touch()"
                @blur="$v.email.$touch()"
                required
                v-if="checkbox"
              ></v-text-field> -->
              <!-- <v-checkbox
                label="Compartilhar"
                v-model="checkbox"
              ></v-checkbox> -->
              <v-btn @click="submit" color="info" :disabled="!name">Criar</v-btn>
              <v-btn @click="clear">Cancelar</v-btn>
            </v-form>
            </v-container>
          </v-card>

      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import { validationMixin } from 'vuelidate'
import { createSchedule, getUsers } from '../services.js'
import { required, maxLength, email } from 'vuelidate/lib/validators'
import MAlert from '../../Components/Alert.vue'

export default {
  mixins: [validationMixin],
  components: {
    MAlert
  },
  validations: {
    name: { required, maxLength: maxLength(50) },
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
    msg: '',
    selected: [],
    people: [],
    dialogShare: false,
    fSearch: '',
    headersShare: [
      {
        text: 'Usuarios',
        align: 'center',
        sortable: true,
        value: 'username',
        width: '250'
      }
    ]
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
    findUsers () {
      getUsers()
      // console.log('Item: ', item)
        .then(res => {
          this.people = res
        })
        .catch(err => {
          console.log(err)
        })
        // .finally(() => (this.isLoading = false))
    },
    submit () {
      if (this.$refs.form.validate()) {
        const schedule = {
          name: this.name,
          shared_user_id: this.selected.map(u => u._id)
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
