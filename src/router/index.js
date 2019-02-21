import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
/*
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [

  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  // { path: '/api/feed/', component: () => import('@/utlis/feeddata.json'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    meta: { title: 'Dashboard', icon: 'tachometer-alt' },
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'tachometer-alt' }
    }]
  },
  {
    path: '/dashboard',
    component: Layout,
    meta: { title: 'Dashboard', icon: 'tachometer-alt' },
    children: [
      {
        path: 'index',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: 'Dashboard', icon: 'tachometer-alt' }
      }
    ]
  },
  
  {
    path: '/feed',
    component: Layout,
    redirect: '/feed/trending',
    name: 'Feed',
    meta: { title: 'Feed', icon: 'example' },
    children: [
      {
        path: 'trending',
        name: 'Market Place',
        component: () => import('@/views/feed/index'),
        meta: { title: 'Market Place', icon: 'cart-plus' }
      },
      // {
      //   path: 'bhojpuri',
      //   name: 'Bhojpuri',
      //   component: () => import('@/views/feed/index'),
      //   meta: { title: 'Bhojpuri', icon: 'headphones' }
      // },
      // {
      //   path: 'bhangra',
      //   name: 'Bhangra',
      //   component: () => import('@/views/feed/index'),
      //   meta: { title: 'Bhangra', icon: 'headphones' }
      // },
      // {
      //   path: 'bluesjazz',
      //   name: 'Blues/Jazz',
      //   component: () => import('@/views/feed/index'),
      //   meta: { title: 'Blues/Jazz', icon: 'headphones' }
      // }
    ]
  },
  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Upload Content',
        component: () => import('@/views/form/index'),
        meta: { title: 'Upload Content', icon: 'form' }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    children: [
      {
        path: '/index',
        name: 'User Profile',
        component: () => import('@/views/profile/index'),
        meta: { title: 'User Profile', icon: 'user' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  mode: 'history',
  routes: constantRouterMap
})

