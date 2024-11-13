import { createWebHistory, createRouter } from "vue-router";

import Index from "../pages/Index.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../pages/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../pages/Register.vue"),
  },
  { path: "/", name: "Home", component: Index, meta: { requiresAuth: true } },
  {
    path: "/logoff",
    name: "Logoff",
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      localStorage.removeItem("user");
      next({ name: "Login" });
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("user");

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redireciona para login se a rota requer autenticação e o usuário não está autenticado
    next({ name: "Login" });
  } else if (
    (to.name === "Login" || to.name === "Register") &&
    isAuthenticated
  ) {
    // Redireciona para home se o usuário tentar acessar login enquanto autenticado
    next({ name: "Home" });
  } else {
    // Permite o acesso às outras rotas
    next();
  }
});

export default router;
