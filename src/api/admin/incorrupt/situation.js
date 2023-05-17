
import fetch from 'utils/fetch';
// export function mainList(query) {
// 	return fetch({
// 		url: `/api/incorrupt/Main/list`,
// 		method: 'get',
// 		params: query,
// 		'header': {
// 		'Content-Type': 'application/json;charset=UTF-8'
// 		}
// 	});
// }

export function mainList(query) {
	return fetch({
		url: `/api/incorrupt/Main/list1`,
		method: 'get',
		params: query,
		'header': {
		'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}

export function getPercentNum() {
	return fetch({
		url: `/api/incorrupt/Main/getPercentNum`,
		method: 'get',
		'header': {
		'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}

export function getPercentNum11() {
	return fetch({
		url: `/api/incorrupt/Main/getPercentNum11`,
		method: 'get',
		'header': {
		'Content-Type': 'application/json;charset=UTF-8'
		}
	});
}
