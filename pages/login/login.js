import {
  BASE_URL,
  API_URL_login,
  STATUS_CODE_register_SUCCESSE,
  STATUS_CODE_login_SUCCESSE,
  totast
} from '../../service/config' 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取code
    this.login()
  },
  
// 调用微信登录接口获取code
  login(){
    wx.login({
      success: (res) =>{
        console.log(res.code);
        this.setData({
          code:res.code
        })
      },
      fail:res=>{
        this.login()
      }
    })
  },
  getPhoneNum(e){
    if(e.detail.errMsg == 'getPhoneNumber:ok'){
      wx.request({
        url: BASE_URL+API_URL_login,
        method:'POST',
        header:{
          'content-type':'application/json'
        },
        data:{
          code:this.data.code,
          iv:e.detail.iv,
          encryptedData:e.detail.encryptedData 
        },
        success: res=>{
          console.log(res);
          if(res.data.code == STATUS_CODE_register_SUCCESSE){
            // 骑手不存在，注册成功
            wx.setStorageSync('id',res.data.data.riderId)
            wx.setStorageSync('token',res.data.data.riderToken)
            wx.redirectTo({
              url: '/pages/infoCom/infoCom',
            })
          } else if(res.data.code == STATUS_CODE_login_SUCCESSE){
            // 骑手存在，登录成功
            wx.redirectTo({
              url: '/pages/home/home'
            })
          }        
        },
        fail: reject=>{        
          totast('登录失败，请重新登录')
        }
      })
    }else if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      totast('授权失败，请重新授权')      
    }
    
  }
  
})