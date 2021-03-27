// pages/parcelModule/parcelPage/parcelPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbarList:['待接单','待送达'],
    tabberIndex:0,
    parcelOrder:{
      orderLists:{
        pageNum:1,
        lists:[
          {

          }
        ]
      },
      deliveryLists:{
        pageNum:1,
        lists:[
          {

          }
        ]
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
    // 获取tabber编号
  handleTabberIndex(e){
    console.log(e.detail);
    
    this.setData({
      tabberIndex:e.detail
    })
    
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