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
    component: CrearFamilia
  },
  {
    path: '/miembro', // ✅ Nueva ruta para registro
    name: 'Miembro',
    component: CrearMiembro
  },

  {
    path: '/transacciones',
    name: 'Transacciones',
    component:Transacciones
  },

  {
    path: '/categorias',
    name: 'Categorias',
    component:CrearCategoria
  },

  {
    path: '/dashboard',
    name: 'Dashboard',
    component:Dashboard
  },


  {
    path: '/reportes',
    name: 'Reportes',
    component: Reportes
  },

  {

    path: '/exportar',
    name: 'Exportar',
    component: ExportacionDatos
  }




]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
