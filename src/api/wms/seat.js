import request from '@/utils/request'

// 查询库位列表
export function listSeat(query) {
  return request({
    url: '/wms/seat/list',
    method: 'get',
    params: query
  })
}

// 查询库位详细
export function getSeat(id) {
  return request({
    url: '/wms/seat/' + id,
    method: 'get'
  })
}

// 新增库位
export function addSeat(data) {
  return request({
    url: '/wms/seat',
    method: 'post',
    data: data
  })
}

// 修改库位
export function updateSeat(data) {
  return request({
    url: '/wms/seat',
    method: 'put',
    data: data
  })
}

// 删除库位
export function delSeat(id) {
  return request({
    url: '/wms/seat/' + id,
    method: 'delete'
  })
}

// 查询仓库不分页
export function warehouseList(query) {
  return request({
    url: '/wms/warehouse/warehouseList',
    method: 'get',
    params: query
  })
}
