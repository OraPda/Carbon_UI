import request from '@/utils/request'

// 查询销售计划列表
export function listPlan(query) {
  return request({
    url: '/scm/plan/list',
    method: 'get',
    params: query
  })
}

// 查询销售计划详细
export function getPlan(id) {
  return request({
    url: '/scm/plan/' + id,
    method: 'get'
  })
}

// 新增销售计划
export function addPlan(data) {
  return request({
    url: '/scm/plan',
    method: 'post',
    data: data
  })
}

// 修改销售计划
export function updatePlan(data) {
  return request({
    url: '/scm/plan',
    method: 'put',
    data: data
  })
}

// 删除销售计划
export function delPlan(id) {
  return request({
    url: '/scm/plan/' + id,
    method: 'delete'
  })
}
