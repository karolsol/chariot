import "reflect-metadata";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { setupGuards } from "./router/guards";
import { VueQueryPlugin } from "@tanstack/vue-query";

const app = createApp(App);
const pinia = createPinia();
app.use(router);
app.use(pinia);
app.use(VueQueryPlugin);
setupGuards(router, pinia);
app.mount("#app");
