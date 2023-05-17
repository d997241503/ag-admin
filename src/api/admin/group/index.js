import fetch from 'utils/fetch';

export function getAllGroupTypes() {
  return fetch({
    url: '/api/admin/groupType/all',
    method: 'get'
  });
}

export function fetchTree(query) {
  return fetch({
    url: '/api/admin/group/tree',
    method: 'get',
    params: query
  });
}


export function addObj(obj) {
  return fetch({
    url: '/api/admin/group',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/admin/group/' + id,
    method: 'get'
  });
}

export function delObj(id) {
  return fetch({
    url: '/api/admin/group/' + id,
    method: 'delete'
  });
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/admin/group/' + id,
    method: 'put',
    data: obj
  });
}

export function getUsers(id) {
  return fetch({
    url: '/api/admin/group/' + id + '/user',
    method: 'get'
  });
}

export function modifyUsers(id, data) {
  return fetch({
    url: '/api/admin/group/' + id + '/user',
    method: 'put',
    params: data
  });
}

export function removeElementAuthority(id, data) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/element/remove',
    method: 'put',
    params: data
  });
}

// 修改角色按钮级资源
export function editElementAuthority(id, data) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/element',
    method: 'put',
    data: data
  });
}

export function addElementAuthority(id, data) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/element/add',
    method: 'put',
    params: data
  });
}

export function getElementAuthority(id) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/element',
    method: 'get'
  });
}

export function modifyMenuAuthority(id, data) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/menu',
    method: 'put',
    params: data
  });
}


export function getMenuAuthority(id) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/menu',
    method: 'get'
  });
}

/* 查询角色组 */
export function listSimpleRoles(query) {
  return fetch({
    url: '/api/admin/group/group-all',
    method: 'get',
    params: query
  });
}

/* 查询角色资源 */
export function getDeptResource(id) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/dept-resource',
    method: 'get'
  });
}

/* 修改角色资源 */
export function editDeptResource(id, data) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/dept-resource',
    method: 'put',
    data: data
  });
}

/* 查询角色关联部门 */
export function getGroupdeptlist(query) {
	return fetch({
		url: `/api/admin/group/dept-list`,
		method: 'get',
		params: query
	});
}


export function putOwndepartmentObj(obj) {
  return fetch({
    url: '/api/admin/group/own-department',
    method: 'put',
    data: obj
  });
}

/**查询角色关联用户 */
export function getGroupUserlist(query) {
	return fetch({
		url: `/api/admin/group/user-list`,
		method: 'get',
		params: query
	});
}
