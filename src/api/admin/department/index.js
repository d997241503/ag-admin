import fetch from 'utils/fetch';

export function page(query) {
	return fetch({
		url: '/api/admin/baseDepartment/getList',
		method: 'get',
		params: query
	});
}

export function addObj(obj) {
	return fetch({
		url: '/api/admin/baseDepartment',
		method: 'post',
		data: obj
	});
}

export function getObj(id) {
	return fetch({
		url: '/api/admin/baseDepartment/getDetails/' + id,
		method: 'get'
	})
}

export function getTree(query) {
	return fetch({
		// url: '/api/admin/baseDepartment/getTree',
		url: '/api/admin/baseDepartment/getTree',
		method: 'get',
		params: query
	})
}

export function getUser(deptId,query) {
	return fetch({
		url: `/api/admin//user/${deptId}/dept-tree-list`,
		method: 'get',
		params: query
	})
}

export function delObj(id) {
	return fetch({
		url: '/api/admin/baseDepartment/deleteDep/' + id,
		method: 'delete'
	})
}

export function putObj(obj) {
	return fetch({
		url: '/api/admin/baseDepartment/updateBase',
		method: 'put',
		data: obj
	})
}

export function exportPage(query) {
	return fetch({
		url: '/api/admin/baseDepartment/export',
		method: 'get',
		params: query
	})
}

/* 根据权限获取部门树 */
export function listSimpleDepts(query) {
	return fetch({
		url: '/api/admin/baseDepartment/authority/tree',
		method: 'get',
		params: query
	})
}

/* 查询部门数据资源 */
export function getDeptResource(id) {
	return fetch({
		url: '/api/admin/baseDepartment/' + id + '/authority/dept-resource',
		method: 'get'
	})
}

/* 修改部门数据资源 */
export function editDeptResource(id, obj) {
	return fetch({
		url: '/api/admin/baseDepartment/' + id + '/authority/dept-resource',
		method: 'put',
		data: obj
	})
}

/* 查询部门菜单级资源 */
export function getDeptMenu(id) {
	return fetch({
		url: '/api/admin/baseDepartment/' + id + '/authority/menu',
		method: 'get'
	})
}

/* 修改部门菜单级资源 */
export function editDeptMenu(id, obj) {
	return fetch({
		url: '/api/admin/baseDepartment/' + id + '/authority/menu',
		method: 'put',
		data: obj
	})
}

/* 查询部门按钮级资源 */
export function getDeptElement(id) {
	return fetch({
		url: '/api/admin/baseDepartment/' + id + '/authority/element',
		method: 'get'
	})
}

/* 修改部门按钮级资源 */
export function editDeptElement(id, obj) {
	return fetch({
		url: '/api/admin/baseDepartment/' + id + '/authority/element',
		method: 'put',
		data: obj
	})
}

// 新增人员
export function addDepartmentleaderObj(obj,deptId) {
	return fetch({
		url: `/api/admin/base-department-leader/${deptId}`,
		method: 'post',
		data: obj
	});
}

// 人员详情
export function getDepartmentleaderObj(query,deptId,leaderType) {
	return fetch({
		url: `/api/admin/base-department-leader/list/${deptId}/${leaderType}`,
		method: 'get',
		params: query
	})
}

// 删除人员记录
export function delDepartmentleaderObj(id) {
	return fetch({
		url: `/api/admin/base-department-leader/del/${id}`,
		method: 'delete'
	})
}
