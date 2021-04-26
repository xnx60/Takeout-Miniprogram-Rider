import {
  hideLoading,
  loading, 
  totast,
  STATUS_CODE_getDriverInfo_SUCCESS
} from '../../service/config'
import {
  checkLoginStatus
} from '../../service/login'
import {
  getDriverInfo
} from '../../service/infoSum'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    driverIdentity: 1
  },
  async onLoad(){
    const driverId = wx.getStorageSync('driverId')
    const driverToken = wx.getStorageSync('driverToken')
    const driverIdentity = wx.getStorageSync('driverIdentity')
    if(!driverToken && !driverId){
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }else {
      totast('请选择身份')
      await this._getDriverInfo(driverId)
      await this._checkLoginStatus(driverId)
      const driverStatus = wx.getStorageSync('driverStatus')
      console.log(driverIdentity);
      if(driverStatus === 2551  && driverIdentity === 1){
        wx.navigateTo({
          url: '/pages/home/home',
        }) 
        console.log('跳转到外卖骑手页面'); 
      }else if(driverStatus === 2551 &&  driverIdentity === 2){
        wx.navigateTo({
          url: '/pages/parcelModule/parcelPage/parcelPage',
        })
        console.log('跳转到快递代拿页面');
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onShow(){
  },
  async toTakeAway(){
    //判断登录注册状态
    // const driverToken = wx.getStorageSync('driverToken')
    // const driverId = wx.getStorageSync('driverId')
    // if (driverId && driverToken) {
    //  await this._getDriverInfo(driverId)
    //  const driverStatus = wx.getStorageSync('driverStatus')
    //  const driverIdentity = wx.getStorageSync('driverIdentity')
    //  if( driverStatus === 2551 ){
    //   wx.navigateTo({
    //     url: '/pages/home/home',
    //   })
    //  }
    // } else {
    //   wx.navigateTo({
    //     url: '/pages/home/home',
    //   })
    // }
    wx.setStorageSync('driverIdentity', 1)
    wx.navigateTo({
      url: '/pages/home/home',
    })
  },
  async toParcel(){
    //判断登录注册状态
    // const driverToken = wx.getStorageSync('driverToken')
    // const driverId = wx.getStorageSync('driverId')
    // if (driverId && driverToken) {
    //  await this._getDriverInfo(driverId)
    //  const driverStatus = wx.getStorageSync('driverStatus')
    //  const driverIdentity = wx.getStorageSync('driverIdentity')
    //  if( driverStatus== 2551 ){
    //   wx.navigateTo({
    //     url: '/pages/parcelModule/parcelPage/parcelPage',
    //   })
    //  }
    // }else {
    //   wx.navigateTo({
    //     url: '/pages/parcelModule/parcelPage/parcelPage',
    //   })
    // }
    wx.setStorageSync('driverIdentity', 2)
    wx.navigateTo({
      url: '/pages/parcelModule/parcelPage/parcelPage',
    })
  },
    /* 
  检测登录状态
  */
 _checkLoginStatus(driverId) {
  checkLoginStatus(driverId).then(res => {
    wx.setStorageSync('driverStatus', res.data.code)
  })
},
  /* 
  获取骑手信息（包括审核状态）
  */
 _getDriverInfo(driverId) {
  getDriverInfo(driverId).then(res => {
    console.log(res);
    if(res.data.code = STATUS_CODE_getDriverInfo_SUCCESS){
      wx.setStorageSync('driverCampus', res.data.data.campusName)
      wx.setStorageSync('driverStatus', res.data.data.driverStatus)
      wx.setStorageSync('driverIdentity', res.data.data.driverIdentity)
      const driverCampus = res.data.data.campusName
      const driverName = res.data.data.driverName
      const driverIdentity = res.data.data.driverIdentity
      const driverStatus = res.data.data.driverStatus
      console.log(driverStatus,'22222');
      // console.log(typeOf(driverStatus));
        if(driverStatus === 2550 || driverStatus === 2552 || driverStatus === 2553){
          wx.navigateTo({
            url: '/pages/examPage/examPage?status=' + JSON.stringify(driverStatus)
          })
          console.log('跳转到审核页面',driverStatus);
        }else if(driverStatus === 2554){
          wx.navigateTo({
            url: '/pages/infoCom/infoCom',
          });
        }else if(driverStatus === 2508){
          wx.navigateTo({
            url: '/pages/riderApply/riderApply',
          });
        }
      // switch(driverStatus) {
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
      //       url: '/pages/examPage/examPage?status=' + JSON.stringify(driverStatus)
      //     })
      //     break;
      //   case 2551:
      //     break;
      //   default:
      //     break;  
      // }
    }
  })
},
})