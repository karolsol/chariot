import { type Component, createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { setupGuards } from "./router/guards";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { vAutofocus } from "./directives/vAutofocus";

const app = createApp(App as Component);
const pinia = createPinia();
app.use(router);
app.use(pinia);
app.use(VueQueryPlugin);
app.directive("autofocus", vAutofocus);
setupGuards(router, pinia);
app.mount("#app");
