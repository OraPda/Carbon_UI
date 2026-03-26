import request from '@/utils/request'

// 查询质量报告列表
export function listQuality(query) {
  return request({
    url: '/mes/quality/list',
    method: 'get',
    params: query
  })
}

// 查询质量报告详细
export function getQuality(id) {
  return request({
    url: '/mes/quality/' + id,
    method: 'get'
  })
}

// 新增质量报告
export function addQuality(data) {
  return request({
    url: '/mes/quality',
    method: 'post',
    data: data
  })
}

// 修改质量报告
export function updateQuality(data) {
  return request({
    url: '/mes/quality',
    method: 'put',
    data: data
  })
}

// 删除质量报告
export function delQuality(id) {
  return request({
    url: '/mes/quality/' + id,
    method: 'delete'
  })
}
