import fetch from '@/utils/fetch'

export function getMyProcessInstancePage(query) {
  return fetch({
    url: '/api/bpm/process-instance/my-page',
    method: 'get',
    params: query,
    paramsSerializer: (params) => {
        let result = Object.keys(params).reduce((pre, curr) => {
          return params[curr] ? (pre ? pre + '&' : '') + encodeURIComponent(curr) + '=' + encodeURIComponent(params[curr]) : pre;
        }, '');
        return result
    }
  })
}

export function createProcessInstance(data) {
  return fetch({
    url: '/api/bpm/process-instance/create',
    method: 'POST',
    data: data
  })
}

export function cancelProcessInstance(id, reason) {
  return fetch({
    url: '/api/bpm/process-instance/cancel',
    method: 'DELETE',
    data: {
      id,
      reason
    }
  })
}

export function getProcessInstance(id) {
  return fetch({
    url: '/api/bpm/process-instance/get?id=' + id,
    method: 'get',
  })
}
