//app.js
const TOKEN='token'
App({
  onLaunch: function () {
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

    const token =wx.getStorageSync(TOKEN)   
    const id =wx.getStorageSync('id')  
     
    // if(!token){
    //   console.log('跳转');      
    //   wx.redirectTo({
    //     url: '/pages/login/login',
    //   })
    // }
    console.log('id');
    
    

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
  globalData: {
    disCampus:'广东工业大学生活西区',
    driverId:24,

    userInfo: null,
    nowLocation:'广东工业大学',
    disCampus:'广东工业大学生活西区',
    campus:'广东工业大学生活西区',
    disName:''
  }
})