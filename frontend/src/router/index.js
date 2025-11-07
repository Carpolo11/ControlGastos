import { createRouter, createWebHistory } from 'vue-router'
import LoginApp from '../views/LoginApp.vue'
import Registro from '../views/Registro.vue'
import CrearFamilia from '../views/CrearFamilia.vue'
import CrearMiembro from '../views/CrearMiembro.vue'
import Transacciones from '../views/Transacciones.vue'
import CrearCategoria from '../views/CrearCategoria.vue'
import Dashboard from '../views/Dashboard.vue'
import Reportes from '../views/Reportes.vue'
import ExportacionDatos from '../views/ExportacionDatos.vue'
import Layout from '../Layouts/Layout.vue'

const routes = [
  // Rutas públicas (sin layout)
  {
    path: '/login',
    name: 'Login',
    component: LoginApp
  },
  {
    path: '/register',
    name: 'Registro',
    component: Registro
  },
  {
    path: '/',
    redirect: '/login'
  },

  
  
  // Rutas protegidas (con layout)
  {
    path: '/',
    component: Layout,
    meta: { requiereAuth: false },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'familia',
        name: 'Familia',
        component: CrearFamilia
      },
      {
        path: 'miembro',
        name: 'Miembro',
        component: CrearMiembro
      },
      {
        path: 'categorias',
        name: 'Categorias',
        component: CrearCategoria
      },
      {
        path: 'transacciones',
        name: 'Transacciones',
        component: Transacciones
      },
      {
        path: 'reportes',
        name: 'Reportes',
        component: Reportes
      },
      {
        path: 'exportar',
        name: 'Exportar',
        component: ExportacionDatos
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Protección de rutas
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiereAuth && !token) {
    next("/login");
  } else {
    next();
  }
});

export default router