import fetch from 'utils/fetch';

/**
 * 查询列表
 */
export function page(query) {
	return fetch({
		url: '/api/examination/test/dateinfo/listInfo',
		// url: window.origin + "/static/json/exam/manageList.json",
		method: 'get',
		params: query
	});
}

/**
 * 查询考试详情
 */
export function getObj(query) {
	return fetch({
		url: '/api/examination/test/dateinfo/getTestInfo',
		method: 'get',
		params: query
	})
}

/**
 * 删除考试
 */
export function delObj(data) {
	return fetch({
		url: '/api/examination/test/dateinfo/delete',
		method: 'post',
		data: data
	});
}

/**
 * 新增考试信息
 */
export function addObj(obj) {
	return fetch({
		url: '/api/examination/test/dateinfo/savaTest',
		method: 'post',
		data: obj
	});
}

/**
 * 修改考试信息
 */
export function updateObj(obj) {
	return fetch({
		url: '/api/examination/test/dateinfo/updateTestInfo',
		method: 'post',
		data: obj
	});
}

/**
 * 获取设置考题详情
 */
export function subjectInfo(query) {
	return fetch({
		url: '/api/examination/test/subjectinfo/getSubject',
		method: 'get',
		params: query
	});
}

/**
 * 获取考题
 */
export function subjectList(query) {
	return fetch({
		url: '/api/examination/test/subjectinfo/getList',
		method: 'get',
		params: query
	});
}

/**
 * 提交自定义考题
 */
export function saveTestInfo(obj) {
	return fetch({
		url: '/api/examination/test/dateSubRelation/saveHistory',
		method: 'post',
		data: obj
	});
}

/**
 * 提交随机考题
 */
export function saveRandom(obj) {
	return fetch({
		url: '/api/examination/test/subjectinfo/randomQuestions',
		method: 'post',
		data: obj
	});
}

/**
 * 移除考题
 */
export function delSubject(obj) {
	return fetch({
		url: '/api/examination/test/dateSubRelation/deleteQuestions',
		method: 'post',
		params: obj
	});
}

/**
 * 查看参考人员
 */
export function userList(query) {
	return fetch({
		url: '/api/examination/test/dateinfo/getUserList',
		method: 'get',
		params: query
	});
}

/**
 * 查看考试成绩列表
 */
export function resultList(query) {
	return fetch({
		url: '/api/examination/test/achievementinfo/list',
		method: 'get',
		params: query
	});
}

/**
 * 获取统计数据
 */
export function statistics(query) {
	return fetch({
		url: '/api/examination/test/achievementinfo/statistics',
		method: 'get',
		params: query
	});
}

/**
 * 获取题目列表（题库）
 */
export function getSubjects(query) {
	return fetch({
		url: '/api/examination/test/subjectinfo/list',
		method: 'get',
		params: query
	});
}

/**
 * 获取题目详情（题库）
 */
export function subjectDetail(id) {
	return fetch({
		url: '/api/examination/test/subjectinfo/info/' + id,
		method: 'get'
	})
}

/**
 * 修改题目（题库）
 */
export function subjectUpdate(obj) {
	return fetch({
		url: '/api/examination/test/subjectinfo/update',
		method: 'post',
		data: obj
	});
}

/**
 * 删除题目（题库）
 */
export function subjectDelete(ids) {
	return fetch({
		url: '/api/examination/test/subjectinfo/delete',
		method: 'post',
		data: ids
	});
}

