import fetch from 'utils/fetch';


/**
 * 专项监督事项 - 新增/修改
 */
export function addSupervision(data,method) {
	return fetch({
		url: '/api/pecial-supervision/supervision-record',
		method: method,
		data
	});
}

/**
 * 专项监督事项 - 列表
 */
export function supervisionList(query) {
	return fetch({
		url: '/api/pecial-supervision/supervision-record/page',
		method: 'get',
		params: query
	});
}

/**
 * 专项监督事项 - 详情
 */
export function supervisionDetail(id) {
	return fetch({
		url: `/api/pecial-supervision/supervision-record/${id}`,
		method: 'get'
	});
}

/**
 * 下发组织 - 列表
 */
export function supervisionOrgList(id, query) {
	return fetch({
		url: `/api/pecial-supervision/org-supervision-record/${id}/issue-org-page`,
		method: 'get',
		params: query
	});
}

/**
 * 下发组织 - 详情
 */
export function supervisionOrgDetail(id) {
	return fetch({
		url: `/api/pecial-supervision/org-supervision-record/${id}`,
		method: 'get'
	});
}

/**
 * 添加自查报告
 */
export function selefCheckReport(id, data) {
	return fetch({
		url: `/api/pecial-supervision/org-supervision-record/${id}/self-check-report`,
		method: 'put',
		data
	});
}

/**
 * 编辑整改情况
 */
export function rectificationSituation(id, data) {
	return fetch({
		url: `/api/pecial-supervision/org-supervision-record/${id}/rectification-situation`,
		method: 'put',
		data
	});
}

/**
 * 编辑监督情况
 */
export function supervisionReport(id, data) {
	return fetch({
		url: `/api/pecial-supervision/org-supervision-record/${id}/supervision-reportt`,
		method: 'put',
		data
	});
}

/**
 * 进入整改阶段
 */
export function toRectification(id) {
	return fetch({
		url: `/api/pecial-supervision/org-supervision-record/${id}/to-rectification`,
		method: 'put'
	});
}

/**
 * 问题清单校验
 */
export function problemListValidate(id, data) {
	return fetch({
		url: `/api/pecial-supervision/problem-list/validator/${id}`,
		method: 'post',
        data
	});
}
