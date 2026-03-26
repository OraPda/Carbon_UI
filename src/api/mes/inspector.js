import request from '@/utils/request'

// 查询来料检验列表

export function listInspector(query) {
  return request({
    url: '/mes/inspector/list',
    method: 'get',
    params: query
  })
}

// 查询来料检验详细

export function getInspector(id) {
  return request({
    url: '/mes/inspector/' + id,
    method: 'get'
  })
}

// 新增来料检验

export function addInspector(data) {
  return request({
    url: '/mes/inspector',
    method: 'post',
    data: data
  })
}

// 修改来料检验

export function updateInspector(data) {
  return request({
    url: '/mes/inspector',
    method: 'put',
    data: data
  })
}

// 删除来料检验

export function delInspector(id) {
  return request({
    url: '/mes/inspector/' + id,
    method: 'delete'
  })
}
