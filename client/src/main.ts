import { createApp } from 'vue'
import App from './App.vue'
import router from '@/src/router'
import 'element-plus/dist/index.css'
import "@/src/assets/vers.scss";
import '@/src/assets/custom.scss'
import '@/src/assets/site.scss'
import "@mm/mtools/dist/date/date.extension";
import { title } from "@/src/models/config"

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title.toString() + "-" + title
    } else {
        document.title = title
    }

    if (to.meta.login) {
        if (localStorage.getItem("TOKEN")) {
            next()
        } else {
            next("/admin/account/login")
        }
    }else{
        next()
    }
});

createApp(App).use(router).mount('#app')
