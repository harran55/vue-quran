// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import basmala from '@/assets/basmala.png'
import './assets/style.css'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.filter('basmala', function (value) {
  var Rval = ''
  Rval = value.replace(
    'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    '<span class="basmala"><img src="'+basmala+'"></span>');
  Rval = Rval.replace(
    'بِّسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    '<span class="basmala"><img src="'+basmala+'"></span>');
  Rval = Rval.replace(
    '۩',
    '<span ref="prostration">۩</span>'
  )
    return Rval
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
