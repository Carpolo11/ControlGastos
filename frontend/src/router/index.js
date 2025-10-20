import { createRouter, createWebHistory } from 'vue-router'
import LoginApp from '../views/LoginApp.vue'
import Registro from '../views/Registro.vue' // ✅ Importamos la vista de registro
import CrearFamilia from '../views/CrearFamilia.vue'
import CrearMiembro from '../views/CrearMiembro.vue'
import Transacciones from '../views/Transacciones.vue'

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
    redirect: '/miembro' // Redirige a login por defecto
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
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
