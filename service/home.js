import request from './network'
import {
  API_URL_getOrders,
  API_URL_getOrdersDetail,
  API_URL_updateOrderStatus ,
  API_URL_oncePaySharing
} from './config'

// 抢单
export function getOrders(id,orderId,orderNumber,riderId,shopId,status,userId){
  return request({
    url:API_URL_getOrders,
    method:'POST',
    data:{
      id,
      orderId,
      orderNumber,
      riderId,
      shopId,
      status,
      userId
    }
  })
}

// 订单详情
export function getOrdersDetail(pageNum,size,status,campus,riderId){
  return request({
    url: API_URL_getOrdersDetail,
    method:'POST',
    data:{
      pageNum,
      size,
      status,
      campus,
      riderId
    }
    // data：data直接传个对象，调用时再具体写对应的参数（不怕参数对应出错，方便查看）
  })
}

export function updateOrderStatus(id,orderId,orderNumber,shopId,status,userId){
  return request({
    url: API_URL_updateOrderStatus,
    method:'POST',
    data:{
      id,
      orderId,
      orderNumber,
      shopId,
      status,
      userId
    }
  })
}

export function getOrdersHistory(date,pageNumber,pageSize,riderId,shopId){
  return request({
    url: API_URL_getOrdersHistory,
    method:'POST',
    data:{
      date,
      pageNumber,
      pageSize,
      riderId,
      shopId
    }
  })
}

export function oncePaySharing(orderNumber,totalAmount,deliveryFee,shopId){
  return request({
    url:API_URL_oncePaySharing,
    method:'POST',
    data:{
      orderNumber,
      totalAmount,
      deliveryFee,
      shopId,
      shopName:'思捷体育'
    }
  },'application/x-www-form-urlencoded')
}