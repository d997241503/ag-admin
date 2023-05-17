import fetch from 'utils/fetch';

/**
 * 查询列表
 */
export function page(query,list) {
	return fetch({
		url: `/api/internalInspection/inspection-record/${list}`,
		method: 'get',
		params: query
	});
}

/**
 * 删除巡查记录
 */
export function delObj(id) {
	return fetch({
		url: `/api/internalInspection/inspection-record/${id}`,
		method: 'delete'
	});
}

/**
 * 查询巡查小组列表
 */
export function pageTeam(query) {
	return fetch({
		url: '/api/internalInspection/inspection-team/list',
		method: 'get',
		params: query
	});
}

/**
 * 删除巡查组
 */
export function delTeamObj(id) {
	return fetch({
		url: `/api/internalInspection/inspection-team/${id}`,
		method: 'delete'
	});
}

/**
 * 新增/修改巡查组
 */
export function addTeamObj(obj,method) {
	return fetch({
		url: '/api/internalInspection/inspection-team',
		method: method,
		data: obj
	});
}

// /**
//  * 修改巡查组
//  */
// export function updateTeamObj(obj) {
// 	return fetch({
// 		url: '/api/internalInspection/inspection-team',
// 		method: 'put',
// 		data: obj
// 	});
// }

/**
 * 查询巡查计划详情
 */
export function getPlanObj(recordId) {
	return fetch({
		url: `/api/internalInspection/inspection-plan/${recordId}`,
		method: 'get'
	})
}

/**
 * 新增巡查计划
 */
export function addPlanObj(obj) {
	return fetch({
		url: '/api/internalInspection/inspection-plan',
		method: 'post',
		data: obj
	});
}

/**
 * 修改巡查计划
 */
export function updatePlanObj(obj) {
	return fetch({
		url: '/api/internalInspection/inspection-plan',
		method: 'put',
		data: obj
	});
}

/**
 * 整改报告详情
 */
export function getReportObj(recordId) {
	return fetch({
		url: `/api/internalInspection/inspection-rectification-report/${recordId}`,
		method: 'get'
	})
}

/**
 * 新增整改报告
 */
export function addReportObj(obj) {
	return fetch({
		url: '/api/internalInspection/inspection-rectification-report',
		method: 'post',
		data: obj
	});
}

/**
 * 修改整改报告
 */
export function updateReportObj(obj) {
	return fetch({
		url: '/api/internalInspection/inspection-rectification-report',
		method: 'put',
		data: obj
	});
}

/**
 * 巡查反馈详情
 */
export function getFeedbackObj(recordId) {
	return fetch({
		url: `/api/internalInspection/inspection-feedback/${recordId}`,
		method: 'get'
	})
}

/**
 * 新增巡查反馈
 */
export function addFeedbackObj(obj) {
	return fetch({
		url: '/api/internalInspection/inspection-feedback',
		method: 'post',
		data: obj
	});
}

/**
 * 修改巡查反馈
 */
export function updateFeedbackObj(obj) {
	return fetch({
		url: '/api/internalInspection/inspection-feedback',
		method: 'put',
		data: obj
	});
}

/**
 * 查询巡查整改情况列表
 */
export function getSituationObj(recordId) {
	return fetch({
		url: `/api/internalInspection/inspectionrectificationcondition/${recordId}/list`,
		method: 'get'
	})
}

/**
 * 新增巡查整改情况
 */
export function addSituationObj(obj) {
	return fetch({
		url: '/api/internalInspection/inspectionrectificationcondition',
		method: 'post',
		data: obj
	});
}

/**
 * 修改巡查整改情况
 */
export function updateSituationObj(obj) {
	return fetch({
		url: '/api/internalInspection/inspectionrectificationcondition',
		method: 'put',
		data: obj
	});
}

/**
 * 删除巡查整改情况
 */
export function delSituationObj(id) {
	return fetch({
		url: `/api/internalInspection/inspectionrectificationcondition/${id}`,
		method: 'delete'
	});
}

/**
 * 整改报告-巡查反馈文书详情
 */
export function getDocumentObj(recordId) {
	return fetch({
		url: `/api/internalInspection/inspection-rectification-writ/${recordId}`,
		method: 'get'
	})
}

/**
 * 新增巡查反馈文书
 */
export function addDocumentObj(obj) {
	return fetch({
		url: '/api/internalInspection/inspection-rectification-writ',
		method: 'post',
		data: obj
	});
}

/**
 * 修改巡查反馈文书
 */
export function updateDocumentObj(obj) {
	return fetch({
		url: '/api/internalInspection/inspection-rectification-writ',
		method: 'put',
		data: obj
	});
}


/**
 * 考核评价详情
 */
export function getAssessmentObj(recordId) {
	return fetch({
		url: `/api/internalInspection/inspectionassess/${recordId}`,
		method: 'get'
	})
}

/**
 * 新增考核评价
 */
export function addAssessmentObj(obj) {
	return fetch({
		url: '/api/internalInspection/inspectionassess',
		method: 'post',
		data: obj
	});
}

/**
 * 修改考核评价
 */
export function updateAssessmentObj(obj) {
	return fetch({
		url: '/api/internalInspection/inspectionassess',
		method: 'put',
		data: obj
	});
}

/**
 * 实施过程详情
 */
export function getProcessObj(recordId) {
	return fetch({
		url: `/api/internalInspection/inspection-process/${recordId}`,
		method: 'get'
	})
}

/**
 * 新增实施过程
 */
export function addProcessObj(obj) {
	return fetch({
		url: '/api/internalInspection/inspection-process',
		method: 'post',
		data: obj
	});
}

/**
 * 修改实施过程
 */
export function updateProcessObj(obj) {
	return fetch({
		url: '/api/internalInspection/inspection-process',
		method: 'put',
		data: obj
	});
}

/**
 * 查询周会列表
 */
export function getMeetingObj(recordId) {
	return fetch({
		url: `/api/internalInspection/inspection-process-weekly-meeting/${recordId}/list`,
		method: 'get'
	})
}

/**
 * 新增周例会记录
 */
export function addMeetingObj(obj) {
	return fetch({
		url: '/api/internalInspection/inspection-process-weekly-meeting',
		method: 'post',
		data: obj
	});
}

/**
 * 修改周例会记录
 */
export function updateMeetingObj(obj) {
	return fetch({
		url: '/api/internalInspection/inspection-process-weekly-meeting',
		method: 'put',
		data: obj
	});
}

/**
 * 删除周例会记录
 */
export function delMeetingObj(id) {
	return fetch({
		url: `/api/internalInspection/inspection-process-weekly-meeting/${id}`,
		method: 'delete'
	});
}