// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import ElementUI from './plugins/element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import '@/element-ui/theme/index.css'
import 'assets/custom-theme/index.css'; // 换肤版本element-ui css
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css'; // Progress 进度条 样式
import 'normalize.css/normalize.css'; // normalize.css 样式格式化
import 'assets/iconfont/iconfont'; // iconfont 具体图标见https://github.com/PanJiaChen/vue-element-admin/wiki
import * as filters from './filters'; // 全局vue filter
import Multiselect from 'vue-multiselect'; // 使用的一个多选框组件，element-ui的select不能满足所有需求
import 'vue-multiselect/dist/vue-multiselect.min.css'; // 多选框组件css
import Sticky from 'components/Sticky'; // 粘性header组件
import IconSvg from 'components/Icon-svg'; // svg 组件
import vueWaves from './directive/waves'; // 水波纹指令
import errLog from 'store/errLog'; // error log组件
// import './mock/index.js'; // 该项目所有请求使用mockjs模拟
import VueCoreVideoPlayer from 'vue-video-player';


import 'k-form-design/packages/core/useComponents'
// import 'k-form-design/packages/core/preUseComponents'
import KFormDesign from 'k-form-design/packages/use.js'
import 'k-form-design/lib/k-form-design.css'
Vue.use(KFormDesign)

import htmlToPdf from '@/utils/htmlToPdf'
Vue.use(htmlToPdf)

import print from 'vue-print-nb'
import {
	getToken,
	setToken,
	setAuthKey
} from 'utils/auth';
window.SITE_CONFIG = {}

require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
const Base64 = require('js-base64').Base64
// register globally
Vue.component('multiselect', Multiselect);
Vue.component('Sticky', Sticky);
Vue.component('icon-svg', IconSvg)
Vue.use(ElementUI);
Vue.use(vueWaves);
Vue.prototype.vm=Vue.prototype;
Vue.prototype.$baseURL={
	
	LoutURL:'http://authserver.csmzxy.edu.cn/authserver/logout'
}
//打印
Vue.use(print)
// Install vue-core-video-player
Vue.use(VueCoreVideoPlayer);

// Form Generator 组件需要使用到 tinymce
import Tinymce from '@/components/Tinymce/index.vue'
Vue.component('tinymce', Tinymce)

import { parseTime, resetForm, handleTree} from "@/utils/ruoyi";
import {DICT_TYPE, getDictDataLabel, getDictDatas, getDictDatas2} from "@/utils/dict";
import {optionalChaining} from '@/utils'

// 全局方法挂载
// Vue.prototype.getDicts = getDicts
// Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.getDictDatas = getDictDatas
Vue.prototype.getDictDatas2 = getDictDatas2
Vue.prototype.getDictDataLabel = getDictDataLabel
Vue.prototype.DICT_TYPE = DICT_TYPE
Vue.prototype.handleTree = handleTree
Vue.prototype.$chaining = optionalChaining

import './assets/icons' // icon
import '@/icons'

import fetch from "@/utils/fetch" // 实现 form generator 使用自己定义的 axios fetch 对象
Vue.prototype.$axios = fetch

// bpmnProcessDesigner 需要引入
import MyPD from "@/components/bpmnProcessDesigner/package/index.js";
Vue.use(MyPD);
import "@/components/bpmnProcessDesigner/package/theme/index.scss";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

import './styles/index.scss'

// register global utility filters.
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
});

// register global progress.
const whiteList = [ '/login','/authredirect', '/401', '/404']; // 不重定向白名单


// router.beforeEach((to, from, next) => {
// 	store.state.user.isBack = false;
// 	NProgress.start(); // 开启Progress
// 	if(to.path==='/singleLogin'){
// 		setToken(to.query.token)
// 		setAuthKey(to.query.AuthKey)
// 		store.commit('SET_TOKEN',to.query.token);
// 	}
// 	if (getToken()) { // 判断是否有token
// 		if (to.path === '/login'||to.path==='/singleLogin') {
// 			next({
// 				path: '/'
// 			});
// 		} else {
// 			if (store.getters.menus === undefined) { // 判断当前用户是否已拉取完user_info信息

// 				// 获取廉政教育配置
// 				store.dispatch('GetSortManagementList');
// 				store.dispatch('GetInfo').then(info => { // 拉取user_info
// 					const menus = {};
// 					for (let i = 0; i < info.menus.length; i++) {
// 						menus[info.menus[i].code] = true;
// 					}
// 					store.dispatch('GenerateRoutes', menus).then(() => { // 生成可访问的路由表
// 						router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
// 						next({ ...to
// 						}); // hack方法 确保addRoutes已完成
// 					})
// 				}).catch(() => {
// 					store.dispatch('FedLogOut').then(() => {
// 						// 跳转
// 						// window.location.href='http://authserver.csmzxy.edu.cn/authserver/login'
						
