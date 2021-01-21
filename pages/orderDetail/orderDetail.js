const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:{

    },
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    showBottomDialog:false,
    showShopAddress: false,
    telephoneNumber: 123456789,
    phoneNumber:123456,
    phoneName:null
    
  },

 /*
 **
 电话呼叫
 */
phoneCall(e) {
    // console.log(e);
    const phoneNum=e.currentTarget.dataset.phonenum
    this.setData({
      showBottomDialog: true,
      telephoneNumber:phoneNum
    })
  },
  confirmCall(){
    const phoneNumber=this.data.telephoneNumber
    this.setData({
      telephoneNumber:null,
      phoneNumber
    })
  },
  dialOut(){
    const phoneNumber=this.data.phoneNumber
    wx.makePhoneCall({
      phoneNumber:phoneNumber,
      success: res => {
        this.setData({
          showBottomDialog: false,
        })
      },
    })   
  },
  hiddenBottomDialog() {
    this.setData({
      showBottomDialog: false
    })
  },

  /*
  **店铺地址
  */
  showShopAddress() {
    this.setData({
      showShopAddress: true
    })
  },
  hideShopAddress() {
    this.setData({
      showShopAddress: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    const item=JSON.parse(options.item)
    this.setData({
      item:item
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})