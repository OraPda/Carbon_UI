import request from '@/utils/request'


// 查询生产能耗日报表
export function productPowerReportByDay(query) {
  return request({
    url: '/carbonReport/productPowerDetails/day',
    method: 'get',
    params: query
  })
}

// 查询生产能耗月度报表
export function productPowerReportByMonth(query) {
  return request({
    url: '/carbonReport/productPowerDetails/month',
    method: 'get',
    params: query
  })
}

// 查询生产能耗年度列表
export function productPowerReportByYear(query) {
  return request({
    url: '/carbonReport/productPowerDetails/year',
    method: 'get',
    params: query
  })
}

// 查询设备能耗列表
export function listDevicePowerReport(query) {
  return request({
    url: '/carbonReport/devicePowerDetails/list',
    method: 'get',
    params: query
  })
}

// 日能耗分析
export function listDevicePowerReportByDay(query) {
  return request({
    url: '/carbonReport/devicePowerDetails/day',
    method: 'get',
    params: query
  })
}

// 小时能耗分析
export function listDevicePowerReportByHour(query) {
  return request({
    url: '/carbonReport/devicePowerDetails/hour',
    method: 'get',
    params: query
  })
}

// 查询产品能耗
export function productPowerReportOverall(query) {
  return request({
    url: '/carbonReport/productPowerDetails/list',
    method: 'get',
    params: query
  })
}

// 查询综合能耗
export function getEmissionOverall(query) {
  return request({
    url: '/carbonReport/emissionChart/overall',
    method: 'get',
    params: query
  })
}


// 查询今年的能耗占比
export function getEmissionPercent(query) {
  return request({
    url: '/carbonReport/emissionChart/percent',
    method: 'get',
    params: query
  })
}

