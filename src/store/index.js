import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';
import permission from './modules/permission';
import getters from './getters';
import mutations from './mutations'

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		app,
		user,
		permission
	},
	getters,
	mutations
});

export default store
