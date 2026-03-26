import request from '@/utils/request'

// 查询采购计划列表
export function listApply(query) {
  return request({
    url: '/scm/purchase/apply/list',
    method: 'get',
    params: query
  })
}

// 查询采购计划详细
export function getApply(id) {
  return request({
    url: '/scm/purchase/apply/' + id,
    method: 'get'
  })
}

// 新增采购计划
export function addApply(data) {
  return request({
    url: '/scm/purchase/apply',
    method: 'post',
    data: data
  })
}

// 修改采购计划
export function updateApply(data) {
  return request({
    url: '/scm/purchase/apply',
    method: 'put',
    data: data
  })
}

// 删除采购计划
export function delApply(id) {
  return request({
    url: '/scm/purchase/apply/' + id,
    method: 'delete'
  })
}

// 提交采购计划
export function submitApply(data) {
  return request({
    url: '/scm/purchase/apply/submit',
    method: 'put',
    data: data
  })
}


// 审核采购计划
export function approveApply(data) {
  return request({
    url: '/scm/purchase/apply/approve',
    method: 'put',
    data: data
  })
}

