// pages/examPage/exanPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const status=JSON.parse(options.status)
    this.setData({
      status
    })
  },
  backApplyPage(){
    wx.redirectTo({
      url: '/pages/riderApply/riderApply',
    })
  },
 
})