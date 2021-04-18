import {
  selectRiderOrder,
  getOrder,
  selectWaitToTakeOrder,
  completeOrder
} from '../../../service/parcelModule'
import {
  TOKEN,
  hideLoading,
  loading,
  totast,
  STATUS_CODE_selectRiderOrder_SUCCESSE,
  STATUS_CODE_getOrder_SUCCESSE,
  STATUS_CODE_selectWaitToTakeOrder_SUCCESSE,
  STATUS_CODE_completeOrder_SUCCESSE
} from '../../../service/config'
import {
  checkLoginStatus
} from '../../../service/login'
import {
  getDriverInfo,
} from '../../service/infoSum'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parcelCampus:'',
    driverId:'',
    tabbarList:['待接单','已接单'],
    tabberIndex:0,
    parcelOrder:{
      orderLists:{
        pageNum:1,
        isHiddenMore:false,
        hasNextPage:null,
        // 加载更多图标
        isHideLoadMore:false,
        lists:[]
      },
      deliveryLists:{
        pageNum:1,
        isHiddenMore:false,
        hasNextPage:null,
        // 加载更多图标
        isHideLoadMore:false,
        lists:[]
      }
    },
    telephoneNum:123442,
    phoneNum:1234342,
    showBottomDialog: false,
    // 检查骑手登录状态
    parcelLoginStatus:2508
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 判断登录注册状态
    const parcelToken = wx.getStorageSync('parcelToken')
    const parcelId = wx.getStorageSync('parcelId')
    if(parcelId && parcelToken){
      this._checkLoginStatus(parcelId)
    }

    const parcelCampus = wx.getStorageSync('parcelCampus')
    this.setData({
      parcelCampus,
      parcelId
    })
    this._selectWaitToTakeOrder()
    this._getRiderOrders()
  },
    // 获取tabber编号
  handleTabberIndex(e){
    this.setData({
      tabberIndex:e.detail
    })
    
  },

  takeOrders(e) {
    // 获取页面订单相关信息
    const itemId = e.currentTarget.dataset.id
    console.log(itemId);
    wx.showModal({
      content: '是否确认接收此订单',
      success: (res) => {
        if (res.confirm) { 
          this._getOrder(itemId)         
        }
      }
    })
  },

  deliveryGoods(e){
    //  获取页面订单id
     const itemInfo = e.currentTarget.dataset.id
     console.log(itemInfo);
     wx.showModal({
       content: '是否确认送达',
       success: (res) => {
         if (res.confirm) {
          this._completeOrder(itemInfo)
         }
       }
     })
  },

  toPerson(){
    const parcelToken = wx.getStorageSync('parcelToken')
    const parcelId = wx.getStorageSync('parcelId')
    if (!parcelToken && !parcelId) {
      wx.navigateTo({
        url: '/pages/parcelModule/parcelLogin/parcelLogin'
      })
    } else if(this.data.driverLoginStatus==2508){
      wx.navigateTo({
        url: '/pages/parcelModule/parcelApply/parcelApply'
      })
    }else if(this.data.driverLoginStatus==2551){
      wx.navigateTo({
        url: '/pages/parcelModule/parcelPerson/parcelPerson'
      })
    }
  },

  // 联系顾客
  callCus(e){ 
    const telephoneNum = e.currentTarget.dataset.phonenum
    this.setData({
      showBottomDialog: true,
      telephoneNum
    })
  },
  confirmCall(){
    // 存放号码
    const phoneNum=this.data.telephoneNum
    this.setData({
      telephoneNum:null,
      phoneNum
    })
  },
  dialOut(){
    const phoneNum=this.data.phoneNum
    wx.makePhoneCall({
      phoneNumber:phoneNum,
      success: res => {
        this.setData({
          showBottomDialog: false,
        })
      },
    }) 
  },
  hiddenBottomDialog() {
    this.setData({
      showBottomDialog: false
    })
  },
  
 /** 
 *接口函数封装
 */
