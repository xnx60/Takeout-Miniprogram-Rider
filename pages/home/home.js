import {
  getOrders,
  getOrdersDetail,
  updateOrderStatus
}from '../../service/home'

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    campus:app.globalData.campus,
    telephoneNumber:1234567,
    orders:{
      orderLists:{
        page:1,
        lists:[
          {
            id:29,
            orderId:40,
            riderId:1,
            shopId:1,
            userId:1,
            status:1,
            businessPhone:'1361895937141222',
            data:'2020-10-28 05:14:15',
            completeTime:'2020-10-28 05:14:00',
            deliveryAddress:'广东工业大学1111111111111111',
            deliveryFee:'5元',
            orderNumber:'1',
            remarks:'备注备注备注备注备注备注备注备注',
            shopAddress:'美团店铺地址地址地址地址1',
            shopName:'美团店铺',
            shopPicture:'',
            totalAmount:'546.54',
            totalQuantity:5,
            userName:'CAT111工作室',
            userPhone:'18236978456'
          }
        ]
      },
      goodsLists:{
        page:1,
        lists:[
          {
            businessPhone:'18856237412',
            data:'2020-10-28 05:14:15',
            completeTime:'',
            deliveryAddress:'',
            deliveryFee:'',
            orderNumber:'11',
            remarks:'',
            status:2,
            shopAddress:'美团店铺地址地址地址地址2',
            shopName:'美团店铺',
            shopPicture:'',
            totalAmount:'546.54',
            totalQuantity:5,
            userName:'CAT222工作室',
            userPhone:'18236978456'
          }
        ]
      },
      deliveryLists:{
        page:1,
        lists:[
          {
            businessPhone:'18856237412',
            data:'2020-10-28 05:14:15',
            completeTime:'',
            deliveryAddress:'',
            deliveryFee:'',
            orderNumber:'',
            remarks:'',
            shopAddress:'',
            shopName:'',
            shopPicture:'',
            totalAmount:'546.54',
            totalQuantity:5,
            userName:'CAT333工作室',
            userPhone:'18236978456'
          }
        ]
      }
    },
    index:0,
    isShow:false,
    showBottomDialog:false
  },
  onShow(){
    console.log(this.data.campus);
    
    this._getOrdersDetail(1)
    this._getOrdersDetail(2)
    this._getOrdersDetail(3)
    
  },
  updateList(){
    // console.log('刷新列表');
    this._getOrdersDetail(1)
  },

  _getOrdersDetail(status){
    const size=11
    const type= status==1?'orderLists':status==2?'goodsLists':status==3?'deliveryLists':'endUpLists'
    const goods = this.data.orders[type]
    const pageNum=goods.page
    const campus=status==1?this.data.campus:null
    const riderId=status!=1?9:null
    getOrdersDetail(pageNum,size,status,campus,riderId).then(res=>{
      // console.log(res);
      
      // 获取数据列表
      const list=res.data.data.list
      let oldList=goods.lists
      oldList = list
      // console.log(oldList);
      
      const newList=`orders.${type}.lists`
      // console.log(newList);
      
      // 将获取的数据列表渲染
      this.setData({
        [newList]:oldList
      }) 
    }).catch(res=>{
      console.log(res);
      
      console.log('请求失败');
    })
  },

  _getOrders(allId){
    const id=allId.id
    const orderId=allId.orderId
    const orderNumber=allId.orderNumber
    const riderId=allId.riderId
    const shopId=allId.shopId
    const status=allId.status
    const userId=allId.userId
    getOrders(id,orderId,orderNumber,9,shopId,1,userId).then(res=>{
      // console.log(res);
      
      this._getOrdersDetail(2)    
    })
  },
  /**
  * 抢单
  **/
  takeOrders(e) {
    // 获取页面订单相关信息
    const itemInfo = e.currentTarget.dataset.item
    // console.log(itemInfo);
    
    wx.showModal({
      content:'是否确认接收此订单',
      success: (res)=>{       
        if(res.confirm){
          // 调用抢单接口         
          this._getOrders(itemInfo)
        }      
      }
    })
  },
  /**
  * 取货
  **/
_updateOrderStatus(item,status){
  const id=item.id
  const shopId=item.shopId
  const orderNumber=item.orderNumber
  const orderId=item.orderId
  const userId=status==8?item.userId:null
  updateOrderStatus(id,orderId,orderNumber,shopId,status,userId).then(res=>{
    if(status==7){
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
      content:'是否确认接收此订单',
      success: (res)=>{
        if(res.confirm){  
          
          
          this._updateOrderStatus(item,7)
        
          console.log('点击确定取货');
          // const oldGoodsList=this.data.orders.goodsLists.lists         
          // const newGoodsList=`orders.goodsLists.lists` 
          // const oldDeliveryList=this.data.orders.deliveryLists.lists
          // const newDeliveryList=`orders.deliveryLists.lists` 
          // oldGoodsList.splice(index,1)
          // oldDeliveryList.splice(1,0,item)
          
          //  this.setData({
          //    [newGoodsList]:oldGoodsList,
          //    [newDeliveryList]:oldDeliveryList
          //  })      
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
      content:'是否确认接收此订单',
      success: (res)=>{
        if(res.confirm){
          this._updateOrderStatus(item,8)     
          // this.data.deliveryLists.splice(0,0,item)
          // const oldDeliveryList=this.data.orders.deliveryLists.lists
          // const newDeliveryList=`orders.deliveryLists.lists` 
          // oldDeliveryList.splice(index,1)     
          // this.setData({
          //   [newDeliveryList]:oldDeliveryList
          // })         
        }      
      }
    })
  },
  /**
   * 页面监听函数
   */
  callShop() {
    this.setData({
      showBottomDialog: true
    })
  },
  hiddenBottomDialog() {
    this.setData({
      showBottomDialog: false
    })
  },



  handleEmitIndex(e){
    this.setData({
      index:e.detail
    })
  },
  toProfile(){
    wx.navigateTo({
      url: '/pages/personPage/personPage'
    })
  },
  toHistory(){
    wx.navigateTo({
      url: '/pages/orderHistory/orderHistory'
    })
  },
  toApply(){
    wx.navigateTo({
      url: '/pages/riderApply/riderApply'
    })
  },
  handleMore(){
    console.log("展示弹窗");
    const isShow= !this.data.isShow
    this.setData({
      isShow
    })
    console.log(this.data.isShow);
    
  },
  showDetailPage(e){
    // console.log("展示订单详细信息");
    // console.log(e);
    
    
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?item=' + JSON.stringify(e.currentTarget.dataset.item)
    })
  },

  /** 联系商家 和骑手*/ 
  callCusMer(e) {
    console.log(e);
    const phoneNum=e.currentTarget.dataset.phonenum
    this.setData({
      showBottomDialog: true,
      telephoneNumber:phoneNum
    })
  },
  confirmCall(){
    this.setData({
      telephoneNumber:null
    })
  },
  hiddenBottomDialog() {
    this.setData({
      showBottomDialog: false
    })
  },
 

})