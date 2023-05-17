import fetch from 'utils/fetch';

/**
 * 获得首页数据统计
 */
export function indexStatistic(query) {
	return fetch({
		url: '/api/incorruptibleArchives/statistic/index-statistic',
		method: 'get',
		params: query
	});
}

/**
 * 获得首页列表统计
 */
export function indexPage(query) {
	return fetch({
		url: '/api/incorruptibleArchives/statistic/index-page',
		method: 'get',
		params: query
	});
}

/**
 * 人员库信息详情
 */
export function personnelpool(query) {
	return fetch({
		url: `/api/incorruptibleArchives/personnelpool`,
		method: 'get',
		params: query
	});
}

/**
 * 编辑人员库信息
 */
export function updatePersonnelpool(obj) {
	return fetch({
		url: '/api/incorruptibleArchives/personnelpool',
		method: 'put',
		data: obj
	});
}

/**
 * 新增/修改单位档案
 */
export function addUnitarchivesObj(obj,method,isInspect) {
	return fetch({
		url: `/api/incorruptibleArchives/unitarchives?isInspect=${isInspect}`,
		method: method,
		data: obj
	});
}

/**
 * 修改单位档案
 */
export function updateUnitarchivesObj(obj) {
	return fetch({
		url: '/api/incorruptibleArchives/unitarchives',
		method: 'put',
		data: obj
	});
}

/**
 * 单位档案树结构
 */
export function getUnitarchivesTree(query) {
	return fetch({
		url: `/api/incorruptibleArchives/unitarchives/tree`,
		method: 'get',
		params: query
	});
}

/**
 * 删除单位档案
 */
export function delUnitarchivesObj(id) {
	return fetch({
		url: `/api/incorruptibleArchives/unitarchives/${id}`,
		method: 'delete'
	});
}

/**
 * 编辑单位档案文件
 */
export function updateArchivesfileObj(obj) {
	return fetch({
		url: '/api/incorruptibleArchives/archivesfile/unitarchives',
		method: 'put',
		data: obj
	});
}

/**
 * 查询单位档案文件列表
 */
export function archivesfileInfo(recordId,type) {
	return fetch({
		url: `/api/incorruptibleArchives/archivesfile/unitarchives/${recordId}/${type}/list`,
		method: 'get'
	});
}

/**
 * 新增单位风险点排查
 */
export function addUnitriskpointsObj(obj) {
	return fetch({
		url: '/api/incorruptibleArchives/unitriskpoints',
		method: 'post',
		data: obj
	});
}

/**
 * 修改单位风险点排查
 */
export function updateUnitriskpointsObj(obj) {
	return fetch({
		url: '/api/incorruptibleArchives/unitriskpoints',
		method: 'put',
		data: obj
	});
}

/**
 * 单位风险点排查树结构
 */
export function getUnitriskpointsTree(query) {
	return fetch({
		url: `/api/incorruptibleArchives/unitriskpoints/tree`,
		method: 'get',
		params: query
	});
}

/**
 * 删除单位风险点排查
 */
export function delUnitriskpointsObj(id) {
	return fetch({
		url: `/api/incorruptibleArchives/unitriskpoints/${id}`,
		method: 'delete'
	});
}

/**
 * 编辑单位风险点排查文件
 */
export function updateUnitriskpointsfileObj(obj) {
	return fetch({
		url: '/api/incorruptibleArchives/archivesfile/unitRiskPoints',
		method: 'put',
		data: obj
	});
}

/**
 * 单位单位风险点排查文件详情
 */
export function unitRiskPointsfileInfo(recordId) {
	return fetch({
		url: `/api/incorruptibleArchives/archivesfile/unitRiskPoints/${recordId}`,
		method: 'get'
	});
}

/**
 * 配置详情
 */
export function fixtaskconfigInfo(recordId) {
	return fetch({
		url: '/api/incorruptibleArchives/fixtaskconfig/info',
		method: 'get'
	});
}

