import request from '@/utils/request'

// 查询智能仓储WMS-运输管理-配送管理列表
export function listDistribution(query) {
  return request({
    url: '/wms/distribution/list',
    method: 'get',
    params: query
  })
}

// 查询智能仓储WMS-运输管理-配送管理详细
export function getDistribution(id) {
  return request({
    url: '/wms/distribution/' + id,
    method: 'get'
  })
}

// 新增智能仓储WMS-运输管理-配送管理
export function addDistribution(data) {
  return request({
    url: '/wms/distribution',
    method: 'post',
    data: data
  })
}

// 修改智能仓储WMS-运输管理-配送管理
export function updateDistribution(data) {
  return request({
    url: '/wms/distribution',
    method: 'put',
    data: data
  })
}

// 删除智能仓储WMS-运输管理-配送管理
export function delDistribution(id) {
  return request({
    url: '/wms/distribution/' + id,
    method: 'delete'
  })
}

// 查询客户列表
export function listCustom() {
  return request({
    url: 'scm/custom/customList',
    method: 'get',
  })
}