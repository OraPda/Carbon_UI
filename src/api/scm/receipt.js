import request from '@/utils/request'

// 查询采购入库列表
export function listReceipt(query) {
  return request({
    url: '/carbonReport/purchasingArriveDetails/list',
    method: 'get',
    params: query
  })
}
