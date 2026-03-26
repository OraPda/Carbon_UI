import request from '@/utils/request'

// 查询供应商审核列表
export function listSupplier(query) {
  return request({
    url: '/mytask/supplier/list',
    method: 'get',
    params: query
  })
}

// 查询供应商审核详细
export function getSupplier(id) {
  return request({
    url: '/mytask/supplier/' + id,
    method: 'get'
  })
}

// 新增供应商审核
export function addSupplier(data) {
  return request({
    url: '/mytask/supplier',
    method: 'post',
    data: data
  })
}

// 修改供应商审核
export function updateSupplier(data) {
  return request({
    url: '/mytask/supplier',
    method: 'put',
    data: data
  })
}

// 删除供应商审核
export function delSupplier(id) {
  return request({
    url: '/mytask/supplier/' + id,
    method: 'delete'
  })
}
