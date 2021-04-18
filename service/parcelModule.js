import request from './network'
import {
  API_URL_selectRiderOrder,
  API_URL_getOrder,
  API_URL_selectWaitToTakeOrder,
  API_URL_completeOrder
} from './config'


// 查询待接单接口
export function selectWaitToTakeOrder(campus,pageNumber,pageSize){
  return request({
    url:  API_URL_selectWaitToTakeOrder,
    method:'POST',
    data:{
      campus,
      pageNumber,
      pageSize
    }
  })
}
// 分页查询已接单接口
export function selectRiderOrder(id,pageNumber,pageSize){
  return request({
    url:  API_URL_selectRiderOrder,
    method:'POST',
    data:{
      id,
      pageNumber,
      pageSize
    }
  })
}

// 更新为订单完成
export function completeOrder(id){
  return request({
    url:  API_URL_completeOrder,
    method:'POST',
    data:{
      id
    }
  },'application/x-www-form-urlencoded')
}

// 抢单接口
export function getOrder(id,riderId){
  return request({
    url:  API_URL_getOrder,
    method:'POST',
    data:{
      id,
      riderId
    }
  },'application/x-www-form-urlencoded')
}