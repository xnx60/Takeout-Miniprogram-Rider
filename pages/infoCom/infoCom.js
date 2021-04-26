import {
  totast,
  STATUS_CODE_infoSum_SUCCESSE,
  STATUS_CODE_selectAllCampusName_SUCCESSE, loading, hideLoading
}from '../../service/config'
import {
  selectAllCampus,
  infoSum
}from '../../service/infoSum'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disCampus:app.globalData.disCampus,
    disName:'',
    campusInfo:[], 
    campusNameList:[],
    genderPicker:['男','女'],
    genderIndex:null,
    // 是否选择身份
    isIdentity:false,
    driverIdentityName:'快递代拿',
    driverIdentityPicker:['外卖骑手','快递代拿'],
    driverIdentityIndex:null,
    campusIndex:null,
    flag:null
  },
  onLoad(){
    this._selectAllCampus()
    // entry中是否点击了身份选择按钮
    const driverIdentity = wx.getStorageSync('driverIdentity')
    if(driverIdentity){
      const driverIdentityName = driverIdentity == 1?'外卖骑手':'快递代拿'
      const driverIdentityIndex = driverIdentity == 1? 0:1
      this.setData({
        isIdentity:true,
        driverIdentityName,
        driverIdentityIndex
      })
    }
  },
  toHome(){
    console.log('tohome');  
  },
  PickerCampus(e) {
    const disCampus=this.data.campusNameList[e.detail.value] 
    const campusIndex=e.detail.value
    this.setData({
      campusIndex,
      disCampus
    })
  },

  PickerGender(e) {
    // console.log(e);
    this.setData({
      genderIndex: e.detail.value
    })
  },
  PickerDriverIdentity(e) {
    // console.log(e);
    this.setData({
      driverIdentityIndex: e.detail.value
    })
  },

  getInputName(e){ 
    const reg= /^(?:[\u4e00-\u9fa5·]{2,6})$/
    const disName=e.detail.value
    const oldFlag=this.data.flag
    const flag=reg.test(disName)
    // console.log(flag); 
    this.setData({
      flag
    })   
    if(!reg.test(disName) || !disName.trim()){
      totast('格式不正确')
    }
    this.setData({
      disName      
    }) 
    // console.log(this.data.disName);   
    app.globalData.disName=disName
},

  infoSum(){
   const driverId= wx.getStorageSync('driverId')
   const flag=this.data.flag
    if(flag){
      wx.showModal({
        content: '是否确认提交信息',
        success: (res) => {
          if (res.confirm) {
            this._infoSum(this.data.disCampus, this.data.disName,this.data.genderIndex,driverId,this.data.driverIdentityIndex)
          }
        }
      })
    }else{
      totast('名字格式不正确')
    }


  },

  _infoSum(disCampus,disName,driverGender,driverId,driverIdentityIndex){ 
    loading('提交中')  
    const driverIdentity = driverIdentityIndex == 0? 1:2
    infoSum(disCampus,disName,driverGender,driverId,driverIdentity).then(res=>{  
      hideLoading()
      if(res.data.code==STATUS_CODE_infoSum_SUCCESSE){
        wx.setStorageSync('driverCampus', this.data.disCampus)
        wx.setStorageSync('driverIdentity', driverIdentity)
        app.globalData.disCampus=this.data.disCampus
        wx.redirectTo({
          url: '/pages/riderApply/riderApply',
        })
      } else if(res.data.code==1500){
        totast('请把信息补充完整')
      }
    }).catch(reject=>{
      totast('提交失败，请重试')
    })

  },

  _selectAllCampus(){   
    selectAllCampus().then(res=>{
      // console.log(res);
      if(res.data.code==STATUS_CODE_selectAllCampusName_SUCCESSE){
        const campusInfo=res.data.data
        const campusNameList=this.data.campusNameList
        for(let i in campusInfo){
          // console.log(campusInfo[i].campusName);         
          campusNameList.push(campusInfo[i].campusName)
        }
        // console.log(res);
        this.setData({
          campusInfo,
          campusNameList
        })
        app.globalData.campusNameList=campusNameList
      } else{
        totast('校区查询失败')
      }
    })
  }

})