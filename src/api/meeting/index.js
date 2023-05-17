import fetch from 'utils/fetch';

/**
 * 新增/修改联席会成员
 */
export function addMeetingmember(obj,method) {
	return fetch({
		url: '/api/superviseJointMeeting/meetingmember',
		method: method,
		data: obj
	});
}

/**
 * 查询联席会成员列表
 */
export function meetingmemberPage(query) {
	return fetch({
		url: `/api/superviseJointMeeting/meetingmember/list`,
		method: 'get',
		params: query
	});
}

/**
 * 查询联席会成员详情
 */
export function getMeetingmemberObj(id) {
	return fetch({
		url: `/api/superviseJointMeeting/meetingmember/${id}`,
		method: 'get'
	})
}

/**
 * 删除联席会成员
 */
export function delMeetingmemberObj(id) {
	return fetch({
		url: `/api/superviseJointMeeting/meetingmember/${id}`,
		method: 'delete'
	});
}

/**
 * 纪委-记录列表
 */
export function meetingdetailsInspectionList(query) {
	return fetch({
		url: `/api/superviseJointMeeting/meetingdetails/discipline-inspection-list`,
		method: 'get',
		params: query
	});
}

// /**
//  * 记录列表
//  */
// export function meetingdetailsList(query) {
// 	return fetch({
// 		url: `/api/superviseJointMeeting/meetingdetails/list`,
// 		method: 'get',
// 		params: query
// 	});
// }

/**
 * 新增/修改记录
 */
export function addMeetingdetails(obj,method) {
	return fetch({
		url: '/api/superviseJointMeeting/meetingdetails',
		method: method,
		data: obj
	});
}

/**
 * 记录详情
 */
export function getMeetingdetailsObj(id) {
	return fetch({
		url: `/api/superviseJointMeeting/meetingdetails/${id}`,
		method: 'get'
	})
}

/**
 * 删除记录
 */
export function delMeetingdetailsObj(id) {
	return fetch({
		url: `/api/superviseJointMeeting/meetingdetails/${id}`,
		method: 'delete'
	});
}

/**
 * 数量统计
 */
export function statistics() {
	return fetch({
		url: `/api/superviseJointMeeting/meetingdetails/statistics`,
		method: 'get'
	});
}

/**
 * 统计列表
 */
export function statisticsList(query) {
	return fetch({
		url: `/api/superviseJointMeeting/meetingdetails/statistics-list`,
		method: 'get',
		params: query
	});
}

/**
 * 联席会主题列表
 */
export function meetingThemeList(query) {
	return fetch({
		url: `/api/superviseJointMeeting/theme/list`,
		method: 'get',
		params: query
	});
}

/**
 * 选择联席会主题列表
 */
export function meetingThemeSelList(query) {
	return fetch({
		url: `/api/superviseJointMeeting/theme/simple-list`,
		method: 'get',
		params: query
	});
}

/**
 * 新增修改联席会会议主题
 */
export function addMeetingTheme(obj, method) {
	return fetch({
		url: `/api/superviseJointMeeting/theme`,
		method: method,
		data: obj
	});
}

/**
 * 删除联席会会议主题
 */
export function deleteMeetingTheme(id) {
	return fetch({
		url: `/api/superviseJointMeeting/theme/${id}`,
		method: 'delete'
	});
}


/**
 * 联席会议题列表
 */
export function meetingTopicList(query) {
	return fetch({
		url: `/api/superviseJointMeeting/supervisejoinmeetingtopic/page`,
		method: 'get',
		params: query
	});
}

/**
 * 联席会议题管理列表
 */
export function meetingTopicMngList(query) {
	return fetch({
		url: `/api/superviseJointMeeting/supervisejoinmeetingtopic/manage-page`,
		method: 'get',
		params: query
	});
}

/**
 * 新增修改联席会议题
 */
export function addMeetingTopic(obj, method) {
	return fetch({
		url: `/api/superviseJointMeeting/supervisejoinmeetingtopic`,
		method: method,
		data: obj
	});
}

/**
 * 删除联席会议题
 */
export function deleteMeetingTopic(id) {
	return fetch({
		url: `/api/superviseJointMeeting/supervisejoinmeetingtopic/${id}`,
		method: 'delete'
	});
}

/**
 * 标记联席会议题
 */
export function markMeetingTopic(id, data) {
	return fetch({
		url: `/api/superviseJointMeeting/supervisejoinmeetingtopic/mark/${id}`,
		method: 'put',
        data
	});
}

/**
 * 监督列表
 */
export function meetingSuperviseList(query) {
	return fetch({
		url: `/api/superviseJointMeeting/supervise/page`,
		method: 'get',
		params: query
	});
}

/**
 * 新增修改监督
 */
export function addMeetingSupervise(obj, method) {
	return fetch({
		url: `/api/superviseJointMeeting/supervise`,
		method: method,
		data: obj
	});
}

/**
 * 删除监督记录
 */
export function deleteMeetingSupervise(id) {
	return fetch({
		url: `/api/superviseJointMeeting/supervise/${id}`,
		method: 'delete'
	});
}

/**
 * 会议列表
 */
export function meetingRecordList(query) {
	return fetch({
		url: `/api/superviseJointMeeting/meeting-record/page`,
		method: 'get',
		params: query
	});
}

/**
 * 新增修改会议
 */
export function addMeetingRecord(obj, method) {
	return fetch({
		url: `/api/superviseJointMeeting/meeting-record`,
		method: method,
		data: obj
	});
}

/**
 * 删除会议
 */
export function deleteMeetingRecord(id) {
	return fetch({
		url: `/api/superviseJointMeeting/meeting-record/${id}`,
		method: 'delete'
	});
}

/**
 * 会议详情
 */
export function detailMeetingRecord(id) {
	return fetch({
		url: `/api/superviseJointMeeting/meeting-record/${id}`,
		method: 'get'
	});
}

/**
 * 修改议题整改情况
 */
export function updateTopicRec(id, data) {
	return fetch({
		url: `/api/superviseJointMeeting/meeting-record/rectification-situation/${id}`,
		method: 'post',
        data
	});
}
/**
 * 修改会议纪要
 */
export function updateThemeSum(id, data) {
	return fetch({
		url: `/api/superviseJointMeeting/meeting-record/meeting-summary/${id}`,
		method: 'post',
        data
	});
}