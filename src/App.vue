<template>
  <div id="app" class="light">
    <img src="./assets/logo.png" class="logo">
    <b-button class="mode" @click="zmode">
      <b-icon-moon />
    </b-button>
    <router-view/>
    <Fotter/>
  </div>
</template>

<script>
import Fotter from '@/components/Footer'
import jsonAudio from '@/assets/audio'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    Fotter
  },
  data() {
    return {
        settings: {
            mode   : 'light',
            reader : "ar.alafasy",
            readers: jsonAudio.data,
            language: 'ar',
            surah: [],
            nPage: ['1','2','50','77','106','128','151','177','187','208','221','235','249','255','262','267','282','293','305','312','322','332','342','350','359','367','377','385','396','404','411','415','418','428','434','440','446','453','458','467','477','483','489','496','499','502','507','511','515','518','520','523','526','528','531','534','537','542','545','549','551','553','554','556','558','560','562','564','566','568','570','572','574','575','577','578','580','582','583','585','586','587','587','589','590','591','591','592','593','594','595','595','596','596','597','597','598','598','599','599','600','600','601','601','601','602','602','602','603','603','603','604','604','604']
        
        }
    }
  },
  methods: {
    async run() {
        axios.get('http://api.alquran.cloud/v1/surah')
        .then(response => {
            this.surah = response.data.data;
        })
    },
    zmode () {
      this.mode = this.mode == 'light' ? 'dark' : 'light'
      var body = document.body
      body.setAttribute('class', this.mode == 'light' ? 'dark' : 'light')
     
    }
  },
  mounted() {
      this.run()
  }
}
</script>
