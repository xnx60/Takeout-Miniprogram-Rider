import {
  totast,
  STATUS_CODE_infoSum_SUCCESSE,
  STATUS_CODE_selectAllCampusName_SUCCESSE, loading, hideLoading
}from '../../../service/config'
import {
  selectAllCampus,
  infoSum
}from '../../../service/infoSum'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parcelCampus:app.globalData.disCampus,
    disName:'',
    campusInfo:[], 
    campusNameList:[],
    genderPicker:['男','女'],
    genderIndex:null,
    campusIndex:null,
    flag:null
  },
  onLoad(){
    this._selectAllCampus()
  },

  PickerCampus(e) {
    const parcelCampus=this.data.campusNameList[e.detail.value] 
    const campusIndex=e.detail.value
    this.setData({
      campusIndex,
      parcelCampus
    })
  },

  PickerGender(e) {
    // console.log(e);
    this.setData({
      genderIndex: e.detail.value
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
   const parcelId= wx.getStorageSync('parcelId')
   const flag=this.data.flag
    if(flag){
      wx.showModal({
        content: '是否确认提交信息',
        success: (res) => {
          if (res.confirm) {
            this._infoSum(this.data.parcelCampus, this.data.disName,this.data.genderIndex,parcelId)
          }
        }
      })
    }else{
      totast('名字格式不正确')
    }


  },

  _infoSum(disCampus,disName,driverGender,driverId){ 
    loading('提交中') 
    const driverIdentity = 2   
    infoSum(disCampus,disName,driverGender,driverId,driverIdentity).then(res=>{  
      hideLoading()
      if(res.data.code==STATUS_CODE_infoSum_SUCCESSE){
        wx.setStorageSync('parcelCampus', this.data.parcelCampus)
        app.globalData.parcelCampus=this.data.parcelCampus
        wx.redirectTo({
          url: '/pages/parcelModule/parcelApply/parcelApply',
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