import request from '@/utils/request'

// 查询我的任务—采购合同审核列表
export function listProcurementContract(query) {
  return request({
    url: '/mytask/procurementContract/list',
    method: 'get',
    params: query
  })
}

// 查询我的任务—采购合同审核详细
export function getProcurementContract(id) {
  return request({
    url: '/mytask/procurementContract/' + id,
    method: 'get'
  })
}

// 新增我的任务—采购合同审核
export function addProcurementContract(data) {
  return request({
    url: '/mytask/procurementContract',
    method: 'post',
    data: data
  })
}

// 修改我的任务—采购合同审核
export function updateProcurementContract(data) {
  return request({
    url: '/mytask/procurementContract',
    method: 'put',
    data: data
  })
}

// 删除我的任务—采购合同审核
export function delProcurementContract(id) {
  return request({
    url: '/mytask/procurementContract/' + id,
    method: 'delete'
  })
}
