import request from '@/utils/request'

// 查询制造执行MES-质量管理-防错管理列表
export function listErrorManagement(query) {
  return request({
    url: '/mes/errorManagement/list',
    method: 'get',
    params: query
  })
}

// 查询制造执行MES-质量管理-防错管理详细
export function getErrorManagement(id) {
  return request({
    url: '/mes/errorManagement/' + id,
    method: 'get'
  })
}

// 新增制造执行MES-质量管理-防错管理
export function addErrorManagement(data) {
  return request({
    url: '/mes/errorManagement',
    method: 'post',
    data: data
  })
}

// 修改制造执行MES-质量管理-防错管理
export function updateErrorManagement(data) {
  return request({
    url: '/mes/errorManagement',
    method: 'put',
    data: data
  })
}

// 删除制造执行MES-质量管理-防错管理
export function delErrorManagement(id) {
  return request({
    url: '/mes/errorManagement/' + id,
    method: 'delete'
  })
}
