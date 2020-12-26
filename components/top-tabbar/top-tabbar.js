// components/top-tabbar/top-tabbar.js
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft:0,
    tabbarList:[
      '待接单','待取货','待送达'
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tabSelect(e) {
      // console.log(e);
      const index=e.currentTarget.dataset.id
      
      this.setData({
        TabCur: e.currentTarget.dataset.id,
        scrollLeft: (e.currentTarget.dataset.id-1)*60
      })
      this.triggerEvent('emitIndex',index)
    }
  }
})
