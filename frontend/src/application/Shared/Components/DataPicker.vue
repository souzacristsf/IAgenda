<template>
    <v-layout fluid grid-list-lg>
      <v-flex>
        <!-- <div class="subheading">Defined by array</div> -->
        <v-date-picker
          v-model="date1"
          locale="pt-br"
          color="blue"
          :events="myEvents"
        ></v-date-picker>
      </v-flex>
    </v-layout>
</template>
<script>
  export default {
    name: 'my-data-picker',
    props: {
      myEvents: Array
    },
    data: () => ({
      arrayEvents: null,
      date1: null,
      date2: null
    }),
    // mounted () {
    //   this.arrayEvents = [...Array(6)].map(() => {
    //     const day = Math.floor(Math.random() * 30)
    //     const d = new Date()
    //     d.setDate(day)
    //     return d.toISOString().substr(0, 10)
    //   })
    //   // console.log('dias de eventos: ', this.arrayEvents)
    // },
    methods: {
      // functionEvents (date) {
      //   const [,, day] = date.split('-')
      //   return parseInt(day, 10) % 3 === 0
      // }
    }
  }
</script>
