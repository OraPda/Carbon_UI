import request from '@/utils/request'

// 查询智能仓储WMS-基础数据-货主列表
export function listCargoOwner(query) {
  return request({
    url: '/wms/cargoOwner/list',
    method: 'get',
    params: query
  })
}

// 查询智能仓储WMS-基础数据-货主详细
export function getCargoOwner(id) {
  return request({
    url: '/wms/cargoOwner/' + id,
    method: 'get'
  })
}

// 新增智能仓储WMS-基础数据-货主
export function addCargoOwner(data) {
  return request({
    url: '/wms/cargoOwner',
    method: 'post',
    data: data
  })
}

// 修改智能仓储WMS-基础数据-货主
export function updateCargoOwner(data) {
  return request({
    url: '/wms/cargoOwner',
    method: 'put',
    data: data
  })
}

// 删除智能仓储WMS-基础数据-货主
export function delCargoOwner(id) {
  return request({
    url: '/wms/cargoOwner/' + id,
    method: 'delete'
  })
}
