import request from '@/utils/request'

// 查询工艺建模列表
export function listTechnology(query) {
  return request({
    url: '/mes/technology/list',
    method: 'get',
    params: query
  })
}
// 查询产品列表
export function listProduct(query) {
  return request({
    url: '/mes/technology/product/list',
    method: 'get',
    params: query
  })
}

// 查询工艺建模详细
export function getTechnology(id) {
  return request({
    url: '/mes/technology/' + id,
    method: 'get'
  })
}

// 新增工艺建模
export function addTechnology(data) {
  return request({
    url: '/mes/technology',
    method: 'post',
    data: data
  })
}

// 修改工艺建模
export function updateTechnology(data) {
  return request({
    url: '/mes/technology',
    method: 'put',
    data: data
  })
}

// 删除工艺建模
export function delTechnology(id) {
  return request({
    url: '/mes/technology/' + id,
    method: 'delete'
  })
}
