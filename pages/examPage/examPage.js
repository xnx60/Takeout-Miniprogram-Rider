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
    // console.log(options.status);
    console.log('跳转后');
    
    const status=JSON.parse(options.status)
    // const status=options.status
    console.log(status);
    
    this.setData({
      status
    })
  },
  backApplyPage(){
    wx.redirectTo({
      url: '/pages/riderApply/riderApply',
    })
  },

  _infoSum(disCampus,disName,driverGender,driverId){     
    infoSum(disCampus,disName,driverGender,driverId).then(res=>{  
      if(res.data.code==STATUS_CODE_infoSum_SUCCESSE){
        wx.redirectTo({
          url: '/pages/riderApply/riderApply',
        })
      } else if(res.data.code==1500){
        totast(res.data.msg)
      }
    }).catch(reject=>{
      totast('提交失败，请重试')
    })

  },
 
})