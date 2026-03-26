import request from '@/utils/request'

// 查询智能仓储WMS-补货申请列表
export function listReplenishmentApplication(query) {
  return request({
    url: '/wms/replenishmentApplication/list',
    method: 'get',
    params: query
  })
}

// 查询智能仓储WMS-补货申请详细
export function getReplenishmentApplication(id) {
  return request({
    url: '/wms/replenishmentApplication/' + id,
    method: 'get'
  })
}

// 新增智能仓储WMS-补货申请
export function addReplenishmentApplication(data) {
  return request({
    url: '/wms/replenishmentApplication',
    method: 'post',
    data: data
  })
}

// 生成采购单
export function repPurchaseApply(data) {
  return request({
    url: '/wms/replenishmentApplication/genPurchaseApply',
    method: 'post',
    data: data
  })
}

// 修改智能仓储WMS-补货申请
export function updateReplenishmentApplication(data) {
  return request({
    url: '/wms/replenishmentApplication',
    method: 'put',
    data: data
  })
}

// 审核智能仓储WMS-补货申请
export function approveReplenishmentApplication(data) {
  return request({
    url: '/wms/replenishmentApplication/approve',
    method: 'put',
    data: data
  })
}

// 提交智能仓储WMS-补货申请
export function subReplenishmentApplication(data) {
  return request({
    url: '/wms/replenishmentApplication/submit',
    method: 'put',
    data: data
  })
}

// 删除智能仓储WMS-补货申请
export function delReplenishmentApplication(id) {
  return request({
    url: '/wms/replenishmentApplication/' + id,
    method: 'delete'
  })
}

// 查询用户列表
export function listUser() {
  return request({
    url: 'system/user/userList',
    method: 'get',
  })
}

// 查询物料列表不分页
export function listMaterial() {
  return request({
    url: '/wms/material/materialList',
    method: 'get',
  })
}
