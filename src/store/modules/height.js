import {CHANGEHEIGHT} from '../mutation_type';
const height = {
    state: {
        height: null
    },
    actions: {
        changeHeight ({commit}, height) {
            commit('CHANGEHEIGHT', height);
        }
    },
    mutations: {
        [CHANGEHEIGHT] (state, height) {
            state.height = height.height;
        }
    }
};
export default height;
