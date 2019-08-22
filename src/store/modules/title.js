import {CHANGETITLE} from '../mutation_type';
const title = {
    state: {
        title: 'default'
    },
    actions: {
        changeTitle ({commit}, title) {
            commit('CHANGETITLE', title);
        }
    },
    mutations: {
        [CHANGETITLE] (state, title) {
            state.title = title;
        }
    }
};
export default title;