/**
 * 编辑固化任务设置
 */
export function updateFixtaskconfig(obj) {
	return fetch({
		url: '/api/incorruptibleArchives/fixtaskconfig',
		method: 'put',
		data: obj
	});
}

/**
 * 个人档案(部门一把手）审核列表
 */
export function headLeaderPage(query) {
	return fetch({
		url: '/api/incorruptibleArchives/individualtask/head-leader-task-audit-page',
		method: 'get',
		params: query
	});
}

/**
 * M6+高风险岗位个人档案任务列表
 */
export function individualTaskPage(query) {
	return fetch({
		url: '/api/incorruptibleArchives/individualtask/individual-task-page',
		method: 'get',
		params: query
	});
}

/**
 * 个人档案(纪委）审核列表
 */
export function jwPage(query) {
	return fetch({
		// url: `/api/incorruptibleArchives/individualtask/jw-page`,
		url: `/api/incorruptibleArchives/taskarchives/member-statistics-page`,
		method: 'get',
		params: query
	});
}

/**
 * 删除个人任务
 */
export function delIndividualtaskObj(id) {
	return fetch({
		url: `/api/incorruptibleArchives/individualtask/${id}`,
		method: 'delete'
	});
}

/**
 * 新增临时任务
 */
export function temporaryTask(obj) {
	return fetch({
		url: '/api/incorruptibleArchives/temporarytask',
		method: 'post',
		data: obj
	});
}

/**
 * 获得任务档案列表
 */
export function individualList(individualTaskId) {
	return fetch({
		url: `/api/incorruptibleArchives/taskarchives/${individualTaskId}/list`,
		method: 'get'
	});
}

/**
 * 填写档案
 */
export function taskarchives(obj) {
	return fetch({
		url: '/api/incorruptibleArchives/taskarchives',
		method: 'put',
		data: obj
	});
}

/**
 * 一把手填写档案
 */
export function taskarchivesLeader(obj) {
	return fetch({
		url: '/api/incorruptibleArchives/taskarchives/head-leader',
		method: 'put',
		data: obj
	});
}

/**
 * 新增审批记录
 */
export function archivesAudit(obj) {
	return fetch({
		url: '/api/incorruptibleArchives/task-archives-audit',
		method: 'post',
		data: obj
	});
}

/**
 * 审批记录详情
 */
export function archivesAuditInfo(individualTaskId) {
	return fetch({
		url: `/api/incorruptibleArchives/task-archives-audit/${individualTaskId}`,
		method: 'get'
	});
}

/**
 * 批量审批
 */
export function archivesAuditAll(obj) {
	return fetch({
		url: '/api/incorruptibleArchives/task-archives-audit/batch',
		method: 'post',
		data: obj
	});
}


/**
 * 获得动态表单的精简列表
 */
export function listSimple(query) {
	return fetch({
		url: '/api/bpm/form/list-all-simple',
		method: 'get',
		params: query
	});
}

/**
 * 删除谈话记录
 */
export function delObj(id) {
	return fetch({
		url: `/api/incorruptTalk/incorrupttalk/${id}`,
		method: 'delete'
	});
}

/**
 * 查询子公司台账列表
 */
export function pageAccount(query) {
	return fetch({
		url: '/api/incorruptTalk/incorrupttalk/subsidiaryPage',
		method: 'get',
		params: query
	});
}

/**
 * 新增谈话记录
 */
export function addObj(obj) {
	return fetch({
		url: '/api/incorruptTalk/incorrupttalk',
		method: 'post',
		data: obj
	});
}

/**
 * 修改谈话记录
 */
export function updateObj(obj) {
	return fetch({
		url: '/api/incorruptTalk/incorrupttalk',
		method: 'put',
		data: obj
	});
}

/**
 * 查询部门人员数据
 */
