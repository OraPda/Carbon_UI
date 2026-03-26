import request from '@/utils/request'

// 查询计划排产列表
export function listProduction(query) {
  return request({
    url: '/mes/production/list',
    method: 'get',
    params: query
  })
}

// 查询计划排产详细
export function getProduction(id) {
  return request({
    url: '/mes/production/' + id,
    method: 'get'
  })
}

// 新增计划排产
export function addProduction(data) {
  return request({
    url: '/mes/production',
    method: 'post',
    data: data
  })
}

// 修改计划排产
export function updateProduction(data) {
  return request({
    url: '/mes/production',
    method: 'put',
    data: data
  })
}

// 删除计划排产
export function delProduction(id) {
  return request({
    url: '/mes/production/' + id,
    method: 'delete'
  })
}

// 查询BOM
export function getBomList(query) {
  return request({
    url: '/mes/bom/getList',
    method: 'get',
    params: query
  })
}
// 查询生产线
export function getFactoryList(query) {
  return request({
    url: '/mes/factory/getList',
    method: 'get',
    params: query
  })
}
// 查询工艺
export function getTechnologyList(query) {
  return request({
    url: '/mes/technology/getList',
    method: 'get',
    params: query
  })
}

//获取生产计划明细
export function getPlanItemList(query) {
  return request({
    url: '/mes/planItem/list',
    method: 'get',
    params: query
  })
}

