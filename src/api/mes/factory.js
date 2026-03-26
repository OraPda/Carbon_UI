import request from '@/utils/request'

// 查询工厂建模列表
export function listFactory(query) {
  return request({
    url: '/mes/factory/list',
    method: 'get',
    params: query
  })
}

// 查询工厂建模详细
export function getFactory(id) {
  return request({
    url: '/mes/factory/' + id,
    method: 'get'
  })
}

// 新增工厂建模
export function addFactory(data) {
  return request({
    url: '/mes/factory',
    method: 'post',
    data: data
  })
}

// 修改工厂建模
export function updateFactory(data) {
  return request({
    url: '/mes/factory',
    method: 'put',
    data: data
  })
}

// 删除工厂建模
export function delFactory(id) {
  return request({
    url: '/mes/factory/' + id,
    method: 'delete'
  })
}

// 查询设备列表
export function listDevice(query) {
  return request({
    url: '/mes/information/deviceList',
    method: 'get',
    params: query
  })
}

// 查询设备详细
export function getDevice(id) {
  return request({
    url: '/mes/information/' + id,
    method: 'get'
  })
}