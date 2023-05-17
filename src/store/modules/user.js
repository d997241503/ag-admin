import {
	loginByEmail,
	logout,
	getInfo,
	getMenus,
    loginfo
} from 'api/login';
import {
	page,
} from 'api/admin/quickEntry';
import {
	sortManagementPage
} from 'api/incorrupt/education/index';
import {
	getToken,
	setToken,
	removeToken
} from 'utils/auth';
import {getUrlKey} from 'utils'
import Vue from 'vue';
const user = {
	state: {
		user: '',
		status: '',
		code: '',
		token: getToken(),
		name: '',
		userId: '',
		updatepasswordflag: '',
		avatar: '',
		introduction: '',
		roles: [],
		quickEntryList: [],
		menus: undefined,
		eleemnts: undefined,
		eleemntObjs: undefined, // 按钮权限对象数组
		permissionMenus: undefined,
		navIndex: 0,
		documentClientHeight: '',
		reportState: '',
		setting: {
			articlePlatform: []
		},
		sortManagementList: undefined, // 分类列表
		category: undefined, //分类信息
		deptFields: 'departmentFullName', //部门展示字段
		isBackstage: false, // 是否进入管理后台
		sidebarFold: false, // 侧边栏，折叠状态
		isBack: false
	},

	mutations: {
		SET_CODE: (state, code) => {
			state.code = code;
		},
		SET_TOKEN: (state, token) => {
			state.token = token;
		},
		SET_INTRODUCTION: (state, introduction) => {
			state.introduction = introduction;
		},
		SET_SETTING: (state, setting) => {
			state.setting = setting;
		},
		SET_STATUS: (state, status) => {
			state.status = status;
		},
		SET_NAME: (state, name) => {
			state.name = name;
		},
		SET_USER_ID: (state, userId) => {
			state.userId = userId;
		},
		SET_UPDATE_PASSWORD_FLAG: (state, updatepasswordflag) => {
			state.updatepasswordflag = updatepasswordflag;
		},
		SET_AVATAR: (state, avatar) => {
			state.avatar = avatar;
		},
		SET_ROLES: (state, roles) => {
			state.roles = roles;
		},
		SET_MENUS: (state, menus) => {
			state.menus = menus;
		},
		SET_ELEMENTS: (state, elements) => {
			state.elements = elements;
		},
		SET_ELEMENTOBJS: (state, eleemntObjs) => {
			state.eleemntObjs = eleemntObjs;
		},
		LOGIN_SUCCESS: () => {
			console.log('login success')
		},
		LOGOUT_USER: state => {
			state.user = '';
		},
		SET_PERMISSION_MENUS: (state, permissionMenus) => {
			state.permissionMenus = permissionMenus;
		},
		SET_NAV_INDEX: (state, navIndex) => {
			state.navIndex = navIndex;
		},
		SET_QUICK_ENTRY_LIST: (state, quickEntryList) => {
			state.quickEntryList = quickEntryList;
		},
		SET_DOCUMENT_CLIENT_HEIGHT: (state, documentClientHeight) => {
			state.documentClientHeight = documentClientHeight;
		},
		SET_REPORT_STATE: (state, reportState) => {
			state.reportState = reportState;
		},
		SET_SORT_MANAGEMENT_LIST: (state, sortManagementList) => {
			state.sortManagementList = sortManagementList;
		},
		SET_CATEGORY: (state, category) => {
			state.category = category;
		},
		SET_DEPTFIELDS: (state, deptFields) => {
			state.deptFields = deptFields;
		}
	},

	actions: {
		// 邮箱登录
		LoginByEmail({
			commit
		}, userInfo) {
			const username = userInfo.username.trim();
			commit('SET_TOKEN', '');
			commit('SET_ROLES', []);
			commit('SET_MENUS', undefined);
			commit('SET_ELEMENTS', undefined);
			removeToken();
			return new Promise((resolve, reject) => {
				loginByEmail(username, userInfo.password).then(response => {
					setToken(response.data);
					commit('SET_TOKEN', response.data);
					resolve();
				}).catch(error => {
					reject(error);
				});
			});
		},

		// 设置路由下标
		ChangeNavIndex({
			commit
		}, val) {
			return new Promise(resolve => {
				commit('SET_NAV_INDEX', val);
				resolve();
			})
		},

		// 获取用户信息
		GetInfo({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				state.token = getToken();
				getInfo(state.token).then(response => {
					const data = response;
					commit('SET_ROLES', 'admin');
					commit('SET_NAME', data.name);
					commit('SET_USER_ID', data.id);
					commit('SET_AVATAR', 'http://git.oschina.net/uploads/42/547642_geek_qi.png?1499487420');
					commit('SET_INTRODUCTION', data.description);
					commit('SET_UPDATE_PASSWORD_FLAG', data.updatepasswordflag);
					const menus = {};
					for (let i = 0; i < data.menus.length; i++) {
						menus[data.menus[i].code] = true;
					}
					commit('SET_MENUS', menus);
					commit('SET_ELEMENTOBJS', data.elements);
					const elements = {};
					for (let i = 0; i < data.elements.length; i++) {
						elements[data.elements[i].code] = true;
					}
					commit('SET_ELEMENTS', elements);
					resolve(response);
				}).catch(error => {
					reject(error);
				});
				getMenus(state.token).then(response => {
					commit('SET_PERMISSION_MENUS', response);
				});
			});
		},

		// 第三方验证登录
		LoginByThirdparty({
			commit,
			state
		}, code) {
			return new Promise((resolve, reject) => {
				commit('SET_CODE', code);
				loginByThirdparty(state.status, state.email, state.code).then(response => {
					commit('SET_TOKEN', response.data.token);
					setToken(response.data.token);
					resolve();
				}).catch(error => {
					reject(error);
				});
			});
		},

        // 一体化登录
        SsoLogin({ commit, state }, to) {
            return new Promise((resolve, reject) => {
                const {path, query, fullPath} = to
                let account = getUrlKey('account', fullPath);
                let token = getUrlKey('token', fullPath);

                loginfo(account, token).then((res) => {
                    if (res.status == 200) {
                        setToken(res.data);
                        commit('SET_TOKEN', res.data)
                        commit('SET_USER_ID', '')
                        delete query.account
                        delete query.token
                        resolve({
                            routeOptions: {
                                path: path === '/ssologin' ? '/' : path,
                                query
                            }
                        })
                    } else {
                        return Promise.reject()
                    }
                })
                .catch((err) => {
                    Vue.prototype.$message.error('登录失败')
                    reject()
                })
            })
        },

		// 登出
		LogOut({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				state.token = getToken();
				logout(state.token).then(() => {
					commit('SET_TOKEN', '');
					commit('SET_ROLES', []);
					commit('SET_MENUS', undefined);
					commit('SET_ELEMENTS', undefined);
					commit('SET_ELEMENTOBJS', undefined);
					commit('SET_PERMISSION_MENUS', undefined);
					commit('SET_NAV_INDEX', 0);
                    commit('SET_USER_ID', '')
					removeToken();
					resolve();
				}).catch(error => {
					reject(error);
				});
			});
		},

		// 前端 登出
		FedLogOut({
			commit
		}) {
			return new Promise(resolve => {
				commit('SET_TOKEN', '');
				commit('SET_MENUS', undefined);
				commit('SET_ELEMENTS', undefined);
				commit('SET_ELEMENTOBJS', undefined);
				commit('SET_PERMISSION_MENUS', undefined);
				commit('SET_NAV_INDEX', 0);
                commit('SET_USER_ID', '')
				removeToken();
				resolve();
			}).then(() => {
				location.reload(); // 为了重新实例化vue-router对象 避免bug
				// window.location.href = 'https://yth2.nicity.cn/#/portal/index';
				// window.location.href = 'https://yth.csudgroup.com/#/portal/index';
			})
		},

		// 动态修改权限
		ChangeRole({
			commit
		}, role) {
			return new Promise(resolve => {
				commit('SET_ROLES', [role]);
				commit('SET_TOKEN', role);
				setToken(role);
				resolve();
			})
		},

		// 获取快捷入口数据
		GetQuickEntryList({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				page({
					'userId': state.userId
				}).then(response => {
					const data = response;
					commit('SET_QUICK_ENTRY_LIST', data.data);
				}).catch(error => {
					reject(error);
				});
			});
		},

		// 获取廉政教育用户端配置
		GetSortManagementList({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				sortManagementPage().then(response => {
					const data = response;
					commit('SET_SORT_MANAGEMENT_LIST', data.data);
				}).catch(error => {
					reject(error);
				});
			});
		},
	}
};

export default user;
