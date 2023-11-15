import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
// import { useUserStore } from '@/stores'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue')
    },
    {
      path: '/community',
      component: () => import('@/views/community/CommunityPage.vue')
    },
    {
      path: '/reserve',
      component: () => import('@/views/reserve/ReservePage.vue')
    },
    {
      path: '/userInfoDetail',
      component: () => import('@/views/user/UserInfoDetail.vue')
    }
  ]
})

router.beforeEach((to) => {
  // 如果没有token, 且访问的是非登录页，拦截到登录，其他情况正常放行
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login') return '/login'
})

export default router
