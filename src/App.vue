<template>
  <div id="app" class="light">
    <b-button class="mode" @click="zmode">
      <b-icon-moon />
    </b-button>
    <router-view />
  </div>
</template>

<script>
import axios from "axios";

import jsonAudio from "@/assets/audio.json";

import { settings } from "./settings";

export default {
  name: "App",
  data() {
    return {
      settings,
    };
  },
  methods: {
    async run() {
      axios.get("http://api.alquran.cloud/v1/surah").then((response) => {
        this.surah = response.data.data;
      });
    },
    zmode() {
      this.mode = this.mode == "light" ? "dark" : "light";
      var body = document.body;
      body.setAttribute("class", this.mode === "light" ? "dark" : "light");
    },
  },
  mounted() {
    this.run();
  },
};
</script>
