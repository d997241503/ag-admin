import fetch from 'utils/fetch';

/**
 * 查询列表
 */
export function page(query) {
	return fetch({
		url: `/api/incorruptTalk/incorrupttalk/jwPage`,
		method: 'get',
		params: query
	});
}

/**
 * 删除谈话记录
 */
export function delObj(id) {
	return fetch({
		url: `/api/incorruptTalk/incorrupttalk/${id}`,
		method: 'delete'
	});
}

/**
 * 查询子公司台账列表
 */
export function pageAccount(query) {
	return fetch({
		url: '/api/incorruptTalk/incorrupttalk/subsidiaryPage',
		method: 'get',
		params: query
	});
}

/**
 * 新增/修改谈话记录
 */
export function addObj(obj,method) {
	return fetch({
		url: '/api/incorruptTalk/incorrupttalk',
		method: method,
		data: obj
	});
}

// /**
//  * 新增/修改谈话记录
//  */
// export function updateObj(obj) {
// 	return fetch({
// 		url: '/api/incorruptTalk/incorrupttalk',
// 		method: 'put',
// 		data: obj
// 	});
// }