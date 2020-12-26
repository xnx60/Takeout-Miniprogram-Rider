// components/order-item/order-item.js
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    menu:{
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    showDetail(){
      // console.log("展示订单详细信息");
      
      wx.navigateTo({
        url: '/pages/order-detail/order-detail',
      })
    }
  }
})
