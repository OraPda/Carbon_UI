import request from '@/utils/request'

// 查询固定碳排放列表
export function listFixedEmissions(query) {
  return request({
    url: '/dc/fixedEmissions/list',
    method: 'get',
    params: query
  })
}

// 查询固定碳排放详细
export function getFixedEmissions(id) {
  return request({
    url: '/dc/fixedEmissions/' + id,
    method: 'get'
  })
}

// 新增固定碳排放
export function addFixedEmissions(data) {
  return request({
    url: '/dc/fixedEmissions',
    method: 'post',
    data: data
  })
}

// 修改固定碳排放
export function updateFixedEmissions(data) {
  return request({
    url: '/dc/fixedEmissions',
    method: 'put',
    data: data
  })
}

// 删除固定碳排放
export function delFixedEmissions(id) {
  return request({
    url: '/dc/fixedEmissions/' + id,
    method: 'delete'
  })
}
