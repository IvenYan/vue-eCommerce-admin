import Vue from 'vue'
import Router from 'vue-router'
const login = (resolve) => require(['@/views/login/login'], resolve);
const system = (resolve) => require(['@/views/system/system'], resolve);
const product = (resolve) => require(['@/views/product/product'], resolve);
const upload = (resolve) => require(['@/views/upload/upload'], resolve);
const upload_result = (resolve) => require(['@/views/upload/upload_result'], resolve);

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: 'login'
    },
    {
      path: '/login',
      name: 'login',
      component: login,
    },
    {
      path: 'system/product',
      name: 'system',
      component: system,
      meta: {
          title: '首页'
      },
        children: [
            {
                path: '/system/product',
                name: 'product',
                component: product,
                meta: {
                    title: '产品管理'
                }
            },
              {
                path: '/system/upload',
                name: 'upload',
                component: upload,
                meta: {
                    title: '亚马逊上传'
                }
            },
            {
              path: '/system/upload_result',
              name: 'upload_result',
              component: upload_result,
              meta: {
                title: '上传结果'
              }
            }
        ]
    }
  ]
})
router.beforeEach((to, from, next) => {
    const title = to.meta.title;
    // this.a.app.$options.store.dispatch('changeTitle', title);
    // this.$store.dispatch('changeTitle', title);
    next();
});

export default router;
