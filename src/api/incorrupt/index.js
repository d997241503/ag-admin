import fetch from 'utils/fetch';

/**
 * 查询列表
 */
export function page(query) {
	return fetch({
		url: '/api/inform/reportInfo/infoList',
		method: 'get',
		params: query
	});
}

/**
 * 新增举报信息
 */
export function addObj(obj) {
	return fetch({
		url: '/api/inform/reportInfo/savaInfo',
		method: 'post',
		data: obj
	});
}

/**
 * 查询详情
 */
export function getObj(id) {
	return fetch({
		url: '/api/inform/reportInfo/details/' + id,
		method: 'get'
	})
}

/**
 * 获取部门树
 */
export function getTree() {
	// return fetch({
	// 	url: '/api/admin/baseDepartment/deptList',
	// 	method: 'get'
	// })
	return fetch({
		url: '/api/admin/baseDepartment/getTree',
		method: 'get'
	})
}

/**
 * 获取用户列表
 */
export function getUser(query) {
	return fetch({
		url: '/api/admin/user/userList',
		method: 'get',
		params: query
	})
}

/**
 * 删除
 */
export function delObj(query) {
	return fetch({
		url: '/api/inform/reportInfo/del',
		method: 'delete',
		params: query
	})
}

/**
 * 修改举报
 */
export function putObj(obj) {
	return fetch({
		url: '/api/inform/reportInfo/updateInfo',
		method: 'put',
		data: obj
	})
}

/**
 * 添加调查结果
 */
export function saveFindings(obj) {
	return fetch({
		url: '/api/inform/reportInfo/saveFindings',
		method: 'post',
		data: obj
	})
}

/**
 * 添加处分结果
 */
export function saveHandling(obj) {
	return fetch({
		url: '/api/inform/reportInfo/saveHandling',
		method: 'post',
		data: obj
	})
}

/**
 * 上传文件
 */
export function uploadFile(file) {
	return fetch({
		url: '/api/upload/uploads/uploadInformFile',
		method: 'get',
		data: file
	})
}
