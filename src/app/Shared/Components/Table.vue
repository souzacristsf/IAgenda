<template>
  <div>
    <v-dialog v-model="dialog" max-width="600px">
      <v-btn
        color="primary"
        dark slot="activator"
        class="mb-2 text-xs-right">Nova Agenda</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Agenda" v-model="editedItem.agenda"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Sobre" v-model="editedItem.sobre"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field type="date" label="Data Inicio" v-model="editedItem.dataInicial"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field type="date" label="Data Fim" v-model="editedItem.dataFim"></v-text-field>
              </v-flex>
              <!-- <v-flex xs12 sm6 md4>
                <v-text-field label="Protein (g)" v-model="editedItem.protein"></v-text-field>
              </v-flex> -->
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-card-title>
        Minha Agenda
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
          <td>{{ props.item.agenda }}</td>
          <td class="text-xs-left">{{ props.item.sobre }}</td>
          <td class="text-xs-left">{{ props.item.dataInicial.toLocaleString() }}</td>
          <td class="text-xs-left">{{ props.item.dataFim.toLocaleString() }}</td>
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
          <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
  export default {
    name: 'my-table',
    data: () => ({
      search: '',
      dialog: false,
      headers: [
        {
          text: 'Agendas',
          align: 'left',
          sortable: false,
          value: 'agenda'
        },
        {
          text: 'Sobre',
          align: 'left',
          value: 'sobre'
        },
        {
          text: 'Data Inicial',
          value: 'dataInicial'
        },
        {
          text: 'Data Final',
          value: 'dataFim'
        }
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        agenda: '',
        sobre: '',
        dataInicial: '',
        dataFim: ''
      },
      defaultItem: {
        agenda: '',
        sobre: '',
        dataInicial: '',
        dataFim: ''
      }
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nova Agenda' : 'Editar Agenda'
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        this.items = [
          {
            agenda: 'Trabalho',
            sobre: 'Reunião',
            dataInicial: new Date(),
            dataFim: new Date()
          },
          {
            agenda: 'Trabalho',
            sobre: 'Ensinar o estag',
            dataInicial: new Date(),
            dataFim: new Date()
          },
          {
            agenda: 'Trabalho',
            sobre: 'Matar o Chefe',
            dataInicial: new Date(),
            dataFim: new Date()
          },
          {
            agenda: 'Futbol',
            sobre: 'Jogar uma pelada',
            dataInicial: new Date(),
            dataFim: new Date()
          },
          {
            agenda: 'Faculdade',
            sobre: 'Fazer Trabalho',
            dataInicial: new Date(),
            dataFim: new Date()
          }
        ]
        this.setCompromisso()
      },
      setCompromisso () {
        const compromissos = this.items
          .map(item => item.dataInicial.toISOString().substr(0, 10))
        this.$emit('compromisso', compromissos)
      },
      editItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
        this.setCompromisso()
      },

      deleteItem (item) {
        const index = this.items.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.items.splice(index, 1)
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
        } else {
          const dtIncio = new Date(this.editedItem.dataInicial)
          const dtFim = new Date(this.editedItem.dataFim)
          const novaAgenda = {
            agenda: this.editedItem.agenda,
            sobre: this.editedItem.sobre,
            dataInicial: new Date(
              dtIncio.getFullYear(),
              dtIncio.getMonth(),
              dtIncio.getDate() + 1
            ),
            dataFim: new Date(
              dtFim.getFullYear(),
              dtFim.getMonth(),
              dtFim.getDate() + 1
            )
          }
          this.items.push(novaAgenda)
        }
        this.close()
        this.setCompromisso()
      }
    }
  }
</script>
