// 廉政档案
import fetch from 'utils/fetch';
// 首页侧边统计

export function getArchivesTypeCount() {
	return fetch({
		url: '/api/incorrupt/Main/getArchivesTypeCount',
		method: 'get',
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}
// 廉政信息档案列表
export function incorruptList(query) {
	return fetch({
		url: '/api/incorrupt/archives/list',
		method: 'get',
		params: query,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}
export function baseDepartment() {
	return fetch({
		url: '/api/admin/baseDepartment/deptList',
		method: 'get',
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	})
}
// 获取组织下人员列表
export function userList(query) {
	return fetch({
		url: '/api/admin/user/userList2',
		method: 'get',
		params: query,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	})
}
// 查看档案信息详情
export function archivesDetail(query) {
	return fetch({
		url: '/api/Incorrupt/punishArchives/archivesDetail',
		method: 'get',
		params: query,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	})
}
//廉政新增档案人员
export function archivesUserList(query) {
	return fetch({
		url: '/api/admin/user/userList2',
		method: 'get',
		params: query,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	})
}
// 新增档案信息
export function save(obj) {
	return fetch({
		url: '/api/incorrupt/archives/save',
		method: 'post',
		data: obj,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}
//查看表模板类型
export function getByType() {
	return fetch({
		url: '/api/admin/dataDictionary/getByType?type=incorrupt',
		method: 'get',
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	})
}

// 新增表格信息
export function savePunish(obj) {
	return fetch({
		url: '/api/incorrupt/archives/savePunish',
		method: 'post',
		data: obj,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}

// 可添加多个表格信息
export function saveTable(obj) {
	return fetch({
		url: '/api/incorrupt/archives/saveTable',
		method: 'post',
		data: obj,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}

// 查看用户姓名
export function userById(query) {
	return fetch({
		url: '/api/incorrupt/incorrupt/userById',
		method: 'get',
		params: query,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}
//查询表格信息
export function getById(query) {
	return fetch({
		url: '/api/incorrupt/archives/getById',
		method: 'get',
		params: query,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}

//查询表格详情
export function getDetails(query) {
	return fetch({
		url: '/api/incorrupt/archives/details',
		method: 'get',
		params: query,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}

// 修改表格信息
export function updatepunish(obj) {
	return fetch({
		url: '/api/incorrupt/archives/updatepunish',
		method: 'put',
		data: obj,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}

// 修改档案信息
export function update(obj) {
	return fetch({
		url: '/api/incorrupt/archives/update',
		method: 'put',
		data: obj,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	})
}
// 删除档案信息
export function del(id) {
	return fetch({
		url: `/api/incorrupt/archives/del?ids=${id}`,
		method: 'delete',
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	})
}
// 上传文件
export function uploadInformFile(obj) {
	return fetch({
		url: '/api/upload/uploads/uploadInformFile',
		method: 'post',
		data: obj,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}
// 下载文件
export function downloadFile(obj) {
	return fetch({
		url: '/api/upload/download/downloadIncorruptFile',
		method: 'post',
		data: obj,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}
// 修改记录
export function savePunishLog(obj) {
	return fetch({
		url: '/api/incorrupt/archives/savePunishLog',
		method: 'post',
		data: obj,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}

// 年份
export function getYear() {
	return fetch({
		url: '/api/incorrupt/archives/getYear',
		method: 'get',
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}

//查询模板类型
export function getTemplateType(query) {
	return fetch({
		url: '/api/incorrupt/archives/getByType',
		method: 'get',
		params: query,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}
// 筛选表格类型
export function getByName(query) {
	return fetch({
		url: '/api/admin/dataDictionary/getByName',
		method: 'get',
		params: query,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}

// 四种形态列表查询
export function getShapeList(query) {
	return fetch({
		url: '/api/incorrupt/shape/list',
		method: 'get',
		params: query,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}
//四种形态树状查询
export function getTreeList() {
	return fetch({
		url: '/api/incorrupt/shape/getTree',
		method: 'get',
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}

//查询形态配置
export function getByIds(query) {
	return fetch({
		url: '/api/incorrupt/shape/getByIds',
		method: 'get',
		params: query,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}

// 形态颜色查询
export function getShapeListColor() {
	return fetch({
		url: '/api/incorrupt/shape/shapeList',
		method: 'get',
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}
//通过id进行颜色查询
export function getByShapeId(query) {
	return fetch({
		url: '/api/incorrupt/shape/getByShapeId',
		method: 'get',
		params: query,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}

// 四种形态的配置修改提交
export function updatePunish(obj) {
	return fetch({
		url: '/api/incorrupt/shape/updatePunish',
		method: 'put',
		data: obj,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}

//新增四种形态
export function savaPunishShape(obj) {
	return fetch({
		url: '/api/incorrupt/shape/savaPunishShape',
		method: 'post',
		data: obj,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}

//删除四种形态配置
export function deleteShape(id) {
	return fetch({
		url: `/api/incorrupt/shape/delete?ids=${id}`,
		method: 'put',
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	})
}
//修改形态配置
export function updatePunishMenu(obj) {
	return fetch({
		url: `/api/incorrupt/shape/updatePunishMenu`,
		method: 'put',
		data: obj,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	})
}
// 形态年份查询
export function getShapeYear() {
	return fetch({
		url: '/api/incorrupt/shape/getYear',
		method: 'get',
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}

//查看四种形态配置
export function getByPunidshId(query) {
	return fetch({
		url: '/api/incorrupt/archives/getByPunidshId',
		method: 'get',
		params: query,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}

//统计分析总数据
export function getPunishStatistics(query) {
	return fetch({
		url: `/api/incorrupt/statistics/getPunishStatistics`,
		method: 'get',
		params: query,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}

//纪律惩处查询统计
export function getPunishStatisticsTow(query) {
	return fetch({
		url: `/api/incorrupt/statistics/getPunishStatistics2`,
		method: 'get',
		params: query,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}

// 四种形态查询统计
export function getPercentNum(query) {
	return fetch({
		url: `/api/incorrupt/statistics/getPercentNum`,
		method: 'get',
		params: query,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}

// 确认状态
export function getCurrentState(id) {
	return fetch({
		url: `/api/incorrupt/archives/getCurrentState?ids=${id}`,
		method: 'put',
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}

// 上传文件
export function uploadIncorruptFile(obj) {
	return fetch({
		url: `/api/upload/uploads/uploadIncorrputFile`,
		method: 'post',
		data: obj,
		'header': {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary2cLKpr1OLDyZ3R7H'
		}
	});
}

// 拍照上传
export function saveImage(obj) {
	return fetch({
		url: `/api/incorrupt/archives/saveImage`,
		method: 'post',
		data: obj,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}

//查找照片
export function imageList(query) {
	return fetch({
		url: `/api/incorrupt/archives/imageList`,
		method: 'get',
		params: query,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}

//删除照片
export function deleteImage(id) {
	return fetch({
		url: `/api/incorrupt/archives/deleteImage?fileId=${id}`,
		method: 'DELETE',
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}

// 删除多个档案表
export function getDelList(id) {
	return fetch({
		url: `/api/incorrupt/archives/getDelList?ids=${id}`,
		method: 'DELETE',
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}

// 查询案管列表
export function getArchivesList(param) {
	return fetch({
		url: `/api/incorrupt/archives/publist`,
		method: 'get',
		params: param,
		'header': {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}
