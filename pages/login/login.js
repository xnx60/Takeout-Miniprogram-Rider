import {
  BASE_URL,
  API_URL_login,
  STATUS_CODE_login_SUCCESSE,
  totast, loading, hideLoading
} from '../../service/config'
import {
  checkLoginStatus
} from '../../service/login'
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
          'content-type': 'application/json',
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
            wx.setStorageSync('driverId', res.data.data.driverId)
            wx.setStorageSync('driverToken', res.data.data.driverToken)
            if(res.data.data.driverInfo === null){
              // 第一次登录
              wx.navigateTo({
                url: '/pages/entry/entry',
              })
            }else{
              const driverStatus = res.data.data.driverInfo.driverStatus
              const driverIdentity = res.data.data.driverInfo.driverIdentity
              wx.setStorageSync('driverStatus', driverStatus)
              if(driverStatus === 2550 || driverStatus === 2552 || driverStatus === 2553){
                wx.navigateTo({
                  url: '/pages/examPage/examPage?status=' + JSON.stringify(driverStatus)
                })
                console.log(driverStatus);
                
              }else if(driverStatus === 2554){
                wx.navigateTo({
                  url: '/pages/infoCom/infoCom',
                });
              }else if(driverStatus === 2508){
                wx.navigateTo({
                  url: '/pages/riderApply/riderApply',
                });
              }else if (driverStatus === 2551){
                if(driverIdentity === 1){
                  wx.navigateTo({
                    url: '/pages/home/home',
                  })
                }else {
                  wx.navigateTo({
                    url: '/pages/parcelModule/parcelPage/parcelPage',
                  })
                }
              }
              // switch(driverStatus){
              //   case 2554:
              //     wx.navigateTo({
              //       url: '/pages/infoCom/infoCom',
              //     });
              //     break;
              //   case 2508:
              //     wx.navigateTo({
              //       url: '/pages/riderApply/riderApply',
              //     });
              //     break;
              //   case 2550 || 2552 || 2553:
              //     wx.navigateTo({
              //       url: '/pages/examPage/examPage?status=' + JSON.stringify(res.data.code)
              //     })
              //     break;
              //   case 2551:
              //     if(driverIdentity == 1){
              //       wx.navigateTo({
              //         url: '/pages/home/home',
              //       })
              //     }else {
              //       wx.navigateTo({
              //         url: '/pages/parcelModule/parcelPage/parcelPage',
              //       })
              //     }
              //     break;
              //   default:
              //     break;
              // }
            }
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

  }
})