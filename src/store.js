import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        servers: [],
    },
    mutations: {
        setServerList(state, servers) {
            state.servers = servers;
        }
    },
    actions: {}
})
