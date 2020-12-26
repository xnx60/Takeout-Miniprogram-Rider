import {
  totast,
  API_URL_infoSum,
  BASE_URL,
  STATUS_CODE_infoSum_ParamNone,
  STATUS_CODE_infoSum_ParamError,
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
    disName:app.globalData.disName,
    campusInfo:['广东工业大学生活西区','广东工业大学生活东区'],
    campusName:[],
    campusIndex:null
  },
  PickerCampus(e) {
    // this._selectAllCampus()
    const disCampus=this.data.campusInfo[e.detail.value]   
    const campusIndex=e.detail.value
    this.setData({
      campusIndex,
      disCampus
    })
  },
  infoSum(){
    this._infoSum(this.data.disCampus, this.data.disName)
  },
  _infoSum(disCampus,disName){     
    infoSum(disCampus, disName).then(res=>{  
      if(res.data.code==STATUS_CODE_infoSum_ParamNone){
        totast(res.msg)
      } else if(res.data.code==STATUS_CODE_infoSum_ParamError){
        totast()
      } else{
        wx.redirectTo({
          url: '/pages/riderApply/riderApply',
        })
      }

    }).catch(reject=>{
      totast('提交失败，请重试')
    })

  },
  getInputName(e){   
      this.setData({
        disName:e.detail.value
      }) 
  },
  _selectAllCampus(){   
    selectAllCampus().then(res=>{
      console.log(res);
      if(res.data.code==STATUS_CODE_selectAllCampusName_SUCCESSE){
        console.log(res);
        this.setData({
          campusInfo:res.data.data
        })
      } else{
        totast('查询失败')
      }
    })
  }

})