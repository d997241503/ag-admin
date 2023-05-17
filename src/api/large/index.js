import fetch from 'utils/fetch';

/**
 * 会议类型管理 - 新增/修改记录
 */
export function addConferencetype(obj,method) {
	return fetch({
		url: '/api/threeImportancesOneGreatness/conferencetype',
		method: method,
		data: obj
	});
}

/**
 * 会议类型管理 - 列表
 */
export function conferencetypePage(query) {
	return fetch({
		url: `/api/threeImportancesOneGreatness/conferencetype/list`,
		method: 'get',
		params: query
	});
}

/**
 * 会议类型管理 - 精简列表
 */
export function simpleList() {
	return fetch({
		url: `/api/threeImportancesOneGreatness/conferencetype/simple-list`,
		method: 'get'
	});
}

/**
 * 根据会议类型查会议题
 */
export function typeList(query) {
	return fetch({
		url: `/api/threeImportancesOneGreatness/conference-type-event/type-list`,
		method: 'get',
		params: query
	})
}

/**
 * 会议类型管理 - 删除
 */
export function delConferencetypeObj(id) {
	return fetch({
		url: `/api/threeImportancesOneGreatness/conferencetype/${id}`,
		method: 'delete'
	});
}

/**
 * 规则设置 - 新增/修改记录
 */
export function addRuleset(obj) {
	return fetch({
		url: '/api/threeImportancesOneGreatness/ruleset',
		method: 'put',
		data: obj
	});
}

/**
 * 规则设置 - 列表
 */
export function rulesetPage(query) {
	return fetch({
		url: `/api/threeImportancesOneGreatness/ruleset/list`,
		method: 'get',
		params: query
	});
}

/**
 * 规则设置 - 删除
 */
export function delRulesetObj(id) {
	return fetch({
		url: `/api/threeImportancesOneGreatness/ruleset/${id}`,
		method: 'delete'
	});
}

/**
 * 新增记录/编辑记录
 */
export function addConferenceRecord(obj,method) {
	return fetch({
		url: '/api/threeImportancesOneGreatness/conference-record',
		method: method,
		data: obj
	});
}

/**
 * 纪委统计统计列表
 */
export function statisticList(query) {
	return fetch({
		url: `/api/threeImportancesOneGreatness/conference-record/discipline-inspection-statistic-list`,
		method: 'get',
		params: query
	});
}

/**
 * 列表
 */
export function conferenceRecordList(query) {
	return fetch({
		url: `/api/threeImportancesOneGreatness/conference-record/list`,
		method: 'get',
		params: query
	});
}

/**
 * 数量统计
 */
export function conferenceStatistic(query) {
	return fetch({
		url: `/api/threeImportancesOneGreatness/conference-record/statistic`,
		method: 'get',
		params: query
	});
}

/**
 * 子公司统计列表
 */
export function subsidiaryStatisticList(query) {
	return fetch({
		url: `/api/threeImportancesOneGreatness/conference-record/subsidiary-statistic-list`,
		method: 'get',
		params: query
	});
}

/**
 * 记录详情
 */
export function getConferenceRecordObj(id) {
	return fetch({
		url: `/api/threeImportancesOneGreatness/conference-record/${id}`,
		method: 'get'
	})
}

/**
 * 删除记录
 */
export function delConferenceRecordObj(id,isInspection) {
	return fetch({
		url: `/api/threeImportancesOneGreatness/conference-record/${id}?isInspection=${isInspection}`,
		method: 'delete'
	});
}

/**
 * 新增临时议题
 */
export function addTemporary(obj,id) {
	return fetch({
		url: `/api/threeImportancesOneGreatness/conference-event-record/temporary/${id}`,
		method: 'post',
		data: obj
	});
}

/**
 * 添加/编辑意见
 */
export function audit(obj,id) {
	return fetch({
		url: `/api/threeImportancesOneGreatness/conference-record/audit/${id}`,
		method: 'put',
		data: obj
	});
}

/**
 * 添加会议纪要文件
 */
export function summary(obj,id) {
	return fetch({
		url: `/api/threeImportancesOneGreatness/conference-record/summary/${id}`,
		method: 'put',
		data: obj
	});
}