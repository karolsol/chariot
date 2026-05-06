import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      alias: "/",
      name: "login",
      component: () => import("../views/LoginView.vue"),
      meta: {
        hideNavbar: true,
      },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
      meta: {
        hideNavbar: true,
      },
    },
    {
      path: "/vehicles",
      name: "vehicles",
      component: () => import("../views/VehiclesView.vue"),
      meta: {
        hideNavbar: false,
      },
    },
  ],
});

export default router;
