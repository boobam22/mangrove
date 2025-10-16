import { type RouteRecordRaw } from 'vue-router'

import ScreenView from '@/components/layout/ScreenView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/2048',
    component: ScreenView,
    children: [
      {
        path: '',
        component: () => import('./PHome.vue'),
      },
      {
        path: 'classic',
        component: () => import('./PClassic.vue'),
      },
      {
        path: 'tutorial',
        component: () => import('./PTutorial.vue'),
        meta: { noKeepAlive: false },
      },
      {
        path: 'plus',
        component: () => import('./PHome.vue'),
      },
    ],
  },
]

export default routes
