import { createWebHistory, createRouter } from "vue-router";

import Index from "../pages/Index.vue";

const routes = [
  { path: "/", name: "home", component: Index },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../pages/Register.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
