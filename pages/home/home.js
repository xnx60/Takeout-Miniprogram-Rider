import {
  getOrders,
  getOrdersDetail,
  updateOrderStatus
} from '../../service/home'
import {
  TOKEN,
  hideLoading,
  loading
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
    disCampus: '',
    telephoneNumber: 1234567,
    phoneNumber:1234555,
    orders: {
      orderLists: {
        page: 1,
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
        page: 1,
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
        page: 1,
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
    isHideLoadMore:false
  },
  async onShow() {
    //判断登录注册状态
    const token = wx.getStorageSync(TOKEN)
    const id = wx.getStorageSync('id')
    if (token && id) {
      this._checkLoginStatus(id)
    }

    // 获取校区
    const driverId = wx.getStorageSync('id')
    await this._getDriverInfo(driverId)
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
    } else {
      // loading('刷新中')
      this._getOrdersDetail(1)
    }

  },

  /*订单列表*/
  _getOrdersDetail(status) {
    // console.log(this.data.disCampus);
    const driverId = wx.getStorageSync('id')
    const size = 3//页面展示条数
    const type = status == 1 ? 'orderLists' : status == 2 ? 'goodsLists' : status == 3 ? 'deliveryLists' : 'endUpLists'
    const goods = this.data.orders[type]
    const pageNum = goods.page //页码
    const campus = status == 1 ? this.data.disCampus : null
    const riderId = status != 1 ? driverId : null
    getOrdersDetail(pageNum, size, status, campus, riderId).then(res => {
      console.log(res);
      hideLoading
      // 获取数据列表
      const list = res.data.data.list
      let oldList = goods.lists
      oldList.push(...list)
      goods.isHasNextPage=res.data.data.hasNextPage
      // console.log(goods.isHasNextPage);
      
      // console.log(oldList);

      const newList = `orders.${type}.lists`
      // console.log(newList);

      // 将获取的数据列表渲染
      this.setData({
        [newList]: oldList
      })
    }).catch(res => {
      console.log(res);

      // console.log('请求失败');
    })
  },

 onReachBottom: function () {
    
    const index=this.data.index
    const type=index==0?'orderLists':index==1?'goodsLists':'deliveryLists'
    const status=index+1
    console.log('加载更多');
    console.log(type);
    
    const goods = this.data.orders[type]
    const isHasNextPage=goods.isHasNextPage
    if(isHasNextPage){
      this.setData({
        isHideLoadMore:true
      })
      goods.page++
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
    getOrders(id, orderId, orderNumber, driverId, shopId, 1, userId).then(res => {
      // console.log(res);
      this._getOrdersDetail(1)
      this._getOrdersDetail(2)
    })
  },

  /**
   * 取货
   **/
  _updateOrderStatus(item, status) {
    const id = item.id
    const shopId = item.shopId
    const orderNumber = item.orderNumber
    const orderId = item.orderId
    const userId = status == 8 ? item.userId : null
    updateOrderStatus(id, orderId, orderNumber, shopId, status, userId).then(res => {
      if (status == 7) {
        this._getOrdersDetail(2)
      }
      this._getOrdersDetail(3)
    })
  },

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

          // console.log('点击确定取货');  
        }
      }
    })
  },

  /**
   * 待送达
   */
  deliveryGoods(e) {
    // console.log(e);
    // 获取抢单数据
    const index = e.currentTarget.dataset.index
    // 获取抢单的索引
    const item = e.currentTarget.dataset.item
    wx.showModal({
      content: '是否确认接收此订单',
      success: (res) => {
        if (res.confirm) {
          this._updateOrderStatus(item, 8)
        }
      }
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
    } else {
      wx.navigateTo({
        url: '/pages/personPage/personPage'
      })
    }


  },
  toHistory() {
    this.setData({
      isShow: false
    })
    const token = wx.getStorageSync(TOKEN)
    const id = wx.getStorageSync('id')
    if (!token && !id) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    } else {
      wx.navigateTo({
        url: '/pages/orderHistory/orderHistory'
      })
    }

  },
  toApply() {
    wx.navigateTo({
      url: '/pages/riderApply/riderApply'
    })
  },

  handleMore() {
    // console.log("展示弹窗");
    const isShow = !this.data.isShow
    this.setData({
      isShow
    })
    console.log(this.data.isShow);

  },
  showDetailPage(e) {

    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?item=' + JSON.stringify(e.currentTarget.dataset.item)
    })
  },

  /** 联系商家 和骑手*/
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
      // console.log(driverId)  
      // console.log(res);
      // console.log(res.data.code);

      if (res.data.code == 2508) {
        // 骑手还没上传证明材料
        wx.redirectTo({
          url: '/pages/infoCom/infoCom',
        })
      } else if (res.data.code == 2550 || res.data.code == 2552) {
        // 骑手正在审核/审核未通过
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
      wx.setStorageSync('campus', res.data.data.disCampus)
      const disCampus = res.data.data.disCampus
      this.setData({
        disCampus
      })
    })
  },

})