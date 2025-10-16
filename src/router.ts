import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [{ path: '/', redirect: '/home' }]

const routeModules = import.meta.glob<{ default: RouteRecordRaw[] }>('@/pages/**/routes.ts', {
  eager: true,
})
Object.values(routeModules).forEach((mod) => {
  if (mod.default) {
    routes.push(...mod.default)
  }
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
