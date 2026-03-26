import request from '@/utils/request'

// 查询产品检验列表

export function listProductInspector(query) {
  return request({
    url: '/mes/productInspector/list',
    method: 'get',
    params: query
  })
}

// 查询产品检验详细

export function getProductInspector(id) {
  return request({
    url: '/mes/productInspector/' + id,
    method: 'get'
  })
}

// 新增产品检验

export function addProductInspector(data) {
  return request({
    url: '/mes/productInspector',
    method: 'post',
    data: data
  })
}

// 修改产品检验

export function updateProductInspector(data) {
  return request({
    url: '/mes/productInspector',
    method: 'put',
    data: data
  })
}

// 删除产品检验

export function delProductInspector(id) {
  return request({
    url: '/mes/productInspector/' + id,
    method: 'delete'
  })
}
