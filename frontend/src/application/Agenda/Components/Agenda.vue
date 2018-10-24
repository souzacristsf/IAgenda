<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Minha Agenda</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <v-btn slot="activator" color="primary" dark class="mb-2">Nova Agenda</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="editedItem.name" label="Nome"></v-text-field>
                </v-flex>
                <!-- <v-flex xs12 sm6 md6>
                  <v-text-field v-model="formattedDate" label="Data Criação"></v-text-field>
                </v-flex> -->
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">Cancelar</v-btn>
            <v-btn color="blue darken-1" :disabled="!editedItem.name" flat @click.native="save">Confirmar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="items"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td class="text-xs-center">{{ (new Date(props.item.createdAt)).toLocaleString() }}</td>
        <td class="justify-center layout px-0">
          <!-- <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          >
            edit
          </v-icon>
          <v-icon
            small
            @click="deleteItem(props.item)"
          >
            delete
          </v-icon> -->
          <v-btn icon class="mx-0" @click="editItem(props.item)">
              <v-icon color="teal">edit</v-icon>
            </v-btn>
            <v-btn icon class="mx-0" @click="deleteItem(props.item)">
              <v-icon color="pink">delete</v-icon>
            </v-btn>
        </td>
      </template>
      <!-- <template slot="no-data">
        <v-btn color="primary" type="button" @click="initialize">Reset</v-btn>
      </template> -->
      <template slot="no-data">
        <v-alert :value="true" color="error" icon="warning">
          Você está sem agenda cadastrada :(
        </v-alert>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import {getMySchedule, delMySchedule, editMySchedule} from '../services'
  import {mapGetters} from 'vuex'
  // import moment from 'moment'
  export default {
    data: () => ({
      dialog: false,
      // nenewDatewDate: '',
      headers: [
        {
          text: 'Agenda',
          align: 'left',
          sortable: true,
          value: 'name',
          width: '300'
        },
        { text: 'Data Criação', align: 'center', value: 'createdAt' },
        { text: 'Actions', align: 'center', value: 'name', sortable: false }
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        createdAt: 0
      },
      defaultItem: {
        name: '',
        createdAt: 0
      }
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Criar Agenda' : 'Editar Agenda'
      },
      ...mapGetters([
        'getIdUser'
      ]),
      formattedDate: {
        get () {
          console.log('Me chamou: ', this.editedItem.createdAt)
          return (this.editedItem.createdAt === 0) ? (new Date()).toLocaleString() : (new Date(this.editedItem.createdAt)).toLocaleString()
        },
        set (newValue) {
          const [date, time] = (newValue) ? newValue.split(' ') : null
          const [dia, mes, ano] = (newValue) ? date.split('/') : null
          const [hora, minuto, segundo] = time.split(':')
          let newData = new Date(
              ano,
              mes - 1,
              dia,
              hora,
              minuto,
              segundo
            )
          // console.log('Set: ', newValue)
          // console.log('Set newValue: ', new Date(newValue))
          // console.log('Set value: ', moment(newValue, 'DD/MM/YYYY HH:mm:ss'))
          this.newDate = isNaN(Date.parse(newData)) ? null : newValue
          console.log('Set newDate: ', this.newDate)
        }
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    created () {
      this.initialize()
      this.loadMySchedule()
    },

    methods: {
      loadMySchedule () {
        getMySchedule(this.getIdUser)
          .then(({schedule}) => {
            // console.log('schedule: ', schedule)
            console.log('schedule: ', schedule)
            this.items = schedule
            // this.schedule = schedule
            // this.mySchendule = schedule.map(s => s.name)
          })
      },
      initialize () {
        this.items = [
          {
            name: 'Frozen Yogurt',
            createdAt: 159
          },
          {
            name: 'Ice cream sandwich',
            createdAt: 237
          }
        ]
      },

      editItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        console.log('deleteItem (item): ', item)
        const index = this.items.indexOf(item)
        confirm('Excluir a agenda?') && this.delMySchedule(item._id, index)
      },
      delMySchedule (item, index) {
        delMySchedule(item)
          .then(t => this.items.splice(index, 1))
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
          editMySchedule({name: this.editedItem.name, _id: this.editedItem._id})
            .then(t => {
              Object.assign(this.items[this.editedIndex], this.editedItem)
              console.log('Editou: ', t)
            })
          Object.assign(this.items[this.editedIndex], this.editedItem)
        } else {
          this.items.push(this.editedItem)
        }
        this.close()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
} */
</style>
