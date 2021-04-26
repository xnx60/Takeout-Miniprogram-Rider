import {
  selectRiderOrder,
  getOrder,
  selectWaitToTakeOrder,
  completeOrder,
  agentPre,
  agentSharing
} from '../../../service/parcelModule'
import {
  TOKEN,
  hideLoading,
  loading,
  totast,
  STATUS_CODE_selectRiderOrder_SUCCESSE,
  STATUS_CODE_getOrder_SUCCESSE,
  STATUS_CODE_selectWaitToTakeOrder_SUCCESSE,
  STATUS_CODE_getDriverInfo_SUCCESS,
  STATUS_CODE_completeOrder_SUCCESSE,
  STATUS_CODE_agentSharing_SUCCESSE
} from '../../../service/config'
import {
  checkLoginStatus
} from '../../../service/login'
import {
  getDriverInfo,
} from '../../../service/infoSum'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parcelCampus:'',
    parcelId:'',
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
  async onShow() {
    // 判断登录注册状态
    const driverId = wx.getStorageSync('driverId')
    const driverToken = wx.getStorageSync('driverToken')
    await this._checkLoginStatus(driverId)
    const driverStatus = wx.getStorageSync('driverStatus')
    if( driverStatus == 2551 && driverToken && driverId ){
      const driverCampus = wx.getStorageSync('driverCampus')
      this.setData({
        parcelCampus:driverCampus,
        parcelId:driverId
      })
      await this._selectWaitToTakeOrder()
      await this._getRiderOrders()
    }
  },
    // 获取tabber编号
  handleTabberIndex(e){
    this.setData({
      tabberIndex:e.detail
    })
    
  },

  // 抢单
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

  // 确认送达
  deliveryGoods(e){
    //  获取页面订单id
     const itemId = e.currentTarget.dataset.itemInfo.id
     const orderNumber = e.currentTarget.dataset.itemInfo.orderNumber
     const riderId = e.currentTarget.dataset.itemInfo.riderId
     const riderProfit = e.currentTarget.dataset.itemInfo.riderProfit
     const userId = e.currentTarget.dataset.itemInfo.userId
     console.log(itemInfo);
     wx.showModal({
       content: '是否确认送达',
       success: (res) => {
         if (res.confirm) {
          this._completeOrder(itemId,()=>{
            agentSharing(id,orderNumber,riderId,riderProfit,userId).then(res=>{
              if(res.data.code != STATUS_CODE_agentSharing_SUCCESSE){
                totast('分账有误',2000)
              }
            })
          })
         }
       }
     })
  },

  // 进入个人页面
  async toPerson(){
    console.log('进入个人页面'); 
    const driverToken = wx.getStorageSync('driverToken')
    const driverId = wx.getStorageSync('driverId')
    if (!driverToken && !driverId) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    } else{
      await this._getDriverInfo(driverId)
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
 *接口函数封装
 */
// 获取快递订单接口
 async _selectWaitToTakeOrder(){
  loading('加载中')
  const tabberIndex = this.data.tabberIndex
  const campus = this.data.parcelCampus || null
  const pageNum = this.data.parcelOrder.orderLists.pageNum
  const pageSize = 3
  let showLists = []
  // const showLists = this.data.parcelOrder.orderLists.lists
  for( let i = 1;i < pageNum + 1; i++){
    const pageNumber = i
    selectWaitToTakeOrder(campus,pageNumber,pageSize).then(res=>{
      hideLoading()
      if(res.data.code === STATUS_CODE_selectWaitToTakeOrder_SUCCESSE){
        this.data.parcelOrder.orderLists.hasNextPage = res.data.data.hasNextPage                  
        // listGain.push(...res.data.data.list) 
        showLists.push(...res.data.data.list)
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
  }
 
},
// 抢单接口
_getOrder(itemId){
  const id = itemId
  const riderId = wx.getStorageSync('parcelId')
  getOrder(id,riderId).then(res=>{
    if(res.data.code === STATUS_CODE_getOrder_SUCCESSE){
      this._getRiderOrders()
      this._selectWaitToTakeOrder()
      totast('抢单成功')
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
async _completeOrder(itemInfo,callback){
  loading('加载中')
  const id = itemInfo
  completeOrder(id).then(res=>{
    hideLoading()
    if(res.data.code===STATUS_CODE_completeOrder_SUCCESSE){
      this._getRiderOrders()
    }
  }).then(()=>{
    callback(id,orderNumber,riderId,riderProfit,userId)
  })
},
  /* 
  检测登录状态
  */
 _checkLoginStatus(driverId) {
  checkLoginStatus(driverId).then(res => {
    wx.setStorageSync('driverStatus', res.data.code)
  })
},

 /* 
获取骑手信息（包括审核状态）
*/
_getDriverInfo(driverId) {
  getDriverInfo(driverId).then(res => {
  console.log(res);
  if(res.data.code = STATUS_CODE_getDriverInfo_SUCCESS){
    wx.setStorageSync('driverCampus', res.data.data.campusName)
    wx.setStorageSync('driverStatus', res.data.data.driverStatus)
    wx.setStorageSync('driverIdentity', res.data.data.driverIdentity)
    wx.setStorageSync('driverId', res.data.data.driverId)
    const driverCampus = res.data.data.campusName
    const driverName = res.data.data.driverName
    const driverIdentity = res.data.data.driverIdentity
    const driverStatus = res.data.data.driverStatus
    if(driverStatus === 2550 || driverStatus === 2552 || driverStatus === 2553){
      wx.navigateTo({
        url: '/pages/examPage/examPage?status=' + JSON.stringify(driverStatus)
      })
    }else if(driverStatus === 2554){
      wx.navigateTo({
        url: '/pages/infoCom/infoCom',
      });
    }else if(driverStatus === 2508){
      wx.navigateTo({
        url: '/pages/riderApply/riderApply',
      });
    }else if(driverStatus === 2551){
      wx.navigateTo({
        url: '/pages/parcelModule/parcelPerson/parcelPerson',
      });
    }
    // switch(driverStatus) {
    //   case 2554:
    //     wx.navigateTo({
    //       url: '/pages/infoCom/infoCom',
    //     });
    //     break;
    //   case 2508:
    //     wx.navigateTo({
    //       url: '/pages/riderApply/riderApply',
    //     });
    //     break;
    //   case 2550 || 2552 || 2553:
    //     wx.navigateTo({
    //       url: '/pages/examPage/examPage?status=' + JSON.stringify(driverStatus)
    //     })
    //     break;
    //   case 2551:
    //     wx.navigateTo({
    //       url: '/pages/parcelModule/parcelPerson/parcelPerson',
    //     });
    //   default:
    //     break;  
    // }
  }
})
},
/**
 * 分账 
 * */
_agentSharing(){
  agentSharing(id,orderNumber,riderId,riderProfit,userId).then(res=>{
    if(res.data.code === STATUS_CODE_agentSharing_SUCCESSE){

    }
  }).catch(res => {
    totast('分账出错')
  })
}
  // isLoading (e) {
  //   this.setData({
  //     isLoad: e.detail.value
  //   })
  // },
})