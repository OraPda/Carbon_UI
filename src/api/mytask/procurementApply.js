import request from '@/utils/request'

// 查询我的任务-采购申请审核列表
export function listProcurementApply(query) {
  return request({
    url: '/mytask/procurementApply/list',
    method: 'get',
    params: query
  })
}

// 查询我的任务-采购申请审核详细
export function getProcurementApply(id) {
  return request({
    url: '/mytask/procurementApply/' + id,
    method: 'get'
  })
}

// 新增我的任务-采购申请审核
export function addProcurementApply(data) {
  return request({
    url: '/mytask/procurementApply',
    method: 'post',
    data: data
  })
}

// 修改我的任务-采购申请审核
export function updateProcurementApply(data) {
  return request({
    url: '/mytask/procurementApply',
    method: 'put',
    data: data
  })
}

// 删除我的任务-采购申请审核
export function delProcurementApply(id) {
  return request({
    url: '/mytask/procurementApply/' + id,
    method: 'delete'
  })
}
