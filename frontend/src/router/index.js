import { createRouter, createWebHistory } from 'vue-router'
import LoginApp from '../views/LoginApp.vue'
import Registro from '../views/Registro.vue' // ✅ Importamos la vista de registro
import CrearFamilia from '../views/CrearFamilia.vue'
import CrearMiembro from '../views/CrearMiembro.vue'
import Transacciones from '../views/Transacciones.vue'
import CrearCategoria from '../views/CrearCategoria.vue'
import Dashboard from '../views/Dashboard.vue'
import Reportes from '../views/Reportes.vue'
import ExportacionDatos from '../views/ExportacionDatos.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginApp
  },
  {
    path: '/register', // ✅ Nueva ruta para registro
    name: 'Registro',
    component: Registro
  },
  {
    path: '/',
    redirect: '/login' // Redirige a login por defecto
  },
    {
    path: '/familia', // ✅ Nueva ruta para registro
    name: 'Familia',
    component: CrearFamilia,
    meta: { requiereAuth: true }
  },
  {
    path: '/miembro', // ✅ Nueva ruta para registro
    name: 'Miembro',
    component: CrearMiembro,
    meta: { requiereAuth: true }
  },

  {
    path: '/transacciones',
    name: 'Transacciones',
    component:Transacciones,
    meta: { requiereAuth: true }
  },

  {
    path: '/categorias',
    name: 'Categorias',
    component:CrearCategoria,
    meta: { requiereAuth: true }
  },

  {
    path: '/dashboard',
    name: 'Dashboard',
    component:Dashboard,
    meta: { requiereAuth: true }
  },


  {
    path: '/reportes',
    name: 'Reportes',
    component: Reportes,
    meta: { requiereAuth: true }
  },

  {

    path: '/exportar',
    name: 'Exportar',
    component: ExportacionDatos,
    meta: { requiereAuth: true }
  }




]

const router = createRouter({
  history: createWebHistory(),
  routes
})


// 🚨 Este código protege las rutas del frontend
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiereAuth && !token) {
    next("/login");
  } else {
    next();
  }
});

export default router
