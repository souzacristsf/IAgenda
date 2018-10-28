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
          <!-- {{props.item.shared_user_id[0].name}} -->
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
            <v-layout v-if="!!data">
              <!-- v-if="!!props.item.shared_user_id[0].name" -->
              <v-dialog v-model="dialogShare" persistent max-width="450px">
                <v-btn slot="activator" icon class="mx-0" @click="setUsersShare(props.item)">
                  <!-- @click="deleteItem(props.item)" -->
                  <v-icon color="primary">share</v-icon>
                </v-btn>
                <!-- <v-btn slot="activator" color="primary" dark>Open Dialog</v-btn> -->
                <v-card>
                  <v-card-title>
                    <span class="headline">Compartilhar Evento</span>
                    <!-- {{!props.item.shared_user_id[0].name}} -->
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
                          <!-- <template slot="headers" slot-scope="props">
                            <tr>
                              <th>
                                <v-checkbox
                                  :input-value="props.all"
                                  :indeterminate="props.indeterminate"
                                  primary
                                  hide-details
                                  @click.native="toggleAll"
                                ></v-checkbox>
                              </th>
                              <th
                                v-for="header in props.headers"
                                :key="header.text"
                                :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                                @click="changeSort(header.value)"
                              >
                                <v-icon small>arrow_upward</v-icon>
                                {{ header.text }}
                              </th>
                            </tr>
                          </template> -->
                          <template slot="items" slot-scope="props">
                            <td>
                              <v-checkbox
                                v-model="props.selected"
                                primary
                                hide-details
                              ></v-checkbox>
                            </td>
                            <td width="290" class="text-xs-center">{{ props.item.username }}</td>
                            <!-- <td class="justify-center layout px-0">
                              <v-btn icon class="mx-0" @click="delEventUserShare(props.item)">
                                <v-icon color="pink">delete</v-icon>
                              </v-btn>
                            </td> -->
                          </template>
                        </v-data-table>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="dialogShare = false">Fechar</v-btn>
                    <v-btn color="blue darken-1" flat @click.native="editShareEvent()">Salvar</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-layout>
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
                    <!-- <v-autocomplete
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
                    </v-autocomplete> -->
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
  import {getUsers, updateEvent, deleteUserEventShare} from '../services.js'
  // import { omit } from 'lodash'
  // import findUsers from './testeAuto.vue'
  export default {
    name: 'my-table',
    props: {
      items: {
        type: Array,
        default: () => []
      },
      id: {
        type: String
      },
      data: {
        type: Object
      }
    },
    data: () => ({
      pagination: {
        sortBy: 'name'
      },
      selected: [],
      eventSelected: {},
      users: [],
      isUpdating: false,
      people: [],
      srcs: [
        'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        'https://cdn.vuetifyjs.com/images/lists/2.jpg',
        'https://cdn.vuetifyjs.com/images/lists/3.jpg',
        'https://cdn.vuetifyjs.com/images/lists/4.jpg',
        'https://cdn.vuetifyjs.com/images/lists/5.jpg'
      ],
      event_id: '',
      search: '',
      fSearch: '',
      dialogShare: false,
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
      // people: [
      //     { header: 'Usuarios' },
      //     { name: 'Sandra Adams', group: 'Group 1', avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg' },
      //     { name: 'Ali Connors', group: 'Group 1', avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg' },
      //     { name: 'Trevor Hansen', group: 'Group 1', avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg' },
      //     { name: 'Tucker Smith', group: 'Group 1', avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg' }
      //     // { divider: true },
      //     // { header: 'Group 2' },
      //     // { name: 'Britta Holt', group: 'Group 2', avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg' },
      //     // { name: 'Jane Smith ', group: 'Group 2', avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg' },
      //     // { name: 'John Smith', group: 'Group 2', avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg' },
      //     // { name: 'Sandra Williams', group: 'Group 2', avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg' }
      // ],
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
        // {
        //   text: 'Evento Compartilhado',
        //   value: 'name',
        //   align: 'center'
        // },
        {
          text: 'Ação',
          value: 'name',
          align: 'left'
        }
      ],
      headersShare: [
        {
          text: 'Usuarios',
          align: 'center',
          sortable: true,
          value: 'username',
          width: '250'
        }
        // {
        //   text: 'Ação',
        //   value: 'calories',
        //   align: 'center',
        //   width: '250'
        // }
      ],
      peopleShare: [],
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
        if (val) {
          setTimeout(() => (this.isUpdating = false), 3000)
        }
      },
      users (val) {
        this.shareEvent(val)
      }
    },
    mounted () {
      // this.findUserss()
    },
    methods: {
      editShareEvent () {
        this.dialogShare = false
        // console.log('This.selected: ', this.selected)
        // console.log('this.eventSelected: ', this.eventSelected)
        const { name, date_initial, date_end, _id: id_event, description } = this.eventSelected
        const { shared_user_id } = this.selected.reduce((prev, el) => {
          prev.shared_user_id.push(el._id)
          return prev
        }, { shared_user_id: [] })
        // console.log('event: ', { name, date_initial, date_end, id_event, _id, description, shared_user_id })
        updateEvent({ name, date_initial, date_end, id_event, _id: this.id, description, shared_user_id })
          .then(data => {
            console.log('updateEvent event: ', this.data)

            this.$emit('updateList', this.data)
            // this.findUsers({ name, date_initial, date_end, id_event, _id: this.id, description, shared_user_id })
            // this.peopleShare.push({
            //   event_id: event.id_event,
            //   name: event.name,
            //   _id: event._id
            // })
          })
          .catch(err => {
            console.log('Erro: ', err)
          })
      },
      toggleAll () {
        if (this.selected.length) this.selected = []
        else this.selected = this.people.slice()
      },
      changeSort (column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      },
      delEventUserShare (item) {
        deleteUserEventShare(item)
          .then(data => {
            console.log('Usuario Deletado: ', data)
          })
      },
      setUsersShare (item) {
        console.log('setUsersShare: ', item)
        this.event_id = item._id
        this.eventSelected = item
        this.findUsers(item.shared_user_id)
        // this.peopleShare = item.shared_user_id.map(u => ({
        //   event_id: item._id,
        //   name: u.name,
        //   _id: u._id
        // }))
      },
      remove (item) {
        // console.log('Adiciona ou remove: ', item)
        // console.log('this.users: ', this.users)
        const index = this.users.indexOf(item)
        if (index >= 0) this.users.splice(index, 1)
      },
      shareEvent (item) {
        // console.log('item: ', item)
        // console.log('users event event: ', this.users)
        const event = item.reduce((prev, el) => {
          prev.name = el.name_event
          prev.date_initial = el.date_initial
          prev.date_end = el.date_end
          prev.id_event = el.id_event
          prev.description = el.description
          prev._id = el._id
          prev.shared_user_id.push(el.shared_user_id)
          return prev
        }, { name: '', date_initial: '', date_end: '', id_event: '', _id: '', description: '', shared_user_id: [] })
        // console.log('users event: ', event)
                // users = []
        updateEvent(event)
          .then(data => {
            console.log('updateEvent event: ', event)
            this.peopleShare.push({
              event_id: event.id_event,
              name: event.name,
              _id: event._id
            })
          })
          .catch(err => {
            console.log('Erro: ', err)
          })
      },
      findUsers (item) {
        getUsers()
        // console.log('Item: ', item)
          .then(res => {
            console.log('Usuarios: ', res, item)
            const username = new Set(item.map(el => el.name))
            this.selected = res.filter(e => username.has(e.username))
            this.people = res

            // console.log('this.selected: ', this.selected)

            // this.people = res.map((u, i) => {
            //   return {
              //     shared_user_id: u._id,
            //     name: u.username,
            //     avatar: this.srcs[i],
            //     id_event: item._id,
            //     date_end: item.date_end,
            //     date_initial: item.date_initial,
            //     description: item.description,
            //     name_event: item.name,
            //     _id: this.id
            //   }
            // })
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => (this.isLoading = false))
      },
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
            // console.log('novoEvento: ', novoEvento)
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
