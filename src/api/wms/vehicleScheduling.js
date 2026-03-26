import request from '@/utils/request'

// 查询智能仓储WMS-运输管理-车辆调度列表
export function listVehicleScheduling(query) {
  return request({
    url: '/wms/vehicleScheduling/list',
    method: 'get',
    params: query
  })
}

// 查询智能仓储WMS-运输管理-车辆调度详细
export function getVehicleScheduling(id) {
  return request({
    url: '/wms/vehicleScheduling/' + id,
    method: 'get'
  })
}

// 新增智能仓储WMS-运输管理-车辆调度
export function addVehicleScheduling(data) {
  return request({
    url: '/wms/vehicleScheduling',
    method: 'post',
    data: data
  })
}

// 修改智能仓储WMS-运输管理-车辆调度
export function updateVehicleScheduling(data) {
  return request({
    url: '/wms/vehicleScheduling',
    method: 'put',
    data: data
  })
}

// 删除智能仓储WMS-运输管理-车辆调度
export function delVehicleScheduling(id) {
  return request({
    url: '/wms/vehicleScheduling/' + id,
    method: 'delete'
  })
}
