import {
  BASE_URL,
  totast,
  loading,
  hideLoading,
} from './config'

export default function (options, headerContentType) {
  const driverToken = wx.getStorageSync('driverToken')
  // const parcelToken = wx.getStorageSync('parcelToken')
  // const driverLoginStatus = wx.getStorageSync('driverStatus')
  if (driverToken) {
    return new Promise((reslove, reject) => {
      wx.request({
        url: BASE_URL + options.url,
        data: options.data || {},
        header: {
          'content-type': headerContentType || 'application/json',
          'driverToken': driverToken || parcelToken
        },
        method: options.method || 'get',
        success: function(res) {
          if(res.data.code === 400) {
            totast('身份验证失败，请重新登录！')
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }, 1000)
          } else {
            reslove(res)
          }
        },
        fail: reject
      })
    })
  }


}