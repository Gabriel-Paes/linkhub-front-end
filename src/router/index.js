import { createWebHistory, createRouter } from "vue-router";

import Index from "../pages/Index.vue";

const routes = [
  { path: "/", name: "home", component: Index },
  {
    path: "/about",
    name: "about",
    component: () => import("../pages/About.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
