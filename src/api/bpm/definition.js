import fetch from '@/utils/fetch'

export function getProcessDefinitionPage(query) {
  return fetch({
    url: '/api/bpm/process-definition/page',
    method: 'get',
    params: query
  })
}

export function getProcessDefinitionList(query) {
  return fetch({
    url: '/api/bpm/process-definition/list',
    method: 'get',
    params: query
  })
}

export function getProcessDefinitionBpmnXML(id) {
  return fetch({
    url: '/api/bpm/process-definition/get-bpmn-xml?id=' + id,
    method: 'get'
  })
}
