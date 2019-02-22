import request from '@/utils/request'
const base_url = 'http://localhost:9200/creditcardhack/_search?q='
export function getDefaulter(params) {
  return request({
    url: base_url+'default.payment.next.month:1',
    method: 'get',
    params
  })
}

export function getUserList(params) {
  const param = params
  return request({
    url: base_url+param,
    method: 'get',
    param
  })
}

export function getUserByParams(params) {
  return request({
    url: base_url+'/table/list',
    method: 'get',
    params
  })
}
