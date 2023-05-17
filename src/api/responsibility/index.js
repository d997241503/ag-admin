import fetch from 'utils/fetch';

/**
 * 责任类别管理 - 新增/修改记录
 */
export function addLiabilitycategory(obj,method) {
	return fetch({
		url: '/api/two-duty-implementation/liabilitycategory',
		method: method,
		data: obj
	});
}

/**
 * 责任类别管理 - 列表
 */
export function liabilitycategoryListPage(query) {
	return fetch({
		url: `/api/two-duty-implementation/liabilitycategory/list-info`,
		method: 'get',
		params: query
	});
}

/**
 * 责任类别详情
 */
export function getLiabilitycategoryObj(id) {
	return fetch({
		url: `/api/two-duty-implementation/liabilitycategory/${id}`,
		method: 'get'
	})
}

/**
 * 删除责任类别
 */
export function delLiabilitycategoryObj(id) {
	return fetch({
		url: `/api/two-duty-implementation/liabilitycategory/${id}`,
		method: 'delete'
	});
}

/**
 * 责任清单 - 下发/修改
 */
export function addIssueliability(obj,method) {
	return fetch({
		url: '/api/two-duty-implementation/issue-liability-list',
		method: method,
		data: obj
	});
}

/**
 * 责任清单 - 纪委列表
 */
export function inspectionListPage(query) {
	return fetch({
		url: `/api/two-duty-implementation/issue-liability-list/discipline-inspection-list`,
		method: 'get',
		params: query
	});
}

/**
 * 责任清单详情
 */
export function getIssueliabilityObj(id) {
	return fetch({
		url: `/api/two-duty-implementation/issue-liability-list/${id}`,
		method: 'get'
	})
}

/**
 * 删除责任清单
 */
export function delIssueliabilityObj(id) {
	return fetch({
		url: `/api/two-duty-implementation/issue-liability-list/${id}`,
		method: 'delete'
	});
}

/**
 * 责任清单 - 用户清单
 */
export function userListPage(query) {
	return fetch({
		url: `/api/two-duty-implementation/issue-liability-org/user-list`,
		method: 'get',
		params: query
	});
}

/**
 * 查询提报详情
 */
export function issueListPage(id) {
	return fetch({
		url: `/api/two-duty-implementation/issue-liability-org/${id}`,
		method: 'get'
	});
}

/**
 * 审批
 */
export function addIssueaudit(obj) {
	return fetch({
		url: '/api/two-duty-implementation/issue-liability-audit',
		method: 'put',
		data: obj
	});
}

/**
 * 提报数据
 */
export function addCommitlist(obj,issueLiabilityOrgId) {
	return fetch({
		url: `/api/two-duty-implementation/commit-liability-list/${issueLiabilityOrgId}`,
		method: 'post',
		data: obj
	});
}

/**
 * 申请节点(为空时默认展示原型内容)
 */
export function auditstep(issueLiabilityOrgId) {
	return fetch({
		url: `/api/two-duty-implementation/issue-liability-audit/audit-step/${issueLiabilityOrgId}`,
		method: 'get'
	});
}

/**
 * 新增节点
 */
export function addNode(obj,issueLiabilityOrgId) {
	return fetch({
		url: `/api/two-duty-implementation/issue-liability-audit/${issueLiabilityOrgId}`,
		method: 'post',
		data: obj
	});
}

/**
 * 下发清单提报组织详情
 */
export function issueListDelPage(query,issueLiabilityListId) {
	return fetch({
		url: `/api/two-duty-implementation/issue-liability-org/issue-list/${issueLiabilityListId}`,
		method: 'get',
		params: query
	});
}