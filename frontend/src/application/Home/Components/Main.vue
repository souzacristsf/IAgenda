<template>
<v-layout row wrap>
  <v-flex md3>
    <data-picker :myEvents="arrayEvents" />
  </v-flex>
  <v-flex md9 >
    <v-flex xs12 sm4 offset-sm3>
      <v-container>
        <v-select
          :items="mySchendule"
          v-model="selSchedule"
          label="Selecione a Agenda"
          single-line
          auto
          prepend-icon="schedule"
          hide-details
          @change="loadEvent"
        >
        </v-select>
      </v-container>
    </v-flex>
    <v-alert
        :value="alert"
        type="success"
        transition="scale-transition"
      >
        {{msg}}
      </v-alert>
    <my-table
      @compromisso="setCompromisso"
      @newEvent="submitEvent"
      @delEvent="deleteEvent"
      :items="items"
      :id="id"/>
  </v-flex>
</v-layout>
</template>
<script>
import DataPicker from '../../Shared/Components/DataPicker'
import MyTable from './ListEvent'
import {mapGetters} from 'vuex'
import {getMySchedule, createEvent, deleteEvent, updateEvent} from '../services'

export default {
  name: 'main-home',
  components: {
    DataPicker,
    MyTable
  },
  data: () => ({
    arrayEvents: [],
    mySchendule: [],
    schedule: [],
    selSchedule: '',
    items: [],
    id: '',
    alert: false,
    msg: ''
  }),
  computed: {
    ...mapGetters([
      'getIdUser'
    ])
  },
  mounted () {
    this.loadMySchedule()
  },
  methods: {
    setCompromisso (events) {
      this.arrayEvents = events
      // console.log('eventos: ', this.arrayEvents)
    },
    submitEvent (event, type) {
      if (typeof type === 'string') {
        this.updateEvent(event)
      } else {
        this.createNewEvent(event)
      }
    },
    updateEvent (event) {
      updateEvent(event)
        .then(data => {
          this.loadMySchedule()
          this.alert = true
          this.msg = 'Evento atualizado com sucesso!!!.'
          setTimeout(() => {
            this.alert = false
          }, 2000)
        })
        .catch(err => {
          this.alert = true
          this.msg = err.response.data.message
          setTimeout(() => {
            this.alert = false
          }, 2000)
        })
    },
    createNewEvent (event) {
      createEvent(event)
        .then(data => {
          this.loadMySchedule()
          this.alert = true
          this.msg = 'Evento criado com sucesso!!!.'
          setTimeout(() => {
            this.alert = false
          }, 2000)
        })
        .catch(err => {
          this.alert = true
          this.msg = err.response.data.message
          setTimeout(() => {
            this.alert = false
          }, 2000)
        })
    },
    deleteEvent (id) {
      deleteEvent(id)
        .then(data => {
          console.log('evento deletado: ', data)
          this.alert = true
          this.msg = 'Evento deletado com sucesso!!!.'
          setTimeout(() => {
            this.alert = false
          }, 2000)
        })
        .catch(err => {
          this.alert = true
          this.msg = err.response.data.message
          setTimeout(() => {
            this.alert = false
          }, 2000)
        })
    },
    loadMySchedule () {
      getMySchedule(this.getIdUser)
        .then(({schedule}) => {
          // console.log('schedule: ', schedule)
          this.schedule = schedule
          this.mySchendule = schedule.map(s => s.name)
        })
    },
    loadEvent (name) {
      this.items = this.schedule
        .filter(e => e.name === name)
        .map(e => {
          this.id = e._id
          return e.event
        })[0]
        .map(item =>
        ({
          _id: item._id,
          name: item.name,
          description: item.description,
          date_initial: new Date(item.date_initial),
          date_end: new Date(item.date_end)
        }))

      console.log('this._id: ', this.id)
      console.log('event escolhido : ', this.items)
    }
  }
}
</script>
<style>
  /* .navigation-drawer {
    width: 200px !important;
  } */
</style>
