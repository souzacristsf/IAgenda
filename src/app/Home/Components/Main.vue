<template>
<v-layout row wrap>
  <v-flex md3>
    <data-picker :myEvents="arrayEvents"/>
  </v-flex>
  <v-flex md9>
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
    arrayEvents: []
  }),
  methods: {
    setCompromisso (events) {
      this.arrayEvents = events
      console.log('eventos: ', this.arrayEvents)
    }
  }
}
</script>
