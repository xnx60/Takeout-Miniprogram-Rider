/**
 *封装函数
 */

// 显示消息提示框
export function totast(text){
  wx.showToast({
    title: text,
    duration:1500,
    icon:'none'
  })}

// 显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
export function loading(text){
  wx.showLoading({
    title: text
  })
}

export function hideLoading(){
    wx.hideLoading()
}

export const TOKEN='token'


/**
 * 配置网络请求相关的常量
 */
// export const BASE_URL = 'https://192.168.1.109:8888'
export const BASE_URL = 'https://www.lizeqiang.top:8888'

// 凯悦状态码
export const STATUS_CODE_getOrders_SUCCESSE = 1024
export const STATUS_CODE_getOrdersHistory_SUCCESSE = 1024
export const STATUS_CODE_getOrdersDetail_SUCCESSE = 1024
export const STATUS_CODE_updateOrderStatus_SUCCESSE = 1024

// 东龙状态码
export const STATUS_CODE_register_SUCCESSE = 3251
export const STATUS_CODE_login_SUCCESSE = 3252
export const STATUS_CODE_infoSum_ParamNone = 1500
export const STATUS_CODE_infoSum_ParamError = 1500
export const STATUS_CODE_selectAllCampusName_SUCCESSE = 3200
export const STATUS_CODE_updatePhoto_SUCCESSE = 1205



// 凯悦接口
export const API_URL_getOrders = '/order/riderReceive'
export const API_URL_getOrdersDetail = '/order/getRiderOrderByStatus'
export const API_URL_getOrdersHistory = '/order/selectRiderOrderHistory'
export const API_URL_updateOrderStatus = '/order/updateOrderStatus'

// 东龙接口
export const API_URL_login = '/driverinfo/login'
export const API_URL_infoSum = '/driverinfo/insert'
export const API_URL_selectAllCampusName = '/campus/selectAllCampusName'
export const API_URL_updatePhoto = '/driverprove/updatePhoto'
export const API_URL_submitProve = '/driverprove/uploadPicture'








