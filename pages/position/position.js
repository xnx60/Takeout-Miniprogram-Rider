// pages/position/position.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nowLocation:app.globalData.nowLocation,
    schoolList:['中山大学','广州大学','华南理工大学']
  },
  expInput(e){
    console.log(e);
    nowLocation=e.detail.value;   
  },
  // 重新定位
  chooseLocate(e){
    app.globalData.nowLocation = e.currentTarget.dataset.location
    this.setData({
      nowLocation: app.globalData.nowLocation
    })
  },
  changeLocation(e){
    console.log(e);
    app.globalData.nowLocation = e.detail.value
    this.setData({
      nowLocation: app.globalData.nowLocation
    })
  }
})