import Vue from "vue";
import Router from "vue-router";

import Surah from "@/components/Surah.vue";
import SurahAyah from "@/components/SurahAyah.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Surah",
      component: Surah,
    },
    {
      path: "/:id",
      name: "Surah",
      component: SurahAyah,
    },
  ],
});
