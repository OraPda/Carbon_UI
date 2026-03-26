import request from '@/utils/request'

// 查询移库信息列表
export function listRelocation(query) {
  return request({
    url: '/wms/relocation/list',
    method: 'get',
    params: query
  })
}

// 查询移库信息详细
export function getRelocation(id) {
  return request({
    url: '/wms/relocation/' + id,
    method: 'get'
  })
}

// 新增移库信息
export function addRelocation(data) {
  return request({
    url: '/wms/relocation',
    method: 'post',
    data: data
  })
}

// 修改移库信息
export function updateRelocation(data) {
  return request({
    url: '/wms/relocation',
    method: 'put',
    data: data
  })
}

// 删除移库信息
export function delRelocation(id) {
  return request({
    url: '/wms/relocation/' + id,
    method: 'delete'
  })
}

// 查询仓库列表不分页
export function listWarehouse() {
  return request({
    url: '/wms/warehouse/warehouseList',
    method: 'get',
  })
}

// 查询库区列表不分页
export function listArea() {
  return request({
    url: '/wms/area/areaList',
    method: 'get',
  })
}

// 查询库位列表不分页
export function listSeat() {
  return request({
    url: '/wms/seat/seatList',
    method: 'get',
  })
}


// 查询物料档案列表不分页
export function listMaterial() {
  return request({
    url: '/wms/material/materialList',
    method: 'get',
  })
}
