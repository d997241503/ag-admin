import fetch from 'utils/fetch';

/**
 * 新增案件处置类型、措施
 */
export function addClueType(caseType, data) {
	return fetch({
		url: `/api/case-manage/type/${caseType}`,
		method: 'post',
        data
	})
}

/**
 * 修改案件处置类型、措施
 */
export function updateClueType(caseType, data) {
	return fetch({
		url: `/api/case-manage/type/${caseType}`,
		method: 'put',
        data
	})
}

/**
 * 删除案件处置类型、措施
 */
export function deleteClueType(id) {
	return fetch({
		url: `/api/case-manage/type/${id}`,
		method: 'delete'
	})
}

/**
 * 案件处置类型、措施列表
 */
export function clueTypeList(caseType) {
	return fetch({
		url: `/api/case-manage/type/${caseType}/tree`,
		method: 'get'
	})
}

/**
 * 线索录入新增
 */
export function clueInput(data) {
	return fetch({
		url: `/api/case-manage/clue-input`,
		method: 'post',
        data
	})
}

/**
 * 线索录入修改
 */
export function clueUpdate(data) {
	return fetch({
		url: `/api/case-manage/clue-input`,
		method: 'put',
        data
	})
}

/**
 * 线索录入详情
 */
export function clueDetail(id) {
	return fetch({
		url: `/api/case-manage/clue-input/${id}`,
		method: 'get'
	})
}

/**
 * 信访线索新增
 */
export function letterClueAdd(id, data) {
	return fetch({
		url: `/api/case-manage/petition-clue/${id}`,
		method: 'post',
        data
	})
}

/**
 * 信访线索修改
 */
export function letterClueUpdate(data) {
	return fetch({
		url: `/api/case-manage/petition-clue`,
		method: 'put',
        data
	})
}

/**
 * 信访线索详情
 */
export function letterClueDetail(id) {
	return fetch({
		url: `/api/case-manage/petition-clue/${id}`,
		method: 'get'
	})
}

/**
 * 问题线索新增
 */
export function problemClueAdd(id, data) {
	return fetch({
		url: `/api/case-manage/problem-clue/${id}`,
		method: 'post',
        data
	})
}

/**
 * 问题线索修改
 */
export function problemClueUpdate(data) {
	return fetch({
		url: `/api/case-manage/problem-clue`,
		method: 'put',
        data
	})
}

/**
 * 问题线索详情
 */
export function problemClueDetail(id) {
	return fetch({
		url: `/api/case-manage/problem-clue/${id}`,
		method: 'get'
	})
}

/**
 * 信访线索列表
 */
export function clueList(params) {
	return fetch({
		url: `/api/case-manage/casemanagerecord/page`,
		method: 'get',
        params
	})
}

/**
 * 信访线索涉及领域详情
 */
export function involvedFieldDetail(id) {
	return fetch({
		url: `/api/case-manage/casemanagerecord/${id}/involved-field`,
		method: 'get'
	})
}

/**
 * 信访线索涉及领域编辑
 */
export function involvedFieldEdit(id, data) {
	return fetch({
		url: `/api/case-manage/casemanagerecord/${id}/involved-field`,
		method: 'put',
        data
	})
}

/**
 * 立案新增
 */
export function registerAdd(id, data) {
	return fetch({
		url: `/api/case-manage/register/${id}`,
		method: 'post',
        data
	})
}

/**
 * 立案修改
 */
export function registerUpdate(data) {
	return fetch({
		url: `/api/case-manage/register`,
		method: 'put',
        data
	})
}

/**
 * 立案详情
 */
export function registerDetail(id) {
	return fetch({
		url: `/api/case-manage/register/${id}`,
		method: 'get'
	})
}