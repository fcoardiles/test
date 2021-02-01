import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Main',
        component: Main
    },
    {
        path: '/logout',
        name: "Logout",
        component: () => import('../views/Logout.vue')
    },
    {
        path: '/about',
        name: "About",
        component: () => import('../views/About.vue')
    },
    {
        path: '/login',
        name: 'Login',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
    }
]

const router = new VueRouter({
    routes
})

export default router
