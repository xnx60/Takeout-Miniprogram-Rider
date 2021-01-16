import {
  totast,
  loading,
  hideLoading,
  WEB_SOCKET_URL
} from './service/config'
import bus from './utils/bus'
const TOKEN = 'token'

App({
  onLaunch: function () {
    this.globalData.bus = bus
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // wx.showLoading({
    //   title: '加载中',
    // })
    // wx.hideLoading()
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    })
    // 登录操作

    const token = wx.getStorageSync(TOKEN)
    const id = wx.getStorageSync('id')




    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    // 获取系统信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      },
    })
  },
  onShow() {
    this.wsConnect()
  },
  async wsConnect() {
    if (wx.getStorageSync('id')) {
      await this.wsClose()
      loading('加载中')
      wx.connectSocket({
        url: WEB_SOCKET_URL,
        timeout: 2000,
        header: {
          'content-type': 'application/json'
        },
        success: (res) => {
          this.wsOpen()
          hideLoading()
        },
        fail: (res) => {
          totast('订单实时更新失败,请尝试重新进入', 3000)
        }
      })
    }
  },
  wsMessage() {
    wx.onSocketMessage((res) => {
      console.log('message', res);
      let parseData = {}
      if (res.data !== '服务器连接成功！') {
        parseData = JSON.parse(res.data)
        this.globalData.bus.emit('orderDataChange', parseData)
        totast('你有新订单啦', 2000)
      }
    })
  },
  wsSend() {
    wx.sendSocketMessage({
      data: JSON.stringify({
        rid: wx.getStorageSync('id'),
        identity: 'rider',
        campus: wx.getStorageSync('campus')
      }),
      success: res => {
        console.log('send', res);
        this.wsMessage()
      }
    })
  },
  wsOpen() {
    wx.onSocketOpen((result) => {
      console.log('open', result);
      this.wsSend()
    })
  },
  wsClose() {
    wx.onSocketClose((result) => {
      console.log('close', result);
    })
  },
  globalData: {
    driverId: null,
    userInfo: null,
    disCampus: '',
    disName: '',
  }
})