import request from '@/utils/request'

// 查询智能仓储WMS-盘点信息列表
export function listInventoryInformation(query) {
  return request({
    url: '/wms/inventoryInformation/list',
    method: 'get',
    params: query
  })
}

// 查询智能仓储WMS-盘点信息详细
export function getInventoryInformation(id) {
  return request({
    url: '/wms/inventoryInformation/' + id,
    method: 'get'
  })
}

// 新增智能仓储WMS-盘点信息
export function addInventoryInformation(data) {
  return request({
    url: '/wms/inventoryInformation',
    method: 'post',
    data: data
  })
}

// 修改智能仓储WMS-盘点信息
export function updateInventoryInformation(data) {
  return request({
    url: '/wms/inventoryInformation',
    method: 'put',
    data: data
  })
}

// 查询库存明细列表
export function inventoryDetailsList(query) {
  return request({
    url: '/wms/inventoryDetails/list',
    method: 'get',
    params: query
  })
}

// 删除盘点信息
export function delInventoryInformation(id) {
  return request({
    url: '/wms/inventoryInformation/' + id,
    method: 'delete'
  })
}

// 查询智能仓储WMS-盘点信息列表
export function noPagelistInventoryInformation() {
  return request({
    url: '/wms/inventoryInformation/noPageList',
    method: 'get'
  })
}
