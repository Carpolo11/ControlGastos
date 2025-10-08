import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FutbolView from '../views/FutbolView.vue'
import PerfilView from '../views/PerfilView.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { 
    path: '/home', 
    name: 'Home', 
    component: HomeView, 
    meta: { title: 'Rick & Morty Universe' } 
  },
  { 
    path: '/futbol', 
    name: 'Futbol', 
    component: FutbolView, 
    meta: { title: '⚽ Mundo del Fútbol' } 
  },
  { 
    path: '/perfil', 
    name: 'Perfil', 
    component: PerfilView, 
    meta: { title: '👤 Mi Perfil Profesional' } 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router