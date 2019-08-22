
import fetcher from './fetcher';
export default {
    install (Vue) {
        // Vue.prototype.fetcher = fetcher;
        Object.defineProperty(Vue.prototype, '$http', {
            value: fetcher
        });
    }
};
