import request from '@/utils/request'


// 查询碳中和计算比例列表
export function listProportion(query) {
  return request({
    url: '/dc/neutrality/list',
    method: 'get',
    params: query
  })
}

// 修改碳中和计算比例
export function updateProportion(data) {
  return request({
    url: '/dc/neutrality',
    method: 'put',
    data: data
  })
}
