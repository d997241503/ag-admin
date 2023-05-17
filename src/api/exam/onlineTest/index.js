import fetch from 'utils/fetch';
/**
 * 获取自测题目
 */
export function getSubject(query) {
	return fetch({
		url: '/api/examination/test/subjectinfo/listtensubzc',
		method: 'get',
		params: query
	});
}

/**
 * 交卷
 */
export function examSub(obj) {
	return fetch({
		url: '/api/examination/test/achievementinfo/save',
		method: 'post',
		data: obj
	});
}

/**
 * 记录错题
 */
export function history(obj) {
	return fetch({
		url: '/api/examination/test/historyInfo/save',
		method: 'post',
		data: obj
	});
}

/**
 * 获取错题
 */
export function getHistory(query) {
	return fetch({
		url: '/api/examination/test/historyInfo/list',
		method: 'get',
		params: query
	});
}

