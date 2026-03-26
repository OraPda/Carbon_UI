import request from '@/utils/request'

// 查询领料申请-生产计划明细子列表
export function listItem(query) {
  return request({
    url: '/mes/item/list',
    method: 'get',
    params: query
  })
}

// 查询领料申请-生产计划明细子详细
export function getItem(id) {
  return request({
    url: '/mes/item/' + id,
    method: 'get'
  })
}

export function getItemCode(code) {
  return request({
    url: '/mes/item/code/' + code,
    method: 'get'
  })
}

// 新增领料申请-生产计划明细子
export function addItem(data) {
  return request({
    url: '/mes/item',
    method: 'post',
    data: data
  })
}

// 修改领料申请-生产计划明细子
export function updateItem(data) {
  return request({
    url: '/mes/item',
    method: 'put',
    data: data
  })
}

// 删除领料申请-生产计划明细子
export function delItem(id) {
  return request({
    url: '/mes/item/' + id,
    method: 'delete'
  })
}
