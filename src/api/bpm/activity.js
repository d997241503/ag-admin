import fetch from '@/utils/fetch'

export function getActivityList(query) {
  return fetch({
    url: '/api/bpm/activity/list',
    method: 'get',
    params: query
  })
}
