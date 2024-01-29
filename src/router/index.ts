import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

export const RouteNames = {
  HOME: 'home',
  USERS: 'users',
  USER_DETAILS: 'user',
  CREATE_NEW_USER: 'create user'
}

export const routes = [
  {
    path: '/',
    name: RouteNames.HOME,
    component: HomeView
  },
  {
    path: '/users',
    name: RouteNames.USERS,
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/UsersView.vue')
  },
  {
    path: '/users/:userId',
    name: RouteNames.USER_DETAILS,
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/UserView.vue')
  },
  {
    path: '/users/new',
    name: RouteNames.CREATE_NEW_USER,
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/CreateUserView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
