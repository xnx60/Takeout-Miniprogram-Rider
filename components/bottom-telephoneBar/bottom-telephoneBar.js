// components/bottom-telephoneBar/bottom-telephoneBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    phoneNumber:{
      type: Array,
      value:'电话号码为空'
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
    confirmCall(){
      this.setData({
        phoneNum:null
      })
    },
  }
})
