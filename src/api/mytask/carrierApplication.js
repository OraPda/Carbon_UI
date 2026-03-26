import request from '@/utils/request'

// 查询承运申请审核列表
export function listCarrierApplication(query) {
  return request({
    url: '/mytask/carrierApplication/list',
    method: 'get',
    params: query
  })
}

// 查询承运申请审核详细
export function getCarrierApplication(id) {
  return request({
    url: '/mytask/carrierApplication/' + id,
    method: 'get'
  })
}

// 新增承运申请审核
export function addCarrierApplication(data) {
  return request({
    url: '/mytask/carrierApplication',
    method: 'post',
    data: data
  })
}

// 修改承运申请审核
export function updateCarrierApplication(data) {
  return request({
    url: '/mytask/carrierApplication',
    method: 'put',
    data: data
  })
}

// 删除承运申请审核
export function delCarrierApplication(id) {
  return request({
    url: '/mytask/carrierApplication/' + id,
    method: 'delete'
  })
}
