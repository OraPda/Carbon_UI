import request from '@/utils/request'

// 查询采购计划审核列表
export function listProcurementPlan(query) {
  return request({
    url: '/mytask/procurementPlan/list',
    method: 'get',
    params: query
  })
}

// 查询采购计划审核详细
export function getProcurementPlan(id) {
  return request({
    url: '/mytask/procurementPlan/' + id,
    method: 'get'
  })
}

// 新增采购计划审核
export function addProcurementPlan(data) {
  return request({
    url: '/mytask/procurementPlan',
    method: 'post',
    data: data
  })
}

// 修改采购计划审核
export function updateProcurementPlan(data) {
  return request({
    url: '/mytask/procurementPlan',
    method: 'put',
    data: data
  })
}

// 删除采购计划审核
export function delProcurementPlan(id) {
  return request({
    url: '/mytask/procurementPlan/' + id,
    method: 'delete'
  })
}
