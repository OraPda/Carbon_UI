import request from '@/utils/request'

// 查询供应链SCM-销售报-销售台账列表
export function listBill(query) {
  return request({
    url: '/carbonReport/scmSale/saleBook/list',
    method: 'get',
    params: query
  })
}
