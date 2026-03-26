import request from '@/utils/request'

// 查询我的任务—采购计划审核列表
export function listStockin(query) {
  return request({
    url: '/mytask/stockin/list',
    method: 'get',
    params: query
  })
}

// 查询我的任务—采购计划审核详细
export function getStockin(id) {
  return request({
    url: '/mytask/stockin/' + id,
    method: 'get'
  })
}

// 新增我的任务—采购计划审核
export function addStockin(data) {
  return request({
    url: '/mytask/stockin',
    method: 'post',
    data: data
  })
}

// 修改我的任务—采购计划审核
export function updateStockin(data) {
  return request({
    url: '/mytask/stockin',
    method: 'put',
    data: data
  })
}

// 删除我的任务—采购计划审核
export function delStockin(id) {
  return request({
    url: '/mytask/stockin/' + id,
    method: 'delete'
  })
}

// 新增我的任务—采购计划审核
export function approve(data) {
  return request({
    url: '/mytask/stockin/approve',
    method: 'post',
    data: data
  })
}
// 新增我的任务—采购计划审核
export function reject(data) {
  return request({
    url: '/mytask/stockin/reject',
    method: 'post',
    data: data
  })
}
