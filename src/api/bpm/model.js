import fetch from 'utils/fetch';

export function getModelPage(query) {
  return fetch({
    url: '/api/bpm/model/page',
    method: 'get',
    params: query
  })
}

export function getModel(id) {
  return fetch({
    url: '/api/bpm/model/get?id=' + id,
    method: 'get'
  })
}

export function updateModel(data) {
  return fetch({
    url: '/api/bpm/model/update',
    method: 'PUT',
    data: data
  })
}

// 任务状态修改
export function updateModelState(id, state) {
  return fetch({
    url: '/api/bpm/model/update-state',
    method: 'put',
    data: {
      id,
      state
    }
  })
}

export function createModel(data) {
  return fetch({
    url: '/api/bpm/model/create',
    method: 'POST',
    data: data
  })
}

export function deleteModel(id) {
  return fetch({
    url: '/api/bpm/model/delete?id=' + id,
    method: 'DELETE'
  })
}

export function deployModel(id) {
  return fetch({
    url: '/api/bpm/model/deploy?id=' + id,
    method: 'POST'
  })
}
