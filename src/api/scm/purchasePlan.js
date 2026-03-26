import request from '@/utils/request'

// 查询采购计划列表
export function listPlan(query) {
  return request({
    url: '/scm/purchase/plan/list',
    method: 'get',
    params: query
  })
}

// 查询采购计划详细
export function getPlan(id) {
  return request({
    url: '/scm/purchase/plan/' + id,
    method: 'get'
  })
}

// 新增采购计划
export function addPlan(data) {
  return request({
    url: '/scm/purchase/plan',
    method: 'post',
    data: data
  })
}

// 修改采购计划
export function updatePlan(data) {
  return request({
    url: '/scm/purchase/plan',
    method: 'put',
    data: data
  })
}

// 删除采购计划
export function delPlan(id) {
  return request({
    url: '/scm/purchase/plan/' + id,
    method: 'delete'
  })
}

// 提交采购计划
export function submitPlan(data) {
  return request({
    url: '/scm/purchase/plan/submit',
    method: 'put',
    data: data
  })
}

// 审核采购计划
export function approvePlan(data) {
  return request({
    url: '/scm/purchase/plan/approve',
    method: 'put',
    data: data
  })
}
