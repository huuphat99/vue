// Imports
import { layout, route } from '@/util/routes'
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

function requireAuth (to, from, next) {
  const accountInfo = localStorage.getItem('account_info')
  // ログイン済であれば
  if (accountInfo) {
    return next()
  }
  // 未ログインであれば
  return next({
    path: '/login',
  })
}
const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) return { selector: to.hash }
    if (savedPosition) return savedPosition

    return { x: 0, y: 0 }
  },
  routes: [
    layout('Default', [
      route('会員管理', 'UserManagement/UserList', 'user', {
        beforeEnter: requireAuth,
      }),
      route('販売チケット一覧', 'TicketManagement/TicketList', 'ticket', {
        beforeEnter: requireAuth,
      }),
    ]),
    layout('Simple', [
      route('アカウント登録', 'SignUp', 'signup'),
      route('ログイン', 'Login', 'login'),
      route('パスワード再設定', 'PasswordReset', 'pw-reset'),
      route('ログアウト', 'Logout', 'logout'),
    ]),
  ],
})

function hasQueryParams (route) {
  return !!Object.keys(route.query).length
}

router.beforeEach((to, from, next) => {
  if (!hasQueryParams(to) && hasQueryParams(from)) {
    next({ name: to.name, query: from.query })
  } else {
    next()
  }
})
export default router
