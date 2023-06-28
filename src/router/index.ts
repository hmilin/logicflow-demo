import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import Modeler from '~/views/Modeler.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/modeler' },
  { path: '/modeler', component: Modeler },
]

export const routerHistory = createWebHistory(import.meta.env.BASE_URL)

const router = createRouter({
  history: routerHistory,
  routes,
})

export default router
