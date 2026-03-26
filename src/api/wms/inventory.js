import request from '@/utils/request'

// 查询物料库存列表
export function listInventory(query) {
  return request({
    url: '/wms/inventory/list',
    method: 'get',
    params: query
  })
}

// 查询物料库存详细
export function getInventory(id) {
  return request({
    url: '/wms/inventory/' + id,
    method: 'get'
  })
}

// 新增物料库存
export function addInventory(data) {
  return request({
    url: '/wms/inventory',
    method: 'post',
    data: data
  })
}

// 修改物料库存
export function updateInventory(data) {
  return request({
    url: '/wms/inventory',
    method: 'put',
    data: data
  })
}

// 删除物料库存
export function delInventory(id) {
  return request({
    url: '/wms/inventory/' + id,
    method: 'delete'
  })
}

// 查询物料列表不分页
export function listMaterial() {
  return request({
    url: '/wms/material/materialList',
    method: 'get',
  })
}

// 查询仓库列表不分页
export function listWarehouse() {
  return request({
    url: '/wms/warehouse/warehouseList',
    method: 'get',
  })
}

// 查询仓库详细
export function getWarehouse(id) {
  return request({
    url: '/wms/warehouse/' + id,
    method: 'get'
  })
}

// 查询库区详细
export function getArea(id) {
  return request({
    url: '/wms/area/' + id,
    method: 'get'
  })
}

// 查询移库信息
export function getRelocationInfo(id) {
  return request({
    url: '/wms/inventory/selectRelocationInfoById/' + id,
    method: 'get'
  })
}

// 执行移库
export function relocation(data) {
  return request({
    url: '/wms/relocation/relocation',
    method: 'post',
    data: data
  })
}
