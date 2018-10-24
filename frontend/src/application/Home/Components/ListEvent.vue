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
          <td class="text-xs-left">
            <v-flex>
              <v-autocomplete
                v-model="friends"
                :disabled="isUpdating"
                :items="people"
                box
                chips
                color="blue-grey lighten-2"
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
          </td>
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
                  <v-flex xs12>
                    <v-autocomplete
                      v-model="friends"
                      :disabled="isUpdating"
                      :items="people"
                      box
                      chips
                      color="blue-grey lighten-2"
                      :search-input.sync="searchUsers"
                      label="Compartilhar Evento"
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
      searchUsers: null,
      friends: ['Sandra Adams', 'Britta Holt'],
      isUpdating: false,
      people: [
          { header: 'Usuarios' },
          { name: 'Sandra Adams', group: 'Group 1', avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg' },
          { name: 'Ali Connors', group: 'Group 1', avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg' },
          { name: 'Trevor Hansen', group: 'Group 1', avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg' },
          { name: 'Tucker Smith', group: 'Group 1', avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg' }
          // { divider: true },
          // { header: 'Group 2' },
          // { name: 'Britta Holt', group: 'Group 2', avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg' },
          // { name: 'Jane Smith ', group: 'Group 2', avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg' },
          // { name: 'John Smith', group: 'Group 2', avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg' },
          // { name: 'Sandra Williams', group: 'Group 2', avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg' }
      ],
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
        },
        {
          text: 'Evento Compartilhado',
          value: 'name'
        },
        {
          text: 'Ação',
          align: 'center',
          value: 'name'
        }
      ],
      // items: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        description: '',
        date_initial: '',
        date_end: '',
        id_event: ''
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
      },
      isUpdating (val) {
        console.log('Update isUpdating')
        if (val) {
          setTimeout(() => (this.isUpdating = false), 3000)
        }
      },
      searchUsers (val) {
        console.log('Mandou pesquisar sim')
        // Items have already been loaded
        if (this.people.length > 0) return
        // this.isLoading = true

        // Lazily load input items
        window.axios.get('https://api.coinmarketcap.com/v2/listings/')
          .then(res => {
            this.people = res.data.data
          })
          .catch(err => {
            console.log(err)
          })
          // .finally(() => (this.isLoading = false))
      }
    },
    methods: {
      remove (item) {
        const index = this.friends.indexOf(item.name)
        if (index >= 0) this.friends.splice(index, 1)
      },
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
      submitTableDateTime (d, time) {
        // console.log('submitTableDateTime: ', d, time, typeof d)
        const date = new Date(d)
        const hours = time.match(/^(\d+)/)[1]
        const minutes = time.match(/:(\d+)/)[1]
        return new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() + 1,
                hours,
                minutes
              )
        // date.setHours(hours)
        // date.setMinutes(minutes)
        // return date
      },
      setCompromisso () {
        const compromissos = this.items
          .map(item => new Date(item.date_initial).toISOString().substr(0, 10))
        this.$emit('compromisso', compromissos)
      },
      editItem (item) {
        // if (!this.$v.$invalid) {
        this.editedIndex = this.items.indexOf(item)

        const eItem = {
          name: item.name,
          description: item.description,
          date_initial: (new Date(item.date_initial)).toISOString(),
          date_end: (new Date(item.date_end)).toISOString(),
          id_event: item._id
        }

        this.editedItem = Object.assign({}, eItem)
        this.dialog = true
        // this.setCompromisso()
        // } else {
        //   this.$v.$touch()
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
          // const t = this.submitTableDateTime(this.editedItem.date_initial, this.timeInicio)
          // console.log('Date Formatada: ', t)
          // console.log('this.editedItem: ', this.editedItem)
          this.editedItem.date_initial = (this.submitTableDateTime(this.editedItem.date_initial, this.timeInicio)).toISOString()
          this.editedItem.date_end = (this.submitTableDateTime(this.editedItem.date_end, this.timeFim)).toISOString()
          const upEvent = {
            _id: this.id,
            name: this.editedItem.name,
            description: this.editedItem.description,
            date_initial: this.editedItem.date_initial,
            date_end: this.editedItem.date_end,
            id_event: this.editedItem.id_event
          }
          // console.log('this.editedItem: ', this.editedItem)
          // console.log('upEvent: ', upEvent)
          this.$emit('newEvent', upEvent, 'uEvent')
          Object.assign(this.items[this.editedIndex], this.editedItem)
        } else {
          if (!this.$v.$invalid) {
            const dtIncio = this.submitTableDateTime(this.editedItem.date_initial, this.timeInicio)
            const dtFim = this.submitTableDateTime(this.editedItem.date_end, this.timeFim)
            const novoEvento = {
              _id: this.id,
              name: this.editedItem.name,
              description: this.editedItem.description,
              date_initial: dtIncio,
              date_end: dtFim
            }
            this.$emit('newEvent', novoEvento)
            this.items.push(novoEvento)
          } else {
            this.$v.$touch()
          }
        }
        this.close()
        // this.setCompromisso()
      }
    }
  }
</script>
