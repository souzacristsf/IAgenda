<template>
<v-layout row wrap>
  <v-flex md3>
    <data-picker :myEvents="arrayEvents"/>
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
    <my-table @compromisso="setCompromisso" :items="items"/>
  </v-flex>
</v-layout>
</template>
<script>
import DataPicker from '../../Shared/Components/DataPicker'
import MyTable from './ListEvent'
import {mapGetters} from 'vuex'
import {getMySchedule} from '../services'

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
    _id: ''
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
          this._id = e._id
          return e.event
        })[0]
        .map(item =>
        ({
          evento: item.name,
          sobre: item.description,
          dataInicial: new Date(item.date_initial),
          dataFim: new Date(item.date_end)
        }))

      console.log('this._id: ', this._id)
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
