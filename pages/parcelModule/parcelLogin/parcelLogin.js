import {
  BASE_URL,
  API_URL_login,
  STATUS_CODE_login_SUCCESSE,
  totast, loading, hideLoading
} from '../../../service/config'
import {
  checkLoginStatus
} from '../../../service/login'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取code
    this.login()
  },

  // 调用微信登录接口获取code
  login() {
    wx.login({
      success: (res) => {
        console.log(res.code);
        this.setData({
          code: res.code
        })
      },
      fail: res => {
        this.login()
      }
    })
  },
  getPhoneNum(e) {
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      loading('加载中')
      wx.request({
        url: BASE_URL + API_URL_login,
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          code: this.data.code,
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData
        },
        success: res => {
          hideLoading()
          if (res.data.code == STATUS_CODE_login_SUCCESSE) {
            console.log('登录成功');
            wx.setStorageSync('parcelId', res.data.data.driverId)
            wx.setStorageSync('parcelToken', res.data.data.driverToken)
            const parcelId = wx.getStorageSync('parcelId')
            // app.globalData.disCampus = driverId
            this._checkLoginStatus(parcelId)
          } else if (res.data.code == 1500) {
            // 传入参数为空  
            console.log('传入参数为空');
          }
        },
        fail: reject => {
          totast('登录失败，请重新登录')
        }
      })
    } else if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      totast('授权失败，请重新授权')
    }

  },

  _checkLoginStatus(parcelId) {
    checkLoginStatus(parcelId).then(res => {
      console.log(res,'checkLogin');
      if (res.data.code == 2508) {
        // 骑手还没上传证明材料
        wx.redirectTo({
          url: 'pages/parcelModule/parcelInfo/parcelInfo',
        })
      } else if (res.data.code == 2550 || res.data.code == 2552|| res.data.code == 2553) {
        // 骑手正在审核/审核未通过/封禁
        wx.redirectTo({
          url: '/pages/parcelModule/parcelExam/parcelExam?status=' + JSON.stringify(res.data.code)
        })
      } else if (res.data.code == 2551) {
        // 审核通过
        app.onShow()
        wx.redirectTo({
          url: '/pages/parcelModule/parcelPage/parcelPage',
        })
      } 
    })
  }


})