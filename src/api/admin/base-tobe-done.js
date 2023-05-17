import fetch from 'utils/fetch'

export function taskCenterList(msgType, query) {
    return fetch({
      url: `/api/admin/basetobedone/page/${msgType}`,
      method: 'get',
      params: query
    })
}

export function taskCenterSta(query) {
    return fetch({
      url: `/api/admin/basetobedone/statistics`,
      method: 'get',
      params: query
    })
}