import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import HomeView from '@Views/HomeView.vue'
import AboutView from '@Views/AboutView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
