import {
  totast,
  API_URL_infoSum,
  BASE_URL,
  STATUS_CODE_infoSum_SUCCESSE,
  STATUS_CODE_selectAllCampusName_SUCCESSE
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
    campusIndex:null
  },
  onLoad(){
    this._selectAllCampus()
  },

  PickerCampus(e) {
    const disCampus=this.data.campusNameList[e.detail.value] 
    const campusIndex=e.detail.value
    this.setData({
      campusIndex,
      disCampus
    })
    wx.setStorageSync('campus', disCampus)
    app.globalData.disCampus=disCampus
  },

  PickerGender(e) {
    // console.log(e);
    this.setData({
      genderIndex: e.detail.value
    })
  },

  getInputName(e){   
    this.setData({
      disName:e.detail.value
    }) 
},

  infoSum(){
   const driverId= wx.getStorageSync('id')
    this._infoSum(this.data.disCampus, this.data.disName,this.data.genderIndex,driverId)
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
      } else{
        totast('校区查询失败')
      }
    })
  }

})