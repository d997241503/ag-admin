import fetch from '@/utils/fetch'

export function getTaskAssignRuleList(query) {
  return fetch({
    url: '/api/bpm/task-assign-rule/list',
    method: 'get',
    params: query
  })
}

export function createTaskAssignRule(data) {
  return fetch({
    url: '/api/bpm/task-assign-rule/create',
    method: 'post',
    data: data
  })
}

export function updateTaskAssignRule(data) {
  return fetch({
    url: '/api/bpm/task-assign-rule/update',
    method: 'put',
    data: data
  })
}
