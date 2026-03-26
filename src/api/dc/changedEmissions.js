import request from '@/utils/request'

// 查询变化碳排放列表
export function listChangedEmissions(query) {
  return request({
    url: '/dc/changedEmissions/list',
    method: 'get',
    params: query
  })
}

// 查询变化碳排放详细
export function getChangedEmissions(id) {
  return request({
    url: '/dc/changedEmissions/' + id,
    method: 'get'
  })
}

// 新增变化碳排放
export function addChangedEmissions(data) {
  return request({
    url: '/dc/changedEmissions',
    method: 'post',
    data: data
  })
}

// 修改变化碳排放
export function updateChangedEmissions(data) {
  return request({
    url: '/dc/changedEmissions',
    method: 'put',
    data: data
  })
}

// 删除变化碳排放
export function delChangedEmissions(id) {
  return request({
    url: '/dc/changedEmissions/' + id,
    method: 'delete'
  })
}
