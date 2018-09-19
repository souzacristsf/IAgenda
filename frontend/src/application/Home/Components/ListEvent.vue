<template>
  <div>
    <v-card>
      <v-card-title>
        Meus Eventos
        <v-spacer></v-spacer>
        <v-text-field
          append-icon="search"
          label="Search"
          single-line
          hide-details
          v-model="search"
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        class="elevation-1"
        :search="search"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td class="text-xs-left">{{ props.item.description }}</td>
          <td class="text-xs-left">{{ props.item.date_initial.toLocaleString() }}</td>
          <td class="text-xs-left">{{ props.item.date_end.toLocaleString() }}</td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="editItem(props.item)">
              <v-icon color="teal">edit</v-icon>
            </v-btn>
            <v-btn icon class="mx-0" @click="deleteItem(props.item)">
              <v-icon color="pink">delete</v-icon>
            </v-btn>
          </td>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Pesquisa para "{{ search }}" sem resultados.
        </v-alert>
        <template slot="no-data">
          <v-alert :value="true" color="error" icon="warning">
            Sem evento :(
          </v-alert>
        </template>
        <!-- <template slot="no-data">
          <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template> -->
      </v-data-table>
    </v-card>
    <v-container>
      <v-flex offset-sm11>
        <v-dialog v-model="dialog" max-width="800px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                {{$v.$invalid}}
                <!-- <v-form> -->
                <v-layout wrap>
                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Evento" prepend-icon="description" required v-model="editedItem.name"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Sobre" prepend-icon="description" required v-model="editedItem.description"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <!-- <v-text-field type="date" required label="Data Inicio" v-model="editedItem.date_initial"></v-text-field> -->
                      <v-menu
                        ref="menuInicio"
                        :close-on-content-click="false"
                        v-model="menuInicio"
                        :nudge-right="40"
                        :return-value.sync="dateInicio"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px">
                        <v-text-field
                          slot="activator"
                          v-model="editedItem.date_initial"
                          label="Data Inicio"
                          required
                          prepend-icon="event"
                          readonly
                        ></v-text-field>
                        <v-date-picker v-model="editedItem.date_initial" no-title scrollable>
                          <v-spacer></v-spacer>
                          <v-btn flat color="primary" @click="menuInicio = false">Cancel</v-btn>
                          <v-btn flat color="primary" @click="$refs.menuInicio.save(editedItem.date_initial)">OK</v-btn>
                        </v-date-picker>
                      </v-menu>
                      <v-dialog
                          ref="menuTimeInicio"
                          v-model="menuTimeI"
                          :return-value.sync="timeInicio"
                          persistent
                          lazy
                          full-width
                          width="290px">
                          <v-text-field
                            slot="activator"
                            v-model="timeInicio"
                            label="Hora Inicial"
                            required
                            prepend-icon="access_time"
                            readonly
                          ></v-text-field>
                          <v-time-picker
                            v-if="menuTimeI"
                            v-model="timeInicio"
                          >
                            <v-spacer></v-spacer>
                            <v-btn flat color="primary" @click="menuTimeI = false">Cancel</v-btn>
                            <v-btn flat color="primary" @click="$refs.menuTimeInicio.save(timeInicio)">OK</v-btn>
                          </v-time-picker>
                        </v-dialog>
                      <!-- </v-flex> -->
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <!-- <v-text-field type="date" required label="Data Fim" v-model="editedItem.date_end"></v-text-field> -->
                      <v-menu
                        ref="menuFim"
                        :close-on-content-click="false"
                        v-model="menuFim"
                        :nudge-right="40"
                        :return-value.sync="dateFim"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px">
                        <v-text-field
                          slot="activator"
                          v-model="editedItem.date_end"
                          label="Data Fim"
                          required
                          prepend-icon="event"
                          readonly
                        ></v-text-field>
                        <v-date-picker v-model="editedItem.date_end" no-title scrollable>
                          <v-spacer></v-spacer>
                          <v-btn flat color="primary" @click="menuFim = false">Cancel</v-btn>
                          <v-btn flat color="primary" @click="$refs.menuFim.save(editedItem.date_end)">OK</v-btn>
                        </v-date-picker>
                      </v-menu>
                      <v-dialog
                          ref="menuTimeFim"
                          v-model="menuTimeF"
                          :return-value.sync="timeFim"
                          persistent
                          lazy
                          full-width
                          width="290px">
                          <v-text-field
                            slot="activator"
                            v-model="timeFim"
                            label="Hora Final"
                            required
                            prepend-icon="access_time"
                            readonly
                          ></v-text-field>
                          <v-time-picker
                            v-if="menuTimeF"
                            v-model="timeFim"
                          >
                            <v-spacer></v-spacer>
                            <v-btn flat color="primary" @click="menuTimeF = false">Cancel</v-btn>
                            <v-btn flat color="primary" @click="$refs.menuTimeFim.save(timeFim)">OK</v-btn>
                          </v-time-picker>
                        </v-dialog>
                    </v-flex>
                      </v-layout>
                    <!-- </v-form> -->
                  <!-- <v-flex xs12 sm6 md4>
                    <v-text-field label="Protein (g)" v-model="editedItem.protein"></v-text-field>
                  </v-flex> -->
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
              <v-btn color="blue darken-1" :disabled="$v.$invalid" flat @click.native="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn v-if="!!id" fab color="primary" @click="dialog=true">
          <v-icon dark>add</v-icon>
        </v-btn>
      </v-flex>
    </v-container>
  </div>
</template>
<script>
  import { required } from 'vuelidate/lib/validators'
  export default {
    name: 'my-table',
    props: {
      items: {
        type: Array,
        default: () => []
      },
      id: {
        type: String
      }
    },
    data: () => ({
      search: '',
      dialog: false,
      dateInicio: '',
      dateFim: '',
      menuTimeInicio: false,
      menuTimeI: '',
      menuTimeFim: false,
      menuTimeF: '',
      timeInicio: null,
      timeFim: null,
      menuInicio: false,
      menuFim: false,
      headers: [
        {
          text: 'Evento',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        {
          text: 'Sobre',
          align: 'left',
          value: 'description'
        },
        {
          text: 'Data Inicial',
          value: 'date_initial'
        },
        {
          text: 'Data Final',
          value: 'date_end'
        }
      ],
      // items: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        description: '',
        date_initial: '',
        date_end: ''
      },
      defaultItem: {
        name: '',
        description: '',
        date_initial: '',
        date_end: ''
      }
    }),
    validations: {
      editedItem: {
        name: {
          required
        },
        description: {
          required
        },
        date_initial: {
          required
        },
        date_end: {
          required
        }
      },
      timeInicio: {
        required
      },
      timeFim: {
        required
      }
    },
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Novo Evento' : 'Editar Evento'
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    created () {
      // this.initialize()
    },

    methods: {
      // initialize () {
        // this.items = [
        //   {
        //     evento: 'Trabalho',
        //     sobre: 'Reunião',
        //     dataInicial: new Date(),
        //     dataFim: new Date()
        //   },
        //   {
        //     evento: 'Trabalho',
        //     sobre: 'Ensinar o estag',
        //     dataInicial: new Date(),
        //     dataFim: new Date()
        //   },
        //   {
        //     evento: 'Trabalho',
        //     sobre: 'Matar o Chefe',
        //     dataInicial: new Date(),
        //     dataFim: new Date()
        //   },
        //   {
        //     evento: 'Futbol',
        //     sobre: 'Jogar uma pelada',
        //     dataInicial: new Date(),
        //     dataFim: new Date()
        //   },
        //   {
        //     evento: 'Faculdade',
        //     sobre: 'Fazer Trabalho',
        //     dataInicial: new Date(),
        //     dataFim: new Date()
        //   }
        // ]
      //   this.setCompromisso()
      // },
      setCompromisso () {
        const compromissos = this.items
          .map(item => item.date_initial.toISOString().substr(0, 10))
        this.$emit('compromisso', compromissos)
      },
      editItem (item) {
        if (!this.$v.$invalid) {
          this.editedIndex = this.items.indexOf(item)
          this.editedItem = Object.assign({}, item)
          this.dialog = true
          this.setCompromisso()
        } else {
          this.$v.$touch()
        }
      },

      deleteItem (item) {
        const index = this.items.indexOf(item)

        confirm('Gostaria de deletar esse evento? ') && this.items.splice(index, 1) && this.$emit('delEvent', {_id: this.id, id_event: item._id})
        // this.items.splice(index, 1)
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.items[this.editedIndex], this.editedItem)
          console.log('this.editedIndex: ', this.editedIndex)
        } else {
          if (!this.$v.$invalid) {
            const dtIncio = new Date(this.editedItem.date_initial)
            const dtFim = new Date(this.editedItem.date_end)
            const novoEvento = {
              _id: this.id,
              name: this.editedItem.name,
              description: this.editedItem.description,
              date_initial: new Date(
                dtIncio.getFullYear(),
                dtIncio.getMonth(),
                dtIncio.getDate() + 1
              ),
              date_end: new Date(
                dtFim.getFullYear(),
                dtFim.getMonth(),
                dtFim.getDate() + 1
              )
            }
            this.$emit('newEvent', novoEvento)
            this.items.push(novoEvento)
          } else {
            this.$v.$touch()
          }
        }
        this.close()
        this.setCompromisso()
      }
    }
  }
</script>
