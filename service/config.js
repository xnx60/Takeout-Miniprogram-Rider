/**
 *封装函数
 */

// 显示消息提示框
export function totast(text,time){
  wx.showToast({
    title: text,
    duration:time||1500,
    icon:'none',
  })
}

// 显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
export function loading(text){
  wx.showLoading({
    title: text
  })
}

export function hideLoading(){
    wx.hideLoading()
}


/**
 * 配置网络请求相关的常量
 */
// export const BASE_URL = 'https://longdongwu.free.idcfengye.com'
// export const BASE_URL = 'https://192.168.1.107:8888'
export const BASE_URL = 'https://www.sijie666.com:8080'
// export const BASE_URL = 'https://192.168.1.110:8080'

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
export const STATUS_CODE_getDriverInfo_SUCCESS = 3200 // 获取骑手信息



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

export const API_URL_oncePaySharing = '/wechatpay/oncePaySharing'

/**
 * 快递代拿
 */
// 查询待接单列表
export const API_URL_selectWaitToTakeOrder = '/expressAgent/selectWaitToTakeOrder'
export const STATUS_CODE_selectWaitToTakeOrder_SUCCESSE = 3200
// 分页查询已接单
export const API_URL_selectRiderOrder = '/expressAgent/selectRiderOrder'
export const STATUS_CODE_selectRiderOrder_SUCCESSE = 3200
// 骑手抢单
export const API_URL_getOrder = '/expressAgent/riderReceive'
export const STATUS_CODE_getOrder_SUCCESSE = 3200
// 骑手送达（更新为订单完成）
export const API_URL_completeOrder = '/expressAgent/completeOrder'
export const STATUS_CODE_completeOrder_SUCCESSE = 3200
// 快递支付
export const API_URL_agentPre = '/wechatpay/agentPre'
export const STATUS_CODE_agentPre_SUCCESSE = 3200
// 分账
export const API_URL_agentSharing = '/wechatpay/agentSharing'
export const STATUS_CODE_agentSharing_SUCCESSE = 3200