// 						// NProgress.done();
// 						next({
// 							path: '/login'
// 						});
// 					})
// 				})
// 			} else {
// 				//  else {
// 				//   // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
// 				//   if (hasPermission(store.getters.roles, to.meta.role)) {
// 				//     next();//
// 				//   } else {
// 				next();
// 				//   }
// 				//   // 可删 ↑
// 			}
// 		}
// 	} else {
// 		if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
		
// 			next()
// 		} else {
// 			// window.location.href='http://authserver.csmzxy.edu.cn/authserver/login'
// 			next('/login'); // 否则全部重定向到登录页
// 			NProgress.done(); // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
// 		}
// 	}
// });


// router.afterEach(() => {
// 	NProgress.done(); // 结束Progress
// });

/**
 * 单点登录
 */
let isNeedSso = true // 防止addRoutes后重复进入sso登录
router.beforeEach((to, from, next) => {
	store.state.user.isBack = false;
	NProgress.start(); // 开启Progress
    // 单点登录
    if (to.query.token && to.query.account && isNeedSso) {
        store.dispatch('SsoLogin', to).then(res => {
            next(res.routeOptions)
        }).catch(() => {
            store.dispatch('FedLogOut')
        })
    } else if (getToken()) { // 判断是否有token
			if (store.getters.userId === '') { // 判断当前用户是否已拉取完user_info信息
				// 获取廉政教育配置
				store.dispatch('GetSortManagementList');
				store.dispatch('GetInfo').then(info => { // 拉取user_info
					const menus = {};
					for (let i = 0; i < info.menus.length; i++) {
						menus[info.menus[i].code] = true;
					}
					store.dispatch('GenerateRoutes', menus).then(() => { // 生成可访问的路由表
                        isNeedSso = false
						router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                        isNeedSso = true
						next({ ...to
						}); // hack方法 确保addRoutes已完成
					})
				}).catch(() => {
					store.dispatch('FedLogOut')
				})
			} else {
				next();
			}
	} else {
        if (whiteList.includes(to.path)) {
            next()
        } else {
            next('/401')
        }
        NProgress.done(); // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
	}
});

router.afterEach(() => {
	NProgress.done(); // 结束Progress
});

// router.beforeEach((to, from, next) => {
// 	NProgress.start(); // 开启Progress
// 	if (getToken()) { // 判断是否有token
// 			if (store.getters.menus === undefined) { // 判断当前用户是否已拉取完user_info信息

// 				// 获取廉政教育配置
// 				store.dispatch('GetSortManagementList');
// 				store.dispatch('GetInfo').then(info => { // 拉取user_info
// 					const menus = {};
// 					for (let i = 0; i < info.menus.length; i++) {
// 						menus[info.menus[i].code] = true;
// 					}
// 					store.dispatch('GenerateRoutes', menus).then(() => { // 生成可访问的路由表
// 						router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
// 						next({ ...to
// 						}); // hack方法 确保addRoutes已完成
// 					})
// 				}).catch(() => {
// 					store.dispatch('FedLogOut').then(() => {
// 						// 跳转
						// window.location.href = 'https://yth2.nicity.cn/#/portal/index';
						
// 						// NProgress.done();

// 						// 单点登录
						// next({
						// 	path: 'ssologin'
						// });
// 					})
// 				})
// 			} else {
// 				//  else {
// 				//   // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
// 				//   if (hasPermission(store.getters.roles, to.meta.role)) {
// 				//     next();//
// 				//   } else {
// 				next();
// 				//   }
// 				//   // 可删 ↑
// 			}
// 		// }
// 	} else {
// 		// 单点登录
// 		if (to.path === '/ssologin') { // 直接进入
// 			next()
// 		} else {
// 			next('ssologin'); // 否则全部重定向到首页
// 			NProgress.done(); // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
// 		}
// 	}
// });

Vue.config.productionTip = false;

// 生产环境错误日志
if (process.env.NODE_ENV === 'production') {
	Vue.config.errorHandler = function(err, vm) {
		console.log(err, window.location.href);
		errLog.pushLog({
			err,
			url: window.location.href,
			vm
		})
	};
}

new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: {
		App
	}
})
