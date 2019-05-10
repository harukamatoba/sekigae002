import Vue from 'vue';
import Router from 'vue-router';
import Finish from '@/components/Finish.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import('@/views/Home.vue'),
        },
        {
            path: '/finish',
            name: 'Finish',
            component: Finish,
        },
    ],
});
