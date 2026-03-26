import request from '@/utils/request'

// 查询物料分类列表
export function listClassify(query) {
  return request({
    url: '/wms/classify/list',
    method: 'get',
    params: query
  })
}

// 查询物料分类详细
export function getClassify(id) {
  return request({
    url: '/wms/classify/' + id,
    method: 'get'
  })
}

// 新增物料分类
export function addClassify(data) {
  return request({
    url: '/wms/classify',
    method: 'post',
    data: data
  })
}

// 修改物料分类
export function updateClassify(data) {
  return request({
    url: '/wms/classify',
    method: 'put',
    data: data
  })
}

// 删除物料分类
export function delClassify(id) {
  return request({
    url: '/wms/classify/' + id,
    method: 'delete'
  })
}
