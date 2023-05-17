import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/admin/baseQuickEntry/queryQuick',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/admin/baseQuickEntry/addQuick',
    method: 'post',
    data: obj
  });
}

export function delObj(query) {
  return fetch({
    url: '/api/admin/baseQuickEntry/deleteQuick',
    method: 'delete',
	params: query
  })
}
