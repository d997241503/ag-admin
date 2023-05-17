import fetch from '@/utils/fetch'

// 创建工作流的表单定义
export function createForm(data) {
  return fetch({
    url: '/api/bpm/form/create',
    method: 'post',
    data: data
  })
}

// 更新工作流的表单定义
export function updateForm(data) {
  return fetch({
    url: '/api/bpm/form/update',
    method: 'put',
    data: data
  })
}

// 删除工作流的表单定义
export function deleteForm(id) {
  return fetch({
    url: '/api/bpm/form/delete?id=' + id,
    method: 'delete'
  })
}

// 获得工作流的表单定义
export function getForm(id) {
  return fetch({
    url: '/api/bpm/form/get?id=' + id,
    method: 'get'
  })
}

// 获得工作流的表单定义分页
export function getFormPage(query) {
  return fetch({
    url: '/api/bpm/form/page',
    method: 'get',
    params: query
  })
}

// 获得动态表单的精简列表
export function getSimpleForms() {
  return fetch({
    url: '/api/bpm/form/list-all-simple',
    method: 'get'
  })
}
