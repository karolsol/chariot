import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      alias: "/",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
    },
    // {
    //     path: '/vehicles',
    //     name: 'vehicles',
    //     // Lazy loading - komponent ładuje się tylko gdy użytkownik wejdzie na tę stronę
    //     component: () => import('../views/VehiclesView.vue')
    // }
  ],
});

export default router;
