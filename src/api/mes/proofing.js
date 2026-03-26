import request from '@/utils/request'

// 查询防错管理列表
export function listProofing(query) {
  return request({
    url: '/mes/proofing/list',
    method: 'get',
    params: query
  })
}

// 查询防错管理详细
export function getProofing(id) {
  return request({
    url: '/mes/proofing/' + id,
    method: 'get'
  })
}

// 新增防错管理
export function addProofing(data) {
  return request({
    url: '/mes/proofing',
    method: 'post',
    data: data
  })
}

// 修改防错管理
export function updateProofing(data) {
  return request({
    url: '/mes/proofing',
    method: 'put',
    data: data
  })
}

// 删除防错管理
export function delProofing(id) {
  return request({
    url: '/mes/proofing/' + id,
    method: 'delete'
  })
}
