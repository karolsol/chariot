import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
      meta: {
        hideNavbar: true,
        public: true,
      },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
      meta: {
        hideNavbar: true,
        public: true,
      },
    },
    {
      path: "/dashboard",
      alias: "/",
      name: "dashboard",
      component: () => import("../views/DashboardView.vue"),
    },
    {
      path: "/vehicles",
      name: "vehicles",
      component: () => import("../views/VehiclesView.vue"),
    },
    {
      path: "/refuels",
      name: "refuels",
      component: () => import("../views/RefuelsView.vue"),
    },
    {
      path: "/maintenance",
      name: "maintenance",
      component: () => import("../views/MaintenancesView.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
});

export default router;
