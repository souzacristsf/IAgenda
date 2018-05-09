<template>
<v-layout row wrap>
  <v-flex md3>
    <data-picker :myEvents="arrayEvents"/>
  </v-flex>
  <v-flex md9 >
    <v-flex xs12 sm4 offset-sm3>
      <v-container>
        <v-select
          :items="states"
          v-model="e1"
          label="Selecione a Agenda"
          single-line
          light="true"
          auto
          prepend-icon="schedule"
          hide-details
        >
        </v-select>
      </v-container>
    </v-flex>
    <my-table @compromisso="setCompromisso" />
  </v-flex>
</v-layout>
</template>
<script>
import DataPicker from '../../Shared/Components/DataPicker'
import MyTable from '../../Shared/Components/Table'

export default {
  name: 'main-home',
  components: {
    DataPicker,
    MyTable
  },
  data: () => ({
    arrayEvents: [],
    states: [
      'Trabalho', 'Futebol', 'Banco'
    ]
  }),
  methods: {
    setCompromisso (events) {
      this.arrayEvents = events
      console.log('eventos: ', this.arrayEvents)
    }
  }
}
</script>
<style>
  /* .navigation-drawer {
    width: 200px !important;
  } */
</style>
