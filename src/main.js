import Vue from 'vue';
import ElementUi from 'element-ui';
import tools from './tools';
import store from './store';
import App from './App';
import Viewer from 'v-viewer'
import router from './router';
import 'element-ui/lib/theme-chalk/index.css';
import 'viewerjs/dist/viewer.css'
Vue.use(ElementUi);
Vue.use(Viewer)
Vue.use(tools);
Vue.config.productionTip = false;
new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: { App }
});
