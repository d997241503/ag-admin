import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/admin/user/page',
    method: 'get',
    params: query
  });
}

export function getPage(query) {
  return fetch({
    url: '/api/admin/user/getPage',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/admin/user/addUser',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/admin/user/getDetails/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/admin/user/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/admin/user/modify/' + id,
    method: 'put',
    data: obj
  })
}

export function changePassword(obj) {
  return fetch({
    url: '/api/admin/user/changePassword',
    method: 'put',
    data: obj
  })
}

// 登出
export function logout(query) {
  return fetch({
    url: '/api/auth/jwt/logout',
    method: 'get',
    params: query
  })
}

// 获取在职信息
export function userGetstate(query) {
  return fetch({
    url: '/api/admin/dataDictionary/getByType',
    method: 'get',
    params: query
  })
}

// 人员调动
export function transferSave(obj) {
  return fetch({
    url: '/api/admin/transfer/save',
    method: 'post',
    data: obj
  })
}

// 在职状态
export function stateMSave(obj) {
  return fetch({
    url: `/api/admin/stateMsg/save`,
    method: 'post',
	  data: obj
  })
}

/* 查询用户数据资源 */
export function getUserResource(id) {
	return fetch({
		url: '/api/admin/user/' + id + '/authority/dept-resource',
		method: 'get'
	})
}

/* 修改用户数据资源 */
export function editUserResource(id, obj) {
	return fetch({
		url: '/api/admin/user/' + id + '/authority/dept-resource',
		method: 'put',
		data: obj
	})
}

/* 查询用户菜单级资源 */
export function getUserMenu(id) {
	return fetch({
		url: '/api/admin/user/' + id + '/authority/menu',
		method: 'get'
	})
}

/* 修改用户菜单级资源 */
export function editUserMenu(id, obj) {
	return fetch({
		url: '/api/admin/user/' + id + '/authority/menu',
		method: 'put',
		data: obj
	})
}

/* 查询用户按钮级资源 */
export function getUserElement(id) {
	return fetch({
		url: '/api/admin/user/' + id + '/authority/element',
		method: 'get'
	})
}

/* 修改用户按钮级资源 */
export function editUserElement(id, obj) {
	return fetch({
		url: '/api/admin/user/' + id + '/authority/element',
		method: 'put',
		data: obj
	})
}

/* 修改用户按钮级资源 */
export function getUserDeptInfo() {
	return fetch({
		url: '/api/admin/user/user-dept-info',
		method: 'get'
	})
}

/* 根据部门查所有人员（含离职） */
export function getDeptUsers(deptId) {
	return fetch({
		url: `/api/admin/user/${deptId}/all-dept-tree-list`,
		method: 'get'
	})
}