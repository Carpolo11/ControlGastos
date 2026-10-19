import { createRouter, createWebHistory } from 'vue-router'
import LoginApp from '../views/LoginApp.vue'
import Registro from '../views/Registro.vue'
import CrearFamilia from '../views/CrearFamilia.vue'
import CrearMiembro from '../views/CrearMiembro.vue'
import RegistroTransacciones from '../views/RegistroTransacciones.vue'
import CrearCategoria from '../views/CrearCategoria.vue'
import Dashboard from '../views/Dashboard.vue'
import Reportes from '../views/Reportes.vue'
import ExportacionDatos from '../views/ExportacionDatos.vue'
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