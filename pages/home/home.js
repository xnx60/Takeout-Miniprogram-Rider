import {
  getOrders,
  getOrdersDetail,
  updateOrderStatus,
  oncePaySharing
} from '../../service/home'
import {
  TOKEN,
  hideLoading,
  loading, totast
} from '../../service/config'
import {
  checkLoginStatus
} from '../../service/login'
import {
  getDriverInfo,
} from '../../service/infoSum'

const app = getApp();
let bus = app.globalData.bus
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbarList:[
      '待接单','待取货','待送达'
    ],
    disCampus: '',
    telephoneNumber: 1234567,
    phoneNumber:1234555,
    orders: {
      orderLists: {
        pageNum: 1,
        isHasNextPage:null,
        lists: [
          /* {
          id: 29,
          orderId: 40,
          riderId: 1,
          shopId: 1,
          userId: 1,
          status: 1,
          businessPhone: '1361895937141222',
          data: '2020-10-28 05:14:15',
          completeTime: '2020-10-28 05:14:00',
          deliveryAddress: '广东工业大学1111111111111111',
          deliveryFee: '5元',
          orderNumber: '1',
          remarks: '备注备注备注备注备注备注备注备注',
          shopAddress: '美团店铺地址地址地址地址1',
          shopName: '美团店铺',
          shopPicture: '',
          totalAmount: '546.54',
          totalQuantity: 5,
          userName: 'CAT111工作室',
          userPhone: '18236978456'
        } */
        ]
      },
      goodsLists: {
        pageNum: 1,
        isHasNextPage:null,
        lists: [
          /* {
          businessPhone: '18856237412',
          data: '2020-10-28 05:14:15',
          completeTime: '',
          deliveryAddress: '',
          deliveryFee: '',
          orderNumber: '11',
          remarks: '',
          status: 2,
          shopAddress: '美团店铺地址地址地址地址2',
          shopName: '美团店铺',
          shopPicture: '',
          totalAmount: '546.54',
          totalQuantity: 5,
          userName: 'CAT222工作室',
          userPhone: '18236978456'
        } */
        ]
      },
      deliveryLists: {
        pageNum: 1,
        isHasNextPage:null,
        lists: [
          /* {
          businessPhone: '18856237412',
          data: '2020-10-28 05:14:15',
          completeTime: '',
          deliveryAddress: '',
          deliveryFee: '',
          orderNumber: '',
          remarks: '',
          shopAddress: '',
          shopName: '',
          shopPicture: '',
          totalAmount: '546.54',
          totalQuantity: 5,
          userName: 'CAT333工作室',
          userPhone: '18236978456'
        } */
        ]
      }
    },
    index: 0,
    isShow: false,
    showBottomDialog: false,
    isHiddenMore:false,
    isHideLoadMore:false,
    // 检查骑手登录状态
    driverLoginStatus:2508
  },
  async onShow() {
    //判断登录注册状态
    const token = wx.getStorageSync('token')
    const id = wx.getStorageSync('id')
    if (token && id) {
      this._checkLoginStatus(id)
    }
    // 获取骑手信息(校区)
    const driverId = wx.getStorageSync('id')
    const disCampus = wx.getStorageSync('campus')
    this.setData({
      disCampus
    })
    if(!disCampus){
      console.log('缓存中校区为空，调用信息接口');    
      await this._getDriverInfo(driverId)
    }

    await this._getOrdersDetail(1)
    await this._getOrdersDetail(2)
    await this._getOrdersDetail(3)

    bus.on('orderDataChange', (parseData) => {
      console.log(parseData, 'bus.on--------1')
      const newOrders = parseData.data
      const orderLists = this.data.orders.orderLists.lists
      orderLists.unshift(newOrders)
      const newOrderList = `orders.orderLists.lists`
      this.setData({
        [newOrderList]: orderLists
      })
    })
  },
  onHide() {
    bus.remove('orderDataChange')
  },
  updateList() {
    const token = wx.getStorageSync(TOKEN)
    const id = wx.getStorageSync('id')
    if (!token && !id) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    } 
    else if(this.data.driverLoginStatus==2508){
      wx.navigateTo({
        url: '/pages/riderApply/riderApply'
      })
    }else if(this.data.driverLoginStatus==2551){
      // loading('刷新中')
      this._getOrdersDetail(1)
    }
  },

  /*订单列表*/
  async _getOrdersDetail(status) {
    loading('加载中')
    // console.log(this.data.disCampus);
    const driverId = wx.getStorageSync('id')
    const size = 3//页面展示条数
    const type = status == 1 ? 'orderLists' : status == 2 ? 'goodsLists' : status == 3 ? 'deliveryLists' : 'endUpLists'
    const goods = this.data.orders[type]
    const pageNum = goods.pageNum //页码
    const campus = status == 1 ? this.data.disCampus : null
    const riderId = status != 1 ? driverId : null
    let showList = []
    for(let i=1;i<pageNum+1;i++){
      const page=i
      await getOrdersDetail(page, size, status, campus, riderId).then(res => {
        // console.log(res);
        hideLoading()
        // 获取数据列表
        const itemList = res.data.data.list
        showList.push(...itemList)
        goods.isHasNextPage=res.data.data.hasNextPage
      }).catch(res => {
        totast('系统错误，请稍后重试')
      })
    }
    const newList = `orders.${type}.lists`
    let oldList = goods.lists
    oldList=showList
    // 审核通过才可显示
    if(this.data.driverLoginStatus==2551){
      this.setData({
        [newList]: oldList
      })
    }
  },

 onReachBottom: function () {   
    const index=this.data.index
    const type=index==0?'orderLists':index==1?'goodsLists':'deliveryLists'
    const status=index+1
    // console.log('加载更多');
    // console.log(type);  
    const goods = this.data.orders[type]
    const isHasNextPage=goods.isHasNextPage
    if(isHasNextPage){
      this.setData({
        isHideLoadMore:true
      })
      goods.pageNum++
      this._getOrdersDetail(status)
    } else{
      this.setData({
        isHideLoadMore:false,
        isHiddenMore:true
      })
    }
  },


    /**
   * 抢单
   **/
  takeOrders(e) {
    // 获取页面订单相关信息
    const itemInfo = e.currentTarget.dataset.item
    // console.log(itemInfo);
    wx.showModal({
      content: '是否确认接收此订单',
      success: (res) => {
        if (res.confirm) {
          // 调用抢单接口         
          this._getOrders(itemInfo)
        }
      }
    })
  },

  /*抢单*/
  _getOrders(allId) {
    const driverId = wx.getStorageSync('id')
    const id = allId.id
    const orderId = allId.orderId
    const orderNumber = allId.orderNumber
    const shopId = allId.shopId
    const status = allId.status
    const userId = allId.userId
    loading('加载中')
    getOrders(id, orderId, orderNumber, driverId, shopId, 1, userId).then(res => {
      hideLoading()
      this._getOrdersDetail(1)
      this._getOrdersDetail(2)
    })
  },

  /**
   * 取货
   **/
  takeGoods(e) {
    // console.log(e);
    // 获取抢单的索引
    const index = e.currentTarget.dataset.index
    // 获取抢单数据
    const item = e.currentTarget.dataset.item
    wx.showModal({
      content: '是否确认接收此订单',
      success: (res) => {
        if (res.confirm) {
          this._updateOrderStatus(item, 7)
        }
      }
    })
  },

  /**
   * 待送达
   */
  async deliveryGoods(e) {
    // console.log(e);
    // 获取抢单数据
    const index = e.currentTarget.dataset.index
    // 获取抢单的索引
    const item = e.currentTarget.dataset.item
    wx.showModal({
      content: '是否确认接收此订单',
      success: (res) => {
        if (res.confirm) {
          this._updateOrderStatus(item, 8,(orderNumber, money,deliveryFee,shopId)=>{
            oncePaySharing(orderNumber, money,deliveryFee,shopId).then(res=>{
              if(res.data.code !== 3200){
                totast('失败',2000)
              }
            })
          })
        }
      }
    })
  },

  // 更新订单状态
  async _updateOrderStatus(item, status,callback) {
    const totalAmount = item.totalAmount
    const deliveryFee = item.deliveryFee
    const id = item.id
    const shopId = item.shopId
    const orderNumber = item.orderNumber
    const orderId = item.orderId
    const userId = status == 8 ? item.userId : null
    loading('加载中')
    await updateOrderStatus(id, orderId, orderNumber, shopId, status, userId).then(res => {
      hideLoading()
      if (status == 7) {
        this._getOrdersDetail(2) 
      }   
      this._getOrdersDetail(3)  
    }).then(()=>{
      callback(orderNumber, totalAmount,deliveryFee,shopId)
    })
  },

  /**
   * 页面监听函数
   */
  handleEmitIndex(e) {
    this.setData({
      index: e.detail
    })
  },

  /* 
  更多部分 
  */
  handleMore() {
    // console.log("展示弹窗");
    const isShow = !this.data.isShow
    this.setData({
      isShow
    })
    // console.log(this.data.isShow);
  },
  toHistory() {
    this.setData({
      isShow: false
    })
    const token = wx.getStorageSync('token')
    const id = wx.getStorageSync('id')
    if (!token && !id) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    } else if(this.data.driverLoginStatus==2508){
      wx.navigateTo({
        url: '/pages/riderApply/riderApply'
      })
    }else if(this.data.driverLoginStatus==2551){
      wx.navigateTo({
        url: '/pages/orderHistory/orderHistory'
      })
    }
  },
  toProfile() {
    this.setData({
      isShow: false
    })
    const token = wx.getStorageSync(TOKEN)
    const id = wx.getStorageSync('id')
    if (!token && !id) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    } else if(this.data.driverLoginStatus==2508){
      wx.navigateTo({
        url: '/pages/riderApply/riderApply'
      })
    }else if(this.data.driverLoginStatus==2551){
      wx.navigateTo({
        url: '/pages/personPage/personPage'
      })
    }
  },
  toParcelModule() {
    this.setData({
      isShow: false
    })
    wx.navigateTo({
      url: '/pages/parcelModule/parcelPage/parcelPage'
    })
  },

  /* 订单细节 */
  showDetailPage(e) {
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?item=' + JSON.stringify(e.currentTarget.dataset.item)
    })
  },

  /** 联系商家 和顾客*/
  callCusMer(e) {
    console.log(e);
    const phoneNum = e.currentTarget.dataset.phonenum
    this.setData({
      showBottomDialog: true,
      telephoneNumber: phoneNum
    })
  },
  confirmCall() {
    const phoneNumber=this.data.telephoneNumber
    this.setData({
      telephoneNumber: null,
      phoneNumber
    })
  },
  dialOut(){
    const phoneNumber=this.data.phoneNumber
    wx.makePhoneCall({
      phoneNumber:phoneNumber,
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



  /* 
  检测登录状态
  */
  _checkLoginStatus(driverId) {
    checkLoginStatus(driverId).then(res => {
      wx.setStorageSync('driverStatus', res.data.code)
      this.setData({
        driverLoginStatus:res.data.code
      })
      // console.log(wx.getStorageSync('driverStatus'),'登录状态');     
      if (res.data.code == 2508) {
        // 骑手还没上传证明材料
        wx.redirectTo({
          url: '/pages/riderApply/riderApply',
        })
      } else if (res.data.code == 2550 || res.data.code == 2552 || res.data.code==2553) {
        // 骑手正在审核/审核未通过/封禁
        console.log('跳转前');
        wx.redirectTo({
          url: '/pages/examPage/examPage?status=' + JSON.stringify(res.data.code)
        })
      }
    })
  },

  /* 
  获取骑手信息
  */
  async _getDriverInfo(driverId) {
    await getDriverInfo(driverId).then(res => {
      wx.setStorageSync('campus', res.data.data.campusName)
      const disCampus = res.data.data.campusName
      this.setData({
        disCampus
      })
    })
  },

})