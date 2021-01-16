import {
  totast,
  STATUS_CODE_infoSum_SUCCESSE,
  STATUS_CODE_selectAllCampusName_SUCCESSE
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
    disGender:2,
    campusInfo: [],
    campusNameList: [],
    campusIndex: null
  },

  onLoad() {
    const id = wx.getStorageSync('id')

    this._getDriverInfo(id)
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
          const id = wx.getStorageSync('id')
          this._infoSum(this.data.disCampus,this.data.disName,this.data.disGender,id)
        } else{
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },
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

  _getDriverInfo(driverId) {
    getDriverInfo(driverId).then(res => {     
      const disCampus = res.data.data.disCampus
      const disName = res.data.data.driverName
      const disGender=res.data.data.driverGender
      this.setData({
        disCampus,
        disName,
        disGender
      })
    })
  },

  _infoSum(disCampus,disName,driverGender,driverId){     
    infoSum(disCampus,disName,driverGender,driverId).then(res=>{  
      if(res.data.code==STATUS_CODE_infoSum_SUCCESSE){
        wx.navigateBack({
          delta: 1
        })
      } else{
        totast(res.data.msg)
      }
    }).catch(reject=>{
      totast('保存失败，请重试')
    })

  },



})