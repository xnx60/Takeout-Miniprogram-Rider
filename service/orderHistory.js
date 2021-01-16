import request from './network'
import {
  API_URL_getSaleHistory,
  API_URL_getOrderHistory
}from './config'

export function getSaleHistory(date){
  return request({
    url:API_URL_getSaleHistory,
    data:{
      date,
      riderId:wx.getStorageSync('id')
    }
  })
}

export function getOrderHistory(date,pageNumber){
  return request({
    url:API_URL_getOrderHistory,
    method:'POST',
    data:{
      date,
      pageNumber,
      pageSize:10,
      riderId:wx.getStorageSync('id')
    }
  })
}