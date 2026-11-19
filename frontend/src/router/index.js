import { createRouter, createWebHistory } from 'vue-router'
import LoginApp from '../views/LoginApp.vue'
import Registro from '../views/Registro.vue'
import Dashboard from '../views/Dashboard.vue'
import Layout from '../Layouts/Layout.vue'
import Inventario from '../views/Inventario.vue'
import InventarioActivos from '../components/InventarioActivos.vue'
import EmpresaComponent from '../components/EmpresaComponent.vue'

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
  {
    path: '/empresa',
    name: 'Empresa',
    component: EmpresaComponent
  },

  // RF20: política de datos (pública) y aceptación de la autorización
  {
    path: '/politica-datos',
    name: 'PoliticaDatos',
    component: () => import('../views/PoliticaDatos.vue')
  },
  {
    path: '/consentimiento',
    name: 'Consentimiento',
    component: () => import('../views/Consentimiento.vue')
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
        path: 'inventario',
        name: 'Inventario',
        component: InventarioActivos
      },
      {
        path: '/activos',
        name: 'Activos',
        component: () => import('../views/ActivosView.vue')
      },
      {
        // RF06: ficha de conocimiento del activo
        path: '/activos/:id/ficha',
        name: 'FichaActivo',
        component: () => import('../views/FichaActivo.vue')
      },
      {
        // RF20: mis datos y privacidad
        path: '/mis-datos',
        name: 'MisDatos',
        component: () => import('../views/MisDatos.vue')
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