// 获取快递订单接口
 async _selectWaitToTakeOrder(){
  loading('加载中')
  const tabberIndex = this.data.tabberIndex
  const campus = this.data.parcelCampus
  const pageNumber = this.data.parcelOrder.orderLists.pageNum
  const pageSize = 3
  let listGain = []
  const showLists = this.data.parcelOrder.orderLists.lists
  selectWaitToTakeOrder(campus,pageNumber,pageSize).then(res=>{
    hideLoading()
    if(res.data.code === STATUS_CODE_selectWaitToTakeOrder_SUCCESSE){
      // console.log(res.data);
      this.data.parcelOrder.orderLists.hasNextPage = res.data.data.hasNextPage                  
      listGain.push(...res.data.data.list) 
      showLists.push(...listGain)
      const newList=`parcelOrder.orderLists.lists`  
      const isHideLoadMore = `parcelOrder.orderLists.isHideLoadMore` 
      this.setData({
        [newList]: showLists,
        [isHideLoadMore]: false
      }) 
    }
  }).catch(res => {
    totast('系统错误，请稍后重试')
  })
},
// 抢单接口
_getOrder(itemId){
  const id = itemId
  const riderId = wx.getStorageSync('parcelId')
  getOrder(id,riderId).then(res=>{
    if(res.data.code === STATUS_CODE_getOrder_SUCCESSE){
      this._getRiderOrders()
    }
  })
},
// 获取已接单接口
async _getRiderOrders(){
  loading('加载中')
  const id=this.data.parcelId
  const pageNumber=this.data.parcelOrder.deliveryLists.pageNum
  const pageSize=3
  let showLists = []
  // const showLists = this.data.parcelOrder.deliveryLists.lists
  for( let i=1;i<pageNumber+1;i++ ){
    const pageNumber = i
     await selectRiderOrder(id,pageNumber,pageSize).then(res=>{
      if(res.data.code===STATUS_CODE_selectRiderOrder_SUCCESSE){ 
        this.data.parcelOrder.deliveryLists.hasNextPage = res.data.data.hasNextPage    
        // listGain.push(...res.data.data.list)
        showLists.push(...res.data.data.list)
        console.log(showLists);        
      }      
     }).catch(res => {
      totast('系统错误，请稍后重试')
    })
  }
  hideLoading()
  const newList=`parcelOrder.deliveryLists.lists`
  // const isHideLoadMore = `parcelOrder.orderLists.isHideLoadMore` 
  this.setData({
    [newList]: showLists,
    // [isHideLoadMore]: false
  })  
  this.data.parcelOrder.deliveryLists.isHideLoadMore = false
},
// 更新为订单完成
async _completeOrder(itemInfo){
  loading('加载中')
  const id = itemInfo
  completeOrder(id).then(res=>{
    hideLoading()
    if(res.data.code===STATUS_CODE_completeOrder_SUCCESSE){
      console.log('更新为订单完成');
      this._getRiderOrders()
    }
  })
},
  /* 
  检测登录状态
  */
 _checkLoginStatus(parcelId) {
  checkLoginStatus(parcelId).then(res => {
    wx.setStorageSync('parcelStatus', res.data.code)
    this.setData({
      parcelLoginStatus:res.data.code
    })
    // console.log(wx.getStorageSync('driverStatus'),'登录状态');     
    if (res.data.code == 2508) {
      // 骑手还没上传证明材料
      wx.redirectTo({
        url: '/pages/parcelModule/parcelApply/parcelApply',
      })
    } else if (res.data.code == 2550 || res.data.code == 2552 || res.data.code==2553) {
      // 骑手正在审核/审核未通过/封禁
      console.log('跳转前');
      wx.redirectTo({
        url: '/pages/parcelModule/parcelExam/parcelExam?status=' + JSON.stringify(res.data.code)
      })
    }
  })
},



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const tabberIndex = this.data.tabberIndex
    const type = tabberIndex == 0 ? 'orderLists':'deliveryLists'
    const goods = this.data.parcelOrder[type]
    const hasNextPage = goods.hasNextPage
    const isHideLoadMore = `parcelOrder.${type}.isHideLoadMore`
    const isHiddenMore = `parcelOrder.${type}.isHiddenMore`
    this.setData({
      [isHideLoadMore]: true,
      [isHiddenMore]: false
    })
    if(hasNextPage){
      // this.setData({
      //   [isHideLoadMore]:true
      // })
      goods.pageNum++
      // console.log( tabberIndex == 0 );
      tabberIndex == 0? this._selectWaitToTakeOrder():this._getRiderOrders()
      // if( tabberIndex == 0 ){
      //   this._selectWaitToTakeOrder()
      // }else{
      //   this._getRiderOrders()
      // }
    } else {
        this.setData({
          [isHideLoadMore]:false,
          [isHiddenMore]: true
        })
    }

    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  isLoading (e) {
    this.setData({
      isLoad: e.detail.value
    })
  },
})