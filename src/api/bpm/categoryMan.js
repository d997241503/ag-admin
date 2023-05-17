import fetch from 'utils/fetch';

/**
 * 保存
 */
export function addFormtype(obj) {
	return fetch({
		url: '/api/bpm/form-type',
		method: 'post',
		data: obj
	});
}

/**
 * 修改
 */
export function updataFormtype(obj) {
	return fetch({
		url: '/api/bpm/form-type',
		method: 'put',
		data: obj
	});
}

/**
 * 树结构
 */
export function formtypeTree(query) {
	return fetch({
		url: `/api/bpm/form-type/tree`,
		method: 'get',
		params: query
	});
}

/**
 * 删除
 */
export function delFormtype(id) {
	return fetch({
		url: `/api/bpm/form-type/${id}`,
		method: 'delete'
	});
}