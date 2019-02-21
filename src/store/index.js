import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'
import createLogger from 'vuex/dist/logger'
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

const store = new Vuex.Store({
  plugins: [createLogger(),createPersistedState()],
  modules: {
    app,
    user
  },
  getters
})

export default store
