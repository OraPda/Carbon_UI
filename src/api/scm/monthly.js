import request from '@/utils/request'

// 查询供应链SCM-统计分析-月份统计
export function listMonth(query) {
  return request({
    url: '/carbonReport/scmSale/contractDeliveryReturnReport/byMonth',
    method: 'get',
    params: query
  })
}

// 查询供应链SCM-统计分析-季度统计
export function listQuarter(query) {
  return request({
    url: '/carbonReport/scmSale/contractDeliveryReturnReport/byQuarter',
    method: 'get',
    params: query
  })
}
