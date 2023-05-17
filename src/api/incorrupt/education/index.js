import fetch from 'utils/fetch';

/**
 * 查询教育文章列表
 */
export function page(query) {
	return fetch({
		url: '/api/education/educationinfo/list',
		method: 'get',
		params: query
	});
}

/**
 * 首页列表
 */
export function indexList() {
	return fetch({
		url: '/api/education/category/indexList',
		method: 'get'
	});
}

/**
 * 用户端查询教育文章列表
 */
export function clientPage(query) {
	return fetch({
		url: '/api/education/educationinfo/clientList',
		method: 'get',
		params: query
	});
}

/**
 * 查询侧边类别列表
 */
export function leftList() {
	return fetch({
		url: '/api/education/category/leftList',
		method: 'get'
	});
}

/**
 * 查询编辑类类别列表
 */
export function editCategoryList() {
	return fetch({
		url: '/api/education/category/tList',
		method: 'get'
	});
}

/**
 * 查询分类管理列表
 */
export function sortManagementPage(query) {
	return fetch({
		url: '/api/education/category/list',
		// url: window.origin + "/static/json/education/sortManagementList.json",
		method: 'get',
		params: query
	});
}

/**
 * 查询统计列表
 */
export function statisticsList(query) {
	return fetch({
		url: '/api/education/educationinfo/statisticsList',
		method: 'get',
		params: query
	});
}

/**
 * 查询统计数据
 */
export function statisticsData(query) {
	return fetch({
		url: '/api/education/educationinfo/statistics',
		method: 'get',
		params: query
	});
}

/**
 * 新增类别
 */
export function saveCategory(obj) {
	return fetch({
		url: '/api/education/category/save',
		method: 'post',
		data: obj
	});
}

/**
 * 修改类别
 */
export function updateCategory(obj) {
	return fetch({
		url: '/api/education/category/update',
		method: 'put',
		data: obj
	});
}

/**
 * 删除类别
 */
export function deleteCategory(query) {
	return fetch({
		url: '/api/education/category/delete',
		method: 'delete',
		params: query
	});
}

/**
 * 新增文章信息
 */
export function addObj(obj) {
	return fetch({
		url: '/api/education/educationinfo/save',
		method: 'post',
		data: obj
	});
}

/**
 * 查询学院信息
 */
export function getDepts() {
	return fetch({
		// url: '/api/admin/baseDepartment/getDepts',
		url: '/api/admin/baseDepartment/authority/tree',
		method: 'get'
	})
}

/**
 * 查询详情
 */
export function getObj(id) {
	return fetch({
		url: '/api/inform/reportInfo/details/' + id,
		method: 'get'
	})
}

/**
 * 查询文章详情
 */
export function getArticleObj(id) {
	return fetch({
		url: '/api/education/educationinfo/info/' + id,
		method: 'get'
	})
}

/**
 * 查询链接类文章详情
 */
export function getLinkArticleObj(query) {
	return fetch({
		url: '/api/education/educationinfo/incorruptEducation',
		method: 'get',
		params: query
	});
}


/**
 * 删除
 */
export function delObj(query) {
	return fetch({
		url: '/api/education/educationinfo/delete',
		method: 'delete',
		params: query
	})
}

/**
 * 上传文件
 */
export function uploadFile(file) {
	return fetch({
		url: '/api/upload/uploads/uploadEducationFile',
		method: 'get',
		data: file
	})
}
