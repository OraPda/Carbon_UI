import request from '@/utils/request'

// 查询供应链SCM-采购管理-采购合同列表
export function listContract(query) {
  return request({
    url: '/scm/purchase/contract/list',
    method: 'get',
    params: query
  })
}

// 查询供应链SCM-采购管理-采购合同详细
export function getContract(id) {
  return request({
    url: '/scm/purchase/contract/' + id,
    method: 'get'
  })
}

// 新增供应链SCM-采购管理-采购合同
export function addContract(data) {
  return request({
    url: '/scm/purchase/contract',
    method: 'post',
    data: data
  })
}

// 修改供应链SCM-采购管理-采购合同
export function updateContract(data) {
  return request({
    url: '/scm/purchase/contract',
    method: 'put',
    data: data
  })
}

// 删除供应链SCM-采购管理-采购合同
export function delContract(id) {
  return request({
    url: '/scm/purchase/contract/' + id,
    method: 'delete'
  })
}


// 提交供应链SCM-采购管理-采购合同
export function submitContract(data) {
  return request({
    url: '/scm/purchase/contract/submit',
    method: 'put',
    data: data
  })
}


// 审核供应链SCM-采购管理-采购合同
export function approveContract(data) {
  return request({
    url: '/scm/purchase/contract/approve',
    method: 'put',
    data: data
  })
}

