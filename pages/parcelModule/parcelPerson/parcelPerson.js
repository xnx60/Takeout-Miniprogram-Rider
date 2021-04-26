import {
  totast,
  loading, 
  hideLoading,
  STATUS_CODE_infoSum_SUCCESSE,
  STATUS_CODE_selectAllCampusName_SUCCESSE, 
} from '../../../service/config'
import {
  selectAllCampus,
  infoSum,
  getDriverInfo,
} from '../../../service/infoSum'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parcelCampus: '',
    disName: '',
    driverIdentity:'快递代拿',
    driverPhoneNum:1111111,
    disGender:2,
    campusInfo: [],
    campusNameList: [],
    campusIndex: null
  },

  onLoad() {
    const parcelId = wx.getStorageSync('driverId')
    this._getDriverInfo(parcelId)
    this._selectAllCampus()
  },
  toParcelPage(){
    console.log('返回主页面');
    
    wx.navigateTo({
      url: '/pages/parcelModule/parcelPage/parcelPage',
    })
  },
  PickerCampus(e) {
    const parcelCampus = this.data.campusNameList[e.detail.value]
    const campusIndex = e.detail.value
    this.setData({
      campusIndex,
      parcelCampus
    })
    // wx.setStorageSync('campus', disCampus)
  },
  isPerserve(){
    wx.showModal({
      content: '是否保存信息',
      success: (res) => {
        if (res.confirm) {
          const parcelId = wx.getStorageSync('driverId')
          this._infoSum(this.data.parcelCampus,this.data.disName,this.data.disGender,parcelId)
        } 
      }
    })
  },
  // 获取全部校区
  _selectAllCampus() {
    selectAllCampus().then(res => {
      console.log(res);
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
        console.log(campusNameList);
        
      } else {
        totast('校区查询失败')
      }
    })
  },

  // 查出骑手信息
  _getDriverInfo(parcelId) {
    const driverId = parcelId
    getDriverInfo(driverId).then(res => { 
      console.log(res);   
      const parcelCampus = res.data.data.campusName
      const disName = res.data.data.driverName
      const disGender = res.data.data.driverGender
      const driverPhoneNum = res.data.data.driverPhone
      const driverIdentity = res.data.data.driverIdentity
      wx.setStorageSync('driverId', res.data.data.driverId)
      this.setData({
        parcelCampus,
        disName,
        disGender,
        driverPhoneNum
      })
    })
  },

  // 信息修改提交
  _infoSum(parcelCampus,disName,driverGender, parcelId){  
    loading('正在保存')   
    const disCampus = parcelCampus
    const driverId = parcelId
    infoSum(disCampus,disName,driverGender,driverId,2).then(res=>{  
      hideLoading()
      if(res.data.code==STATUS_CODE_infoSum_SUCCESSE){
        wx.navigateTo({
          url: '/pages/parcelModule/parcelPage/parcelPage',
        })
        wx.setStorageSync('driverCampus', this.data.parcelCampus)
        // app.globalData.disCampus=this.data.disCampus
      } else{
        totast(res.data.msg)
      }
    }).catch(reject=>{
      totast('保存失败，请重试')
    })

  },



})