export function listByOrg(orgId) {
	return fetch({
		url: `/api/incorruptibleArchives/personnelpool/list-by-org-id/${orgId}`,
		method: 'get'
	});
}

/**
 * 个人任务档案列表
 */
export function memberArchivesPage(query,userId) {
	return fetch({
		url: `/api/incorruptibleArchives/individualtask/${userId}/member-archives-page`,
		method: 'get',
		params: query
	});
}

/**
 * 纪检添加任务档案列表
 */
export function individualInspectionList(query,individualTaskId) {
	return fetch({
		url: `/api/incorruptibleArchives/taskarchives/discipline-inspection/${individualTaskId}/list`,
		method: 'get',
		params: query
	});
}

/**
 * 新增纪检档案
 */
export function taskarchivesInspection(obj,individualTaskId) {
	return fetch({
		url: `/api/incorruptibleArchives/taskarchives/discipline-inspection/${individualTaskId}`,
		method: 'post',
		data: obj
	});
}

/**
 * 纪委新增记录树结构
 */
export function inspectionTreeList(query) {
	return fetch({
		url: `/api/incorruptibleArchives/unitarchives/discipline-inspection/tree`,
		method: 'get',
		params: query
	});
}

/**
 * 纪委新增单位档案
 */
export function unitriskpointsInspection(obj) {
	return fetch({
		url: `/api/incorruptibleArchives/unitarchives/discipline-inspection`,
		method: 'post',
		data: obj
	});
}

/**
 * 提报档案
 */
export function individualtaskPut(individualTaskId) {
	return fetch({
		url: `/api/incorruptibleArchives/individualtask/${individualTaskId}`,
		method: 'put'
	});
}

/**
 * 档案编号详情列表
 */
export function unitarchivesNumber(orgId) {
	return fetch({
		url: `/api/incorruptibleArchives/unit-archives-no/${orgId}`,
		method: 'get'
	});
}

/**
 * 档案编号保存-修改
 */
export function unitarchivesNumberEdit(obj,orgId) {
	return fetch({
		url: `/api/incorruptibleArchives/unit-archives-no/${orgId}`,
		method: 'post',
		data: obj
	});
}

/**
 * 新增/修改派驻组
 */
export function accreditGroup(obj,method) {
	return fetch({
		url: '/api/incorruptibleArchives/accredit-group',
		method: method,
		data: obj
	});
}

/**
 * 派驻组列表
 */
export function getAccreditGroup(query) {
	return fetch({
		url: `/api/incorruptibleArchives/accredit-group/page`,
		method: 'get',
		params: query
	});
}

/**
 * 删除派驻组
 */
export function delAccreditGroupObj(id) {
	return fetch({
		url: `/api/incorruptibleArchives/accredit-group/${id}`,
		method: 'delete'
	});
}

/**
 * 固化任务历史记录列表
 */
export function getHiarchivesissuetask(query) {
	return fetch({
		url: `/api/incorruptibleArchives/hiarchivesissuetask/list`,
		method: 'get',
		params: query
	});
}

/**
 * 删除固化任务历史记录
 */
export function delHiarchivesissuetaskObj(id) {
	return fetch({
		url: `/api/incorruptibleArchives/hiarchivesissuetask/${id}`,
		method: 'delete'
	});
}

/**
 * 自行提报档案
 */
export function initiativeSubmission(obj,formType) {
	return fetch({
		url: `/api/incorruptibleArchives/individualtask/initiative-submission/${formType}`,
		method: 'post',
		data: obj
	});
}

/**
 * 档案编号 - 单位档案-单位风险点详情
 */
export function getUnitarchivesno(orgId,type) {
	return fetch({
		url: `/api/incorruptibleArchives/unit-archives-no/${orgId}/${type}`,
		method: 'get'
	});
}

/**
 * 档案编号 - 编辑单位档案-单位风险点
 */
