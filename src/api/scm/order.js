import request from '@/utils/request'

// 查询供应链SCM-销售管理-销售订单列表
export function listOrder(query) {
  return request({
    url: '/scm/order/list',
    method: 'get',
    params: query
  })
}

// 查询供应链SCM-销售管理-销售订单详细
export function getOrder(id) {
  return request({
    url: '/scm/order/' + id,
    method: 'get'
  })
}

// 新增供应链SCM-销售管理-销售订单
export function addOrder(data) {
  return request({
    url: '/scm/order',
    method: 'post',
    data: data
  })
}

// 修改供应链SCM-销售管理-销售订单
export function updateOrder(data) {
  return request({
    url: '/scm/order',
    method: 'put',
    data: data
  })
}

// 删除供应链SCM-销售管理-销售订单
export function delOrder(id) {
  return request({
    url: '/scm/order/' + id,
    method: 'delete'
  })
}

// 提交供应链SCM-销售管理-销售订单
export function submitOrder(data) {
  return request({
    url: '/scm/order/submit',
    method: 'put',
    data: data
  })
}
// 提交供应链SCM-销售管理-销售订单
export function approveOrder(data) {
  return request({
    url: '/scm/order/approve',
    method: 'put',
    data: data
  })
}


