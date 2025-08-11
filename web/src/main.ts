import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router.ts";
import App from "./App.vue";
import Notifications from "@kyvg/vue3-notification";
import "./pico-custom.scss";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia).use(router).use(Notifications).mount("#app");
