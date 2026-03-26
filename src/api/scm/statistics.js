import request from '@/utils/request'

// 查询产品统计列表
export function listStatistics(query) {
  return request({
    url: '/carbonReport/scmPurchase/material/list',
    method: 'get',
    params: query
  })
}
