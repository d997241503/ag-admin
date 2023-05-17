import fetch from 'utils/fetch';

export function page(query) {
	return fetch({
		url: '/api/admin/dataDictionary/page',
		method: 'get',
		params: query
	});
}

export function addObj(obj) {
	return fetch({
		url: '/api/admin/dataDictionary',
		method: 'post',
		data: obj
	});
}

export function getObj(id) {
	return fetch({
		url: '/api/admin/dataDictionary/' + id,
		method: 'get'
	})
}

export function getByType(query) {
	return fetch({
		url: '/api/admin/dataDictionary/getByType',
		method: 'get',
		params: query
	})
}

export function delObj(id) {
	return fetch({
		url: '/api/admin/dataDictionary/' + id,
		method: 'delete'
	})
}

export function putObj(id, obj) {
	return fetch({
		url: '/api/admin/dataDictionary/' + id,
		method: 'put',
		data: obj
	})
}
