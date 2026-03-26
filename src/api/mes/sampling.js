import request from '@/utils/request'

// 查询生产采样列表

export function listSampling(query) {
  return request({
    url: '/mes/sampling/list',
    method: 'get',
    params: query
  })
}

// 查询生产采样详细

export function getSampling(id) {
  return request({
    url: '/mes/sampling/' + id,
    method: 'get'
  })
}

// 新增生产采样

export function addSampling(data) {
  return request({
    url: '/mes/sampling',
    method: 'post',
    data: data
  })
}

// 修改生产采样

export function updateSampling(data) {
  return request({
    url: '/mes/sampling',
    method: 'put',
    data: data
  })
}

// 删除生产采样

export function delSampling(id) {
  return request({
    url: '/mes/sampling/' + id,
    method: 'delete'
  })
}