import fetch from 'utils/fetch';

/**
 * 查询列表
 */
export function page(query) {
	return fetch({
		url: `/api/choose-employ-member/record/page`,
		method: 'get',
		params: query
	});
}

/**
 * 廉审发起
 */
export function addObj(obj) {
	return fetch({
		url: '/api/choose-employ-member/record',
		method: 'post',
		data: obj
	});
}

/**
 * 详情
 */
export function getObj(id) {
	return fetch({
		url: `/api/choose-employ-member/record/${id}`,
		method: 'get'
	});
}

/**
 * 指派审核人员
 */
export function recordChecker(obj,id) {
	return fetch({
		url: `/api/choose-employ-member/record/${id}/checker`,
		method: 'put',
		data: obj
	});
}

/**
 * 文件校验
 */
export function validator(obj) {
	return fetch({
		url: '/api/choose-employ-member/object/validator',
		method: 'post',
		data: obj
	});
}

/**
 * 详情询列表
 */
export function objectPage(query,recordId) {
	return fetch({
		url: `/api/choose-employ-member/object/${recordId}/page`,
		method: 'get',
		params: query
	});
}

/**
 * 新增核对人员审核意见
 */
export function opinionChecker(obj,recordId) {
	return fetch({
		url: `/api/choose-employ-member/opinion/checker/${recordId}`,
		method: 'post',
		data: obj
	});
}

/**
 * 新增纪检意见
 */
export function opinionDisciplineInspection(obj,recordId) {
	return fetch({
		url: `/api/choose-employ-member/opinion/disciplineInspection/${recordId}`,
		method: 'post',
		data: obj
	});
}

/**
 * 新增纪委意见
 */
export function opinionDisciplineInspectionCommission(obj,recordId) {
	return fetch({
		url: `/api/choose-employ-member/opinion/disciplineInspectionCommission/${recordId}`,
		method: 'post',
		data: obj
	});
}