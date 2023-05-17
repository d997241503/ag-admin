import fetch from 'utils/fetch';
/**
 * 考试列表
 */
export function page(query) {
	return fetch({
		url: '/api/examination/test/dateinfo/getTestList',
		method: 'get',
		params: query
	});
}

/**
 * 当前考试信息
 */
export function examInfo(query) {
	return fetch({
		url: '/api/examination/test/achievementinfo/selectAchOne',
		method: 'get',
		params: query
	});
}

/**
 * 获取题目
 */
export function getSubject(query) {
	return fetch({
		url: '/api/examination/test/subjectinfo/listtensub',
		method: 'get',
		params: query
	});
}

/**
 * 保存成绩
 */
export function examSub(obj) {
	return fetch({
		url: '/api/examination/test/achievementinfo/save',
		method: 'post',
		data: obj
	});
}