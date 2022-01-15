import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedHeroes: {},
  },

  getters: {
    selectedHeroes: state => state.selectedHeroes,
  },

  mutations: {
    addSelectedHero(state, hero) {
      state.selectedHeroes[hero.id] = hero;
    },

    removeSelectedHero(state, hero) {
      delete state.selectedHeroes[hero.id];
    }
  },

  actions: {
    addSelectedHero: ({ commit }, hero) => {
      commit('addSelectedHero', hero)
    },

    removeSelectedHero: ({ commit }, hero) => {
      commit('removeSelectedHero', hero)
    }
  },
})
