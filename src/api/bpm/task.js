import fetch from '@/utils/fetch'

export function getTodoTaskPage(query) {
  return fetch({
    url: '/api/bpm/task/todo-page',
    method: 'get',
    params: query
  })
}

export function getDoneTaskPage(query) {
  return fetch({
    url: '/api/bpm/task/done-page',
    method: 'get',
    params: query
  })
}

export function completeTask(data) {
  return fetch({
    url: '/api/bpm/task/complete',
    method: 'PUT',
    data: data
  })
}

export function approveTask(data) {
  return fetch({
    url: '/api/bpm/task/approve',
    method: 'PUT',
    data: data
  })
}

export function rejectTask(data) {
  return fetch({
    url: '/api/bpm/task/reject',
    method: 'PUT',
    data: data
  })
}
export function backTask(data) {
  return fetch({
    url: '/api/bpm/task/back',
    method: 'PUT',
    data: data
  })
}

export function updateTaskAssignee(data) {
  return fetch({
    url: '/api/bpm/task/update-assignee',
    method: 'PUT',
    data: data
  })
}

export function getTaskListByProcessInstanceId(processInstanceId) {
  return fetch({
    url: '/api/bpm/task/list-by-process-instance-id?processInstanceId=' + processInstanceId,
    method: 'get',
  })
}