export function unitarchivesno(obj,orgId,type) {
	return fetch({
		url: `/api/incorruptibleArchives/unit-archives-no/${orgId}/${type}`,
		method: 'post',
		data: obj
	});
}

/**
 * 我的提报列表
 */
export function mytaskPage(query) {
	return fetch({
		url: `/api/incorruptibleArchives/individualtask/my-task-page`,
		method: 'get',
		params: query
	});
}

/**
 * 我的审核列表
 */
export function myauditPage(query) {
	return fetch({
		url: `/api/incorruptibleArchives/individualtask/my-audit-page`,
		method: 'get',
		params: query
	});
}

/**
 * 我的查看列表
 */
export function myviewPage(query) {
	return fetch({
		url: `/api/incorruptibleArchives/individualtask/my-view-page`,
		method: 'get',
		params: query
	});
}

/**
 * 获得人员历史档案列表
 */
export function hiarchivesList(query,userId) {
	return fetch({
		url: `/api/incorruptibleArchives/taskarchives/${userId}/hi-archives-list`,
		method: 'get',
		params: query
	});
}

/**
 * 历史详情
 */
export function getHiarchivesissuetaskDet(id) {
	return fetch({
		url: `/api/incorruptibleArchives/hiarchivesissuetask/${id}`,
		method: 'get'
	});
}

/**
 * 下发历史列表
 */
export function hitaskpage(query,id) {
	return fetch({
		url: `/api/incorruptibleArchives/hiarchivesissuetask/${id}/hi-task-page`,
		method: 'get',
		params: query
	});
}

/**
 * 表单树结构
 */
export function formtreeUser(query,userId) {
	return fetch({
		url: `/api/incorruptibleArchives/taskarchives/form-tree/${userId}`,
		method: 'get',
		params: query
	});
}

/**
 * 单位档案人员花名册列表
 */
export function personnelrosterPage(query,unitArchivesId) {
	return fetch({
		url: `/api/incorruptibleArchives/personnel-roster/page/${unitArchivesId}`,
		method: 'get',
		params: query
	});
}

/**
 * 导入人员花名册
 */
export function personnelrosterUpload(obj,unitArchivesId) {
	return fetch({
		url: `/api/incorruptibleArchives/personnel-roster/upload/${unitArchivesId}`,
		method: 'post',
		data: obj
	});
}

/**
 * 导出人员花名册
 */
export function personnelrosterOut() {
	return fetch({
		url: `/api/incorruptibleArchives/personnel-roster/download/${unitArchivesId}`,
		method: 'get'
	});
}

/**
 * 廉政档案目录管理 - 列表记录
 */
export function unitarchivestemplateList(type) {
	return fetch({
		url: `/api/incorruptibleArchives/unitarchivestemplate/list/${type}`,
		method: 'get'
	});
}

/**
 * 廉政档案目录管理 - 修改
 */
export function unitarchivestemplateUpdate(obj) {
	return fetch({
		url: `/api/incorruptibleArchives/unitarchivestemplate`,
		method: 'put',
		data: obj
	});
}

/**
 * 单位信息档案 - 下发提报任务
 */
export function unitarchivesIssue(obj) {
	return fetch({
		url: '/api/incorruptibleArchives/unit-archives-issue',
		method: 'post',
		data: obj
	});
}

/**
 * 单位信息档案 - 上次下发提报任务详情
 */
export function lastTimeInfo() {
	return fetch({
		url: '/api/incorruptibleArchives/unit-archives-issue/last-time-info',
		method: 'post'
	});
}

/**
 * 单位信息档案历史记录列表
 */
export function getUnitArchivesIssue(query) {
	return fetch({
		url: `/api/incorruptibleArchives/unit-archives-issue/list`,
		method: 'get',
		params: query
	});
}

/**
 * 单位信息档案 - 子公司提报
 */
export function subReport(orgId) {
	return fetch({
		url: `/api/incorruptibleArchives/unitarchives/${orgId}`,
		method: 'put'
	});
}