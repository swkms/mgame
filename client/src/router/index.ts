import { createRouter, createWebHistory, RouteRecordRaw, createWebHashHistory } from 'vue-router'

const routes: Array<RouteRecordRaw> = []

//登录
routes.push({
    path: '/account',
    name: 'ACCOUNT_MAIN',
    component: () =>
        import(/* webpackChunkName: "ACCOUNT_MAIN" */ '../views/login/Main.vue'),
    children: [
        //登录
        {
            path: '/account/login',
            name: 'LOGIN',
            component: () =>
                import(/* webpackChunkName: "LOGIN" */ '../views/login/Login.vue'),
            meta: {
                title: '登录'
            }
        },
        //注册
        {
            path: '/account/register',
            name: 'REGISTER',
            component: () =>
                import(/* webpackChunkName: "REGISTER" */ '../views/login/Register.vue'),
            meta: {
                title: '注册'
            }
        }
    ]
})

//管理员
routes.push({
    path: '/admin',
    name: 'ADMIN_MAIN',
    redirect: "/admin/home",
    component: () =>
        import(/* webpackChunkName: "ADMIN_MAIN" */ '../views/admin/Main.vue'),
    children: [
        //首页
        {
            path: '/admin/home',
            name: 'ADMIN_HOME',
            component: () =>
                import(/* webpackChunkName: "ADMIN_HOME" */ '../views/admin/game/GameManage.vue'),
            meta: {
                title: '管理员',
                login: true
            }
        },
        //用户管理
        {
            path: '/admin/users',
            name: 'ADMIN_USER',
            component: () =>
                import(/* webpackChunkName: "ADMIN_USER" */ '../views/admin/user/UserManage.vue'),
            meta: {
                title: '用户管理',
                login: true
            }
        },
    ]
})

//管理员
routes.push({
    path: '/admin/account',
    name: 'ADMIN_ACCOUNT_MAIN',
    redirect: "/admin/account/login",
    component: () =>
        import(/* webpackChunkName: "ADMIN_ACCOUNT_MAIN" */ '../views/admin/login/Main.vue'),
    children: [
        //登录
        {
            path: '/admin/account/login',
            name: 'ADMIN_ACCOUNT_LOGIN',
            component: () =>
                import(/* webpackChunkName: "ADMIN_ACCOUNT_LOGIN" */ '../views/admin/login/Login.vue'),
            meta: {
                title: '登录',
                login: false
            }
        },
    ]
})

//首页
routes.push({
    path: '/',
    name: 'HOME_MAIN',
    redirect: "/games",
    component: () =>
        import(/* webpackChunkName: "HOME_MAIN" */ '../views/home/Main.vue'),
    children: [
        //首页
        {
            path: '/games',
            name: 'GAMES',
            component: () =>
                import(/* webpackChunkName: "GAMES" */ '../views/home/Games.vue'),
            meta: {
                title: '游戏库'
            }
        },
        //我的游戏
        {
            path: '/mygame',
            name: 'MYGAME',
            component: () =>
                import(/* webpackChunkName: "MYGAME" */ '../views/home/MyGanme.vue'),
            meta: {
                title: '我的游戏'
            }
        },
    ]
})

routes.push({
    path: '/:pathMatch(.*)',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '../views/error/404.vue'),
})

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
