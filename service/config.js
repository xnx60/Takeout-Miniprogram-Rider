/**
 *封装函数
 */

// 显示消息提示框
export function totast(text,time){
  wx.showToast({
    title: text,
    duration:time||1500,
    icon:'none',
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
// export const BASE_URL = 'https://192.168.1.107:8888'
export const BASE_URL = 'https://www.lizeqiang.top:8888'

export const WS_BASE_URL = 'wss://www.lizeqiang.top:58080'
export const WEB_SOCKET_URL = `${WS_BASE_URL}/ws`


// 凯悦状态码
export const STATUS_CODE_getOrders_SUCCESSE = 1024
export const STATUS_CODE_getOrdersHistory_SUCCESSE = 1024
export const STATUS_CODE_getOrdersDetail_SUCCESSE = 1024
export const STATUS_CODE_updateOrderStatus_SUCCESSE = 1024

// 东龙状态码
export const STATUS_CODE_login_SUCCESSE = 1209
export const STATUS_CODE_checkLoginStatus_SUCCESSE = 1200

export const STATUS_CODE_infoSum_SUCCESSE = 3200
export const STATUS_CODE_selectAllCampusName_SUCCESSE = 3200
export const STATUS_CODE_updatePhoto_SUCCESSE = 1205 //上传图片
export const STATUS_CODE_submitProve_SUCCESSE = 1204 //提交审核材料

export const STATUS_CODE_getSaleHistory_SUCCESS = 3207
export const STATUS_CODE_getOrderHistory_SUCCESS = 3203



// 凯悦接口
export const API_URL_getOrders = '/order/riderReceive'
export const API_URL_getOrdersDetail = '/order/getRiderOrderByStatus'
export const API_URL_getOrdersHistory = '/order/selectRiderOrderHistory'
export const API_URL_updateOrderStatus = '/order/updateOrderStatus'

// 东龙接口
export const API_URL_login = '/driverinfo/login'
export const API_URL_checkLoginStatus = '/driverinfo'

export const API_URL_infoSum = '/driverinfo/update'
export const API_URL_selectAllCampusName = '/campus/selectAllCampusName'
export const API_URL_updatePhoto = '/driverprove/updatePhoto'
export const API_URL_submitProve = '/driverprove/uploadPicture'
export const API_URL_selectOrderHistory = '/order/selectRiderOrderHistory'
export const API_URL_getSaleHistory = '/data/getRiderSaleHistory'
export const API_URL_getOrderHistory = '/order/selectRiderOrderHistory'
export const API_URL_getDriverInfo = '/driverinfo/selectById'









