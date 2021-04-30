import {
  totast,
  loading, 
  hideLoading,
  STATUS_CODE_infoSum_SUCCESSE,
  STATUS_CODE_selectAllCampusName_SUCCESSE, 
} from '../../service/config'
import {
  selectAllCampus,
  infoSum,
  getDriverInfo,
} from '../../service/infoSum'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disCampus: '',
    disName: '',
    driverPhoneNum:199999,
    driverIdentity:'外卖骑手',
    disGender:2,
    campusInfo: [],
    campusNameList: [],
    campusIndex: null
  },

  onLoad() {
    const driverId = wx.getStorageSync('driverId')
    this._getDriverInfo(driverId)
    this._selectAllCampus()
  },

  PickerCampus(e) {
    const disCampus = this.data.campusNameList[e.detail.value]
    const campusIndex = e.detail.value
    this.setData({
      campusIndex,
      disCampus
    })
    // wx.setStorageSync('campus', disCampus)
  },
  isPerserve(){
    wx.showModal({
      content: '是否保存信息',
      success: (res) => {
        if (res.confirm) {
          const driverId = wx.getStorageSync('driverId')
          this._infoSum(this.data.disCampus,this.data.disName,this.data.disGender,driverId)
        } 
      }
    })
  },
  // 获取全部校区
  _selectAllCampus() {
    selectAllCampus().then(res => {
      // console.log(res);
      if (res.data.code == STATUS_CODE_selectAllCampusName_SUCCESSE) {
        const campusInfo = res.data.data
        const campusNameList = this.data.campusNameList
        for (let i in campusInfo) {
          // console.log(campusInfo[i].campusName);         
          campusNameList.push(campusInfo[i].campusName)
        }
        // console.log(res);
        this.setData({
          campusInfo,
          campusNameList
        })
      } else {
        totast('校区查询失败')
      }
    })
  },

  // 查出骑手信息
  _getDriverInfo(driverId) {
    getDriverInfo(driverId).then(res => {     
      const disCampus = res.data.data.campusName
      const disName = res.data.data.driverName
      const disGender = res.data.data.driverGender
      const driverIdentity = res.data.data.driverIdentity
      const driverPhoneNum =res.data.data.driverPhone
      this.setData({
        disCampus,
        disName,
        disGender,
        // driverIdentity,
        driverPhoneNum 
      })
    })
  },

  // 信息修改提交
  _infoSum(disCampus,disName,driverGender,driverId){  
    loading('正在保存')   
    infoSum(disCampus,disName,driverGender,driverId,1).then(res=>{  
      hideLoading()
      if(res.data.code==STATUS_CODE_infoSum_SUCCESSE){
        wx.navigateBack({
          delta: 1
        })
        wx.setStorageSync('driverCampus', this.data.disCampus)
        app.globalData.disCampus=this.data.disCampus
      } else{
        totast(res.data.msg)
      }
    }).catch(reject=>{
      totast('保存失败，请重试')
    })

  },